import { getRequestContext } from "@cloudflare/next-on-pages";
import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";

export const runtime = "edge";

interface NpmPackage {
    name: string;
    description: string;
    links: {
      npm: string;
      homepage: string;
      repository?: string;
      bugs: string;
    };
  }
  
interface NpmSearchResult {
    objects: {
      package: NpmPackage;
  
      score: {
        detail: {
          popularity: number;
        };
      };
    }[];
    total: number;
  }

async function getNpmMeta(pkg_name: string): Promise<NpmSearchResult> {
    const res = await fetch(
      `https://registry.npmjs.org/-/v1/search?text=${pkg_name}`
    );
  
    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error("Failed to fetch getNpmMeta");
    }
    return res.json();
  }


interface realMeta {
    pkg:string
    description: string
    repository: string
    popularity: number
  }

export async function getRealMeta(pkg: string):Promise<realMeta> {
  const env = getRequestContext().env;

  // get a value from the namespace
  //   const kvValue = await myKv.get(`kvTest`) || false

  const adapter = new PrismaD1(env.DB);
  const prisma = new PrismaClient({ adapter });

  // 在数据库中查找
  let packageFromDB = await prisma.pkgs.findUnique({
    where: { pkg },
  });

  if (packageFromDB) {
    // 如果在数据库中找到了，返回数据库中的数据
    return {
      pkg,
      description: packageFromDB.description ?? "",
      repository: packageFromDB.repository ?? "",
      popularity: packageFromDB.popularity ?? 0,
    }
  } else {
    // 如果在数据库中找不到，去第三方 API 查找
    let { objects: npm_meta } = await getNpmMeta(pkg);

    let packages_meta = npm_meta.map((item) => {
      let {
        name,
        description,
        links: { repository },
      } = item.package;
      let {
        detail: { popularity },
      } = item.score;
      return {
        pkg: name,
        description,
        repository: repository ?? "",
        popularity: popularity ?? 0,
      };
    });
    //将从第三方 API 获取到的数据写入数据库
    await prisma.pkgs.createMany({
      data: packages_meta,
    });

    //
    let package_meta = npm_meta.find((e) => e.package.name === pkg)!;

    let {
      description,
      links: { repository },
    } = package_meta.package;
    let {
      detail: { popularity },
    } = package_meta.score;

    return {
      pkg,
      description: description ?? "",
      repository: repository ?? "",
      popularity: popularity ?? 0,
    }
  }
}



interface cnpm_data {
  downloads: {
    day: string;
    downloads: number;
  }[];
  versions: {
    [version: string]: {
      day: string;
      downloads: number;
    }[];
  };
}

export async function getCnpmData(
  range: string,
  pkg_name: string
): Promise<cnpm_data> {
  const res = await fetch(
    `https://registry.npmmirror.com/downloads/range/${range}/${pkg_name}`
  );
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }
  return res.json();
}

function getMajorList(data: cnpm_data["versions"]) {
  const newSet = new Set();
  for (const key of Object.keys(data)) {
    newSet.add(parseInt(key.split(".")[0]));
  }
  return [...newSet];
}

export function getCnpmWeekData(data: cnpm_data["versions"], pkg_name: string) {
  const major_list = getMajorList(data);
  const entried_data = Object.entries(data);

  const pie_data = major_list
    .map((major) => {
      const result = entried_data
        .filter(([version]) => version.startsWith(`${major}.`))
        .reduce((acc, [, downloads]) => {
          const alldownloads = downloads.reduce(
            (acc, { downloads }) => (acc += downloads),
            0
          );
          acc += alldownloads;
          return acc;
        }, 0);
      return { version: `${pkg_name} ${major}`, count: result };
    })
    .sort((a, b) => b.count - a.count);

  return pie_data;
}