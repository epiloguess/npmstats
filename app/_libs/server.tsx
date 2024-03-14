import raw_data from "@/_data/raw_data.json";
import { getPkgData, getDatasets, monthList } from "@/_libs/func";

async function getTags() {
  const data = Object.entries(raw_data);
  // 生成按照tags分类的JSON
  const categorizedData = data.reduce((acc, [pkg_name, tags]) => {
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
    .map(([tag, projects]) => ({ tag, projects }));
  return sortedCategorizedData;
}
export const TAGS = await getTags();

export async function getTag(tag_name) {
  // const decode_tag_name = decodeURIComponent(tag_name);

  const tag_data = TAGS.find((tag) => tag.tag === tag_name);
  const pkg_list = tag_data.projects;

  const count = function count(pkgData) {
    const [pkg_name] = Object.keys(pkgData.main_chartdata);
    const downloads = pkgData.main_chartdata[pkg_name].reduce((acc, cur) => {
      return (acc += Object.values(cur)[0]);
    }, 0);
    return { pkg_name, downloads };
  };
  let rank;
  try {
    rank = await Promise.all(
      pkg_list.map(async (pkg, index) => {
        const pkg_data = await getPkgData(pkg);
        const result = count(pkg_data);
        return result;
      })
    );
  } catch (err) {
    console.error("api/tags/[slug],rank", err);
  }

  let datasets;
  try {
    datasets = await Promise.all(
      pkg_list.map(async (pkg, index) => {
        const pkg_data = await getPkgData(pkg);
        return getDatasets(pkg_data.main_chartdata);
      })
    );
  } catch (err) {
    console.error("api/tags/[slug],datasets", err);
  }
  const datasets_equal = datasets.flat();
  datasets_equal.sort((a, b) => {
    return (
      b.data.reduce((acc, cur) => (acc += cur)) -
      a.data.reduce((acc, cur) => (acc += cur))
    );
    // b.data.at(-1)-a.data.at(-1)
  });
  const chartData = {
    labels: monthList,
    datasets: datasets_equal,
  };

  tag_data.chartData = chartData;
  rank.sort((a, b) => {
    return b.downloads - a.downloads;
    // b.data.at(-1)-a.data.at(-1)
  });
  tag_data.rank = rank;

  return tag_data;
}
