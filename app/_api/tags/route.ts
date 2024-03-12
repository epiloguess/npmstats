import data from "@/_data/raw_data.json";

import {
  cnpm_url,
  range,
  getMonthList,
  getMajorDatasets,
  getMainDatasets,
} from "@/_libs/func";

export async function GET() {
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

  return new Response(JSON.stringify(sortedCategorizedData), {
    headers: { "Content-Type": "application/json" },
  });
}

// export const dynamic = 'force-dynamic' // defaults to auto