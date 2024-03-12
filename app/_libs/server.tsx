import projects_data from "@/_data/projects_data.json";
import cnpm_data from "@/_data/cnpm_data.json";
import {
  cnpm_url,
  range,
  getMonthList,
  getMajorDatasets,
  getMainDatasets,
  getPackageDetail,
  calculateYearsAgo,
  delay,
} from "@/_libs/func";

let count = 0;
export async function getRemoteData(pkg: string) {
  let res;
  try {
    res = await fetch(`${cnpm_url}/${range}/${pkg}`, { cache: "no-store" });
  } catch (error) {
    console.error("getRemoteData Error");
  }
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error(` Failed to fetch  data`);
  }

  return res.json();
}

function getLocalData(pkg: string) {
  let result = cnpm_data[pkg];

  return result;
}

const monthList = getMonthList(range);

export async function getPkgData(pkg_name) {
  const [pkg_data] = projects_data.filter((e) => e.name == pkg_name);
  // pkg_data.time.years = calculateYearsAgo(
  //   pkg_data.time.created,
  //   getMonthList(range)
  // );

  // let data;
  // try {
  //   data = await getRemoteData(pkg_name);
  // } catch (err) {
  //   console.error("api/package/[...slug],getData", pkg_name);
  // }

  // const major_chartdata = {
  //   labels: monthList,
  //   datasets: getMajorDatasets(monthList, data, pkg_name),
  // };

  // const main_chartdata = {
  //   labels: monthList,
  //   datasets: [getMainDatasets(monthList, data, pkg_name)],
  // };

  let data = getLocalData(pkg_name);

  const major_chartdata = data.major_chartdata;

  const main_chartdata = data.main_chartdata;
  const obj = { pkg_data, major_chartdata, main_chartdata };
  return obj;
}

import data from "@/_data/raw_data.json";

export async function getTags() {
  // 生成按照tags分类的JSON
  const categorizedData = data.reduce((acc, project) => {
    project.tags.forEach((tag) => {
      if (!acc[tag]) {
        acc[tag] = [];
      }
      acc[tag].push(project.name);
    });
    return acc;
  }, {});

  // 对categorizedData进行倒序排序并转换为数组
  const sortedCategorizedData = Object.entries(categorizedData)
    .sort((a, b) => b[1].length - a[1].length)
    .map(([tag, projects]) => ({ tag, projects }));
  return sortedCategorizedData;
}
export const TAGS = await getTags();

const LOCAL_URL = "http://localhost:3000";

export async function getTag(tag_name) {
  const decode_tag_name = decodeURIComponent(tag_name);

  const [tag_data] = TAGS.filter((tag) => {
    return tag.tag === decode_tag_name;
  });
  // const pkg_list = tag_data.projects.slice(0, 5);
  const pkg_list = tag_data.projects;
  let datasets;
  try {
    datasets = await Promise.all(
      pkg_list.map(async (pkg, index) => {
        const pkg_data = await getPkgData(pkg);
        return pkg_data.main_chartdata.datasets[0];
      })
    );
  } catch (err) {
    console.error("api/tags/[slug],datasets", datasets);
  }
  const datasets_equal = datasets.flat();

  const monthList = getMonthList(range);
  const chartData = {
    labels: monthList,
    datasets: datasets_equal,
  };

  tag_data.chartData = chartData;
  return tag_data;
}
