import { Package } from "@type/npm";

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

export async function getPkgMeta(pkg: string): Promise<Package> {
  try {
    let res = await fetch(`https://api.npmstats.com/package/${pkg}`);
    if (!res) {
      throw new Error(`fail to fetch ${pkg}`);
    }
    return res.json();
  } catch (e) {
    throw e;
  }
}

export type version_downloads_array = { version: number; downloads: number }[];

export async function getVersions(
  source: string,
  pkg: string
): Promise<version_downloads_array> {
  const res = await fetch(`https://api.npmstats.com/versions/${source}/${pkg}`);
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error(`Failed to fetch ${source},${pkg}`);
  }

  return res.json();
}


export async function getPackges(): Promise<Package[]> {
  const res = await fetch("https://api.npmstats.com/packages", {
    next: { revalidate: 30 },
  });
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.json();
}