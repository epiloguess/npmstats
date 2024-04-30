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
  pkg: string;
  description: string;
  repository: string;
  popularity: number;
}

export async function GET(
  request: Request,
  { params }: { params: { pkg: string[] } }
) {
  const undecodedString = params.pkg.join("/");
  const pkg = decodeURIComponent(undecodedString);

  const env = getRequestContext().env;
  const adapter = new PrismaD1(env.DB);
  const prisma = new PrismaClient({ adapter });

  // 在数据库中查找
  let packageFromDB = await prisma.pkgs.findUnique({
    where: { pkg },
  });

  if (packageFromDB) {
    // 如果在数据库中找到了，返回数据库中的数据
    return Response.json({
      pkg,
      description: packageFromDB.description ?? "",
      repository: packageFromDB.repository ?? "",
      popularity: packageFromDB.popularity ?? 0,
    });
  } else {
    // 如果在数据库中找不到，去第三方 API 查找
    let { objects: npm_meta } = await getNpmMeta(pkg);
    //将从第三方 API 获取到的数据写入数据库

    //
    let package_meta = npm_meta.find((e) => e.package.name === pkg)!;

    let {
      description,
      links: { repository },
    } = package_meta.package;
    let {
      detail: { popularity },
    } = package_meta.score;

    const data = await prisma.pkgs.create({
      data: {
        pkg,
        description: description ?? "",
        repository: repository ?? "",
        popularity: popularity ?? 0,
      },
    });
    return Response.json(data);
  }
}
