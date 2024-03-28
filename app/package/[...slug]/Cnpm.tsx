import { lastMonthRange } from "@/_libs/func";

import PieChart from "@/_component/PieChart";

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

async function getCnpmData(range: string, pkg_name: string): Promise<cnpm_data> {
  const res = await fetch(`https://registry.npmmirror.com/downloads/range/${range}/${pkg_name}`);
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

function getCnpmWeekData(data: cnpm_data["versions"], pkg_name: string) {
  const major_list = getMajorList(data);
  const entried_data = Object.entries(data);

  const pie_data = major_list
    .map((major) => {
      const result = entried_data
        .filter(([version]) => version.startsWith(`${major}.`))
        .reduce((acc, [, downloads]) => {
          const alldownloads = downloads.reduce((acc, { downloads }) => (acc += downloads), 0);
          acc += alldownloads;
          return acc;
        }, 0);
      return { version: `${pkg_name} ${major}`, count: result };
    })
    .sort((a, b) => b.count - a.count);

  return pie_data;
}

export default async function Page({ params }: { params: { slug: string[] } }) {
  const undecodedString = params.slug.join("/");
  const pkg_name = decodeURIComponent(undecodedString);

  const cnpm_data = await getCnpmData(lastMonthRange, pkg_name);

  const cnpm_week_data = getCnpmWeekData(cnpm_data.versions, pkg_name);

  return (
    <div className='flex flex-col gap-2'>
      <h3 className=' m-auto bg-gray-50 border-2 px-2 rounded mt-4'>CNPM</h3>

      <div
        className={
          cnpm_week_data.length < 10
            ? "h-[300px]"
            : cnpm_week_data.length < 15
            ? "h-[400px]"
            : cnpm_week_data.length < 20
            ? "h-[500px]"
            : cnpm_week_data.length < 30
            ? "h-[600px] md:h-[600px]"
            : ` h-[600px] md:h-[600px]`
        }>
        <PieChart data={cnpm_week_data}></PieChart>
      </div>
    </div>
  );
}
