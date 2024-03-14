import raw_data from "@/_data/raw_data.json";
import pkg_meta from "@/_data/pkg_meta.json";
import cnpm_data from "@/_data/cnpm_data.json";

export const delay = (ms: string) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const fetcher = (...args: string[]) =>
  fetch(...args).then((res) => res.json());
export const multiFetcher = function multiFetcher(...urls) {
  return Promise.all(urls[0].map((url) => fetcher(url)));
};

export const range = "2023-02-01:2024-02-01";

export const cnpm_url = "https://registry.npmmirror.com/downloads/range";

export function getRandomRGB() {
  const getRandomNumber = () => Math.floor(Math.random() * 155) + 50; // 调整范围到 50 到 205 之间的随机整数

  const x = getRandomNumber();
  const y = getRandomNumber();
  const z = getRandomNumber();

  return `rgb(${x}, ${y}, ${z})`;
}

function getMonthList(dateRangeString: string) {
  const [startDateStr, endDateStr] = dateRangeString.split(":");

  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);

  const result = [];

  // 循环生成日期
  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // 月份从0开始，需要加1，并补0
    result.push(`${year}-${month}`);

    // 增加一个月
    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  return result;
}

export const monthList = getMonthList(range);

export function getChartOpt(title) {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: `${title}`,
      },
      tooltip: {
        mode: "nearest",
        intersect: false,
        // displayColors: true,
        multiKeyBackground: "transparent",
        // xPadding: 10,
        // yPadding: 10,
        // titleMarginBottom: 10,
        // bodySpacing: 10,
      },
    },
    hover: {
      mode: "index",
      intersect: false,
    },
  };
  return options;
}


export function getDatasets(data) {
  const pkg_name = Object.keys(data);
  const datasets = pkg_name.map((pkg_name) => {
    const pkg_data = data[pkg_name];
    const values = pkg_data.map((item) => Object.values(item)[0]);
    const totalDownloads = values.reduce((acc, current) => {
      return (acc += current);
    }, 0);
    let Color = getRandomRGB()

    if (totalDownloads > 1000) {
      const obj = {
        label: pkg_name,
        data: values,
        fill: false,
        borderColor: Color,
        tension: 0.1,
        borderWidth: 4, // 设置线的宽度
        pointRadius: 4, // 设置点的大小
        cubicInterpolationMode: "monotone", // 启用平滑曲线
        backgroundColor: Color,
        pointHoverRadius: 4,
        pointBorderWidth: 1,
        pointBackgroundColor: "transparent",
        pointBorderColor: "transparent",
        pointHoverBackgroundColor: getRandomRGB(),
        pointHoverBorderColor: "#ffffff",
      };
      return obj;
    }
  });
  const filter_datasets = datasets.filter((e) => e !== undefined);
  return filter_datasets;
}

export function getPkgTag(pkg_name) {
  return raw_data[pkg_name];
}

export const PKG_META = pkg_meta;

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
  let result = cnpm_data.cnpm[pkg];

  return result;
}

export async function getPkgData(pkg_name) {
  const [pkg_data] = pkg_meta.filter((e) => e.name == pkg_name);

  let data = getLocalData(pkg_name);

  const major_chartdata = data.major_chartdata;

  const main_chartdata = data.main_chartdata;
  const obj = { pkg_data, major_chartdata, main_chartdata };
  return obj;
}




 function getTags() {
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
export const TAGS =  getTags();

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
