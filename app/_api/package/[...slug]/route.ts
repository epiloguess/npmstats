import projects_data from "@/_data/projects_data.json";

import {
  cnpm_url,
  range,
  getMonthList,
  getMajorDatasets,
  getMainDatasets,
  getPackageDetail,
  calculateYearsAgo,delay
} from "@/_libs/func";
import { resolve } from "path";

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

const monthList = getMonthList(range);

export async function GET(
  request: Request,
  { params }: { params: { slug: string[] } }
) {
  const pkg_name = decodeURIComponent(params.slug.join("/"));
  const [pkg_data] = projects_data.filter((e) => e.name == pkg_name);
  // pkg_data.time.years = calculateYearsAgo(
  //   pkg_data.time.created,
  //   getMonthList(range)
  // );
  let data;
  try {
    data = await getData(pkg_name);
  } catch (err) {
    console.error("api/package/[...slug],getData", pkg_name);
  }

  const major_chartdata = {
    labels: monthList,
    datasets: getMajorDatasets(monthList, data, pkg_name),
  };

  const main_chartdata = {
    labels: monthList,
    datasets: [getMainDatasets(monthList, data, pkg_name)],
  };
  const obj = { pkg_data, major_chartdata, main_chartdata };
  return Response.json(obj);
}

export async function generateStaticParams() {
  return projects_data.map((project) => {
    const project_name = project.name?.split("/");

    return { slug: project_name };
  });
}

// export const dynamic = 'force-dynamic' // defaults to auto
