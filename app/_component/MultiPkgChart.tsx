import { lastMonthRange } from "@/_libs/func";

import NpmLineChart from "@/_component/NpmLineChart";

interface DownloadData {
  start: string;
  end: string;
  package: string;
  downloads: {
    downloads: number;
    day: string;
  }[];
}

async function getNpmDownloads(pkg_name: string, lastMonthRange: string): Promise<DownloadData> {
  const res = await fetch(`https://api.npmjs.org/downloads/range/${lastMonthRange}/${pkg_name}`);
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.json();
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

async function getCnpmDownloads(range: string, pkg_name: string): Promise<cnpm_data> {
  const res = await fetch(`https://registry.npmmirror.com/downloads/range/${range}/${pkg_name}`);
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }
  return res.json();
}

function getCnpmMonthData(range: string, data: cnpm_data["downloads"], pkg_name: string) {
  const [range_start, range_end] = range.split(":");
  const range_start_index = data.findIndex((e) => e.day === range_start);
  const range_end_index = data.findIndex((e) => e.day === range_end);
  const ranged_downloads = data.slice(range_start_index, range_end_index + 1);
  return {
    // start: range_start,
    // end: range_end,
    package: `${pkg_name} - cnpm`,
    downloads: ranged_downloads,
  };
}

async function getCnpmData(pkg_name: string) {
  const { downloads } = await getCnpmDownloads(lastMonthRange, pkg_name);
  const cnpm_month_data = getCnpmMonthData(lastMonthRange, downloads, pkg_name);
  return cnpm_month_data;
}

async function getNpmData(pkg_name: string) {
  const npm_downloads_data = await getNpmDownloads(pkg_name, lastMonthRange);
  const downloads = npm_downloads_data.downloads.map(({ downloads, day }) => ({
    downloads: parseInt("" + downloads / 63),
    day,
  }));
  const data_euqal = { package: pkg_name, downloads };
  return data_euqal;
}
export default async function App({ pkg_list }: { pkg_list: string[] }) {
  const promises = pkg_list.flatMap((pkg_name) => [getCnpmData(pkg_name), getNpmData(pkg_name)]);

  const data = await Promise.all(promises);
  const data_sorted = data.sort((a,b)=>(b.downloads.at(-1)?.downloads! - a.downloads.at(-1)?.downloads!))

  return (
      <NpmLineChart data={data_sorted}></NpmLineChart>
  );
}
