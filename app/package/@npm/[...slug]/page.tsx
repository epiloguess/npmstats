import { getPkgTag, PKG_META } from "@/_libs/func";
import PkgMajorDetail from "@/_component/PkgMajorDetail";
import MainVersionChart from "@/_component/MainVersionChart";
import projects_data from "@/_data/pkg_meta.json";
import { getPkgData } from "@/_libs/func";

import PieChart from '@/_component/PieChart';

import NpmLineChart from '@/_component/NpmLineChart'

function getMajorList(remoteData) {
  const newSet = new Set();
  for (const key of Object.keys(remoteData.downloads)) {
    newSet.add(parseInt(key.split(".")[0]));
  }
  return [...newSet];
}

async function getNpmData(pkg_name) {

  const encode_name = pkg_name.replace(/\//g, '%2F')
  const res = await fetch(`https://api.npmjs.org/versions/${encode_name}/last-week`);
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

async function getNpmDownloads(pkg_name) {
  const res = await fetch(`https://api.npmjs.org/downloads/range/last-month/${pkg_name}`);
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export default async function Page({ params }: { params: { slug: string[] } }) {
  const undecodedString = params.slug.join("/");

  const pkg_name = decodeURIComponent(undecodedString);


  //PieChart
  const npm_data = await getNpmData(pkg_name);
  const major_list = getMajorList(npm_data);
  const entries_data = Object.entries(npm_data.downloads);

  const pie_data = major_list.map((major) => {
    const result = entries_data
      .filter(([key, ]) => key.startsWith(`${major}.`))
      .reduce((acc, [, value]) => (acc += value),0);
      return {version:`${pkg_name} ${major}`,count:result}
  }).sort((a,b)=>(b.count - a.count));

  // NpmLineChart
  const npm_downloads_data = await getNpmDownloads(pkg_name)




  return (
    <div className="flex flex-col gap-2 ">
      <h3 className=" m-auto bg-slate-100 border-2 px-2 rounded mt-4" >NPM</h3>

      <div className="flex gap-2"></div>

      <div className="h-[300px]">
        <NpmLineChart data={npm_downloads_data}></NpmLineChart>
      </div>
      <div className="h-[300px] m-auto">
      <PieChart data={pie_data}></PieChart>
      </div>

    </div>
  );
}
// export async function generateStaticParams() {
//   const arr = projects_data.map((project) => {
//     const project_name = project.name?.split("/");
//     return { slug: project_name };
//   });
//   return arr;
// }
