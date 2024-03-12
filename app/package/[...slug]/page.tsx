import projects_data from "../../_data/projects_data.json";
import { cnpm_url, range, delay } from "../../_libs/func";
import PkgMajorDetail from "@/_component/PkgMajorDetail";
import MainVersionChart from "@/_component/MainVersionChart";

import { getPkgData, getTags, getTag } from "@/_libs/server";
async function getData(pkg: string) {
  const res = await fetch(`${cnpm_url}/${range}/${pkg}`, { cache: "no-store" });
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error(` Failed to fetch  data`);
  }

  return res.json();
}
const LOCAL_URL = "http://localhost:3000";

export default async function Page({ params }: { params: { slug: string[] } }) {
  const undecodedString = params.slug.join("/");
  const pkg_name = decodeURIComponent(undecodedString);
  let pkg_data;
  try {
    pkg_data = await getPkgData(pkg_name);
  } catch (err) {
    return console.error("获取pkg_data失败", err);
  }
  return (
    <div>
      <a href={`https://www.npmjs.com/package/${pkg_name}`}>{pkg_name}</a>
      <div>{pkg_data.pkg_data.description}</div>
      <div>
        {pkg_data.pkg_data.tags.map((tag) => (
          <div key={tag}>
            <p>
              #1 in &nbsp;
              <a href={`/tags/${tag}`}>{tag}</a>
            </p>
          </div>
        ))}
      </div>
      <div className="w-[800px] h-[400px]">
        <MainVersionChart data={pkg_data.main_chartdata}></MainVersionChart>
      </div>

      <div className="w-[800px] h-[400px]">
        <PkgMajorDetail
          pkg_name={pkg_name}
          data={pkg_data.major_chartdata}
        ></PkgMajorDetail>
      </div>
    </div>
  );
}
export async function generateStaticParams() {
  const arr = projects_data.map((project) => {
    const project_name = project.name?.split("/");
    return { slug: project_name };
  });

  return arr;
}
