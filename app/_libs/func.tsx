import raw_data from "@/_data/raw_data.json";

// 定义函数，将日期格式化为指定格式
const formatDate = (date: Date) => {
  // 获取年份
  const year = date.getFullYear();
  // 获取月份，并补0
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  // 获取日期，并补0
  const day = date.getDate().toString().padStart(2, "0");
  // 返回格式化后的日期字符串
  return `${year}-${month}-${day}`;
};

const get30DaysAgoDate = () => {
  const today = new Date();
  const oneDaysAgo = new Date(today);
  oneDaysAgo.setDate(today.getDate() - 2);

  const thirtyDaysAgo = new Date(today);
  if (today.getDate() > 15) {
    thirtyDaysAgo.setDate(1);
  } else {
    thirtyDaysAgo.setDate(today.getDate() - 31);
  }

  return `${formatDate(thirtyDaysAgo)}:${formatDate(oneDaysAgo)}`;
};
export const lastMonthRange = get30DaysAgoDate();

export function getRandomRGB() {
  const getRandomNumber = () => Math.floor(Math.random() * 155) + 50; // 调整范围到 50 到 205 之间的随机整数

  const x = getRandomNumber();
  const y = getRandomNumber();
  const z = getRandomNumber();

  return `rgb(${x}, ${y}, ${z})`;
}

export function getRandomARGB() {
  const getRandomNumber = () => Math.floor(Math.random() * 155) + 50; // 调整范围到 50 到 205 之间的随机整数

  const x = getRandomNumber();
  const y = getRandomNumber();
  const z = getRandomNumber();

  return `rgba(${x}, ${y}, ${z},0.66)`;
}

export function getChartOpt() {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "关闭较大比重的标签以放大密集区域",
      },
      tooltip: {
        mode: "nearest" as const,
        intersect: false, // 如果为 true，则仅当鼠标位置与元素相交时才应用工具提示模式。如果为 false，则将始终应用该模式。
        displayColors: true,
        multiKeyBackground: "transparent",
      },
    },
    hover: {
      mode: "index" as const,
      intersect: false,
    },
  };
  return options;
}

interface RawData {
  [key: string]: string[];
}
const typedRawData: RawData = raw_data;

export function getPkgTag(pkg_name: string) {
  return typedRawData[pkg_name];
}

function getTags() {
  const data = Object.entries(raw_data);
  // 生成按照tags分类的JSON
  const categorizedData = data.reduce((acc: { [key: string]: string[] }, [pkg_name, tags]) => {
    tags.forEach((tag) => {
      if (!acc[tag]) {
        acc[tag] = [];
      }
      acc[tag].push(pkg_name);
    });
    return acc;
  }, {});

  // 对categorizedData进行倒序排序并转换为数组
  const sortedCategorizedData = Object.entries(categorizedData)
    .sort((a, b) => b[1].length - a[1].length)
    .map(([tag, packages]) => {
      return { tag, packages };
    });
  return sortedCategorizedData;
}

//  export async function getTags() {
//   const data = Object.entries(raw_data);
//   // 生成按照 tags 分类的 JSON
//   const categorizedData = data.reduce((acc:{ [key: string]: string[] }, [pkg_name, tags]) => {
//     tags.forEach((tag) => {
//       if (!acc[tag]) {
//         acc[tag] = [];
//       }
//       acc[tag].push(pkg_name);
//     });
//     return acc;
//   }, {});

//   // 对 categorizedData 进行倒序排序
//   const sortedCategorizedData = Object.entries(categorizedData).sort((a, b) => b[1].length - a[1].length);

//   // 获取每个项目的下载量并按照下载量排序
//   const newData = [];
//   for (const [tag, projects] of sortedCategorizedData) {
//     const projectsWithDownloads = [];
//     for (const pkg_name of projects) {
//       const { downloads } = await getNpmDownloadsPoint(pkg_name);
//       projectsWithDownloads.push({ pkg_name, downloads });
//     }
//     const sortedProjects = projectsWithDownloads.sort((a, b) => parseInt(b.downloads) - parseInt(a.downloads));
//     newData.push({ tag, projects: sortedProjects.map((project) => project.pkg_name) });
//   }
//   return newData;
// }

export const TAGS = getTags();
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
  const res = await fetch(`https://registry.npmjs.org/-/v1/search?text=${pkg_name}`);

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch getNpmMeta");
  }
  return res.json();
}

export async function getRealMeta(pkg_name: string) {
  let { objects: npm_meta } = await getNpmMeta(pkg_name);
  let package_meta = npm_meta.find((e) => e.package.name === pkg_name)!;
  let {
    description,
    links: { repository },
  } = package_meta.package;
  let {
    detail: { popularity },
  } = package_meta.score;
  return { pkg: pkg_name, description, repository, popularity };
}

