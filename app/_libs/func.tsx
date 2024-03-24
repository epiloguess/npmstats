import raw_data from "@/_data/raw_data.json";
import pkg_meta from "@/_data/pkg_meta.json";
import cnpm_data from "@/_data/cnpm_data.json";

export const delay = (ms: string) => new Promise((resolve) => setTimeout(resolve, ms));

// export const fetcher = (...args: string[]) =>
//   fetch(...args).then((res) => res.json());
export const fetcher: (...args: [RequestInfo, RequestInit?]) => Promise<Response> = (...args) => fetch(...args).then((res) => res.json());

export const multiFetcher = function multiFetcher(...urls) {
  return Promise.all(urls[0].map((url) => fetcher(url)));
};

export const range = "2023-02-01:2024-02-01";

export const cnpm_url = "https://registry.npmmirror.com/downloads/range";

// 定义函数，将日期格式化为指定格式
const formatDate = (date) => {
  // 获取年份
  const year = date.getFullYear();
  // 获取月份，并补0
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  // 获取日期，并补0
  const day = date.getDate().toString().padStart(2, "0");
  // 返回格式化后的日期字符串
  return `${year}-${month}-${day}`;
};

const get30DaysAgoDate = () => {
  const today = new Date();
  const oneDaysAgo = new Date(today);
  oneDaysAgo.setDate(today.getDate() - 1);

  const thirtyDaysAgo = new Date(today);
  if (today.getDate() > 15) {
    thirtyDaysAgo.setDate(1);
  }else{
    thirtyDaysAgo.setDate(today.getDate() - 30);
  }

  return `${formatDate(thirtyDaysAgo)}:${formatDate(oneDaysAgo)}`;
};

const get7DaysAgoDate = () => {
  const today = new Date();
  const oneDaysAgo = new Date(today);
  const sevenDaysAgo = new Date(today);
  oneDaysAgo.setDate(today.getDate() - 1);
  sevenDaysAgo.setDate(today.getDate() - 7);

  return `${formatDate(sevenDaysAgo)}:${formatDate(oneDaysAgo)}`;
};

export const lastWeekRange = get7DaysAgoDate();

export const lastMonthRange = get30DaysAgoDate();

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

const text = "Close the labels with larger proportions to zoom in on the densely populated area of the chart.";
export const monthList = getMonthList(range);

export function getChartOpt(title: string) {
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
        mode: "nearest",
        intersect: false, // 如果为 true，则仅当鼠标位置与元素相交时才应用工具提示模式。如果为 false，则将始终应用该模式。
        displayColors: true,
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

interface data {}

export function getDatasets(data) {
  const pkg_name = Object.keys(data);
  const datasets = pkg_name.map((pkg_name) => {
    const pkg_data = data[pkg_name];
    const values = pkg_data.map((item) => Object.values(item)[0]);
    const totalDownloads = values.reduce((acc, current) => {
      return (acc += current);
    }, 0);
    let Color = getRandomRGB();

    if (totalDownloads > 1000) {
      const obj = {
        label: pkg_name,
        data: values,
        fill: false,
        borderWidth: 3, // 设置线的宽度
        borderColor: Color,
        backgroundColor: Color,
        cubicInterpolationMode: "monotone", // 启用平滑曲线
        tension: 0.1, // 线的贝塞尔曲线张力。设置为 0 以绘制直线。如果使用单调三次插值，则忽略此选项。

        // pointRadius: 4, // 设置点的大小
        // pointHoverRadius: 4,
        // pointBorderWidth: 1,
        pointBackgroundColor: "transparent",
        pointBorderColor: "transparent",
        pointHoverBackgroundColor: getRandomRGB(), // 悬停时点背景颜色。
        // pointHoverBorderColor: "#ffffff",
      };
      return obj;
    }
  });
  const filter_datasets = datasets.filter((e) => e !== undefined);
  return filter_datasets;
}

export function getPkgTag(pkg_name: string) {
  return raw_data[pkg_name];
}

export function getPkgMeta(pkg_name: string) {
  return pkg_meta.find((e) => e.name == pkg_name);
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

  if (res == undefined || !res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error(` Failed to fetch  data`);
  }

  return res.json();
}

function getLocalData(pkg: string) {
  let result = cnpm_data.cnpm[pkg];

  return result;
}

export function getPkgData(pkg_name: string) {
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
    .map(([tag, projects]) => {
      projects = getTagRank(projects);
      return { tag, projects };
    });
  return sortedCategorizedData;
}

export const TAGS = getTags();

function getTagRank(pkg_list: string[]) {
  function count(pkgData) {
    const [pkg_name] = Object.keys(pkgData.main_chartdata);
    const downloads = pkgData.main_chartdata[pkg_name].reduce((acc, cur) => {
      return (acc += Object.values(cur)[0]);
    }, 0);
    return { pkg_name, downloads };
  }
  let rank;
  try {
    rank = pkg_list.map((pkg, index) => {
      const pkg_data = getPkgData(pkg);
      return count(pkg_data);
    });
  } catch (err) {
    console.error("api/tags/[slug],rank", err);
  }
  rank.sort((a, b) => {
    return b.downloads - a.downloads;
    // b.data.at(-1)-a.data.at(-1)
  });
  const arr = rank.map((e) => e.pkg_name);

  return arr;
}

export async function getTag(tag_name: string) {
  // const decode_tag_name = decodeURIComponent(tag_name);

  const tag_data = TAGS.find((tag) => tag.tag === tag_name);
  const pkg_list = tag_data.projects;

  // const rank = getTagRank(pkg_list);
  // tag_data.rank = rank;
  let datasets;
  try {
    datasets = pkg_list.map((pkg, index) => {
      const pkg_data = getPkgData(pkg);
      return getDatasets(pkg_data.main_chartdata);
    });
  } catch (err) {
    console.error("api/tags/[slug],datasets", err);
  }
  const datasets_equal = datasets.flat();
  datasets_equal.sort((a, b) => {
    return b.data.reduce((acc, cur) => (acc += cur)) - a.data.reduce((acc, cur) => (acc += cur));
    // b.data.at(-1)-a.data.at(-1)
  });
  const chartData = {
    labels: monthList,
    datasets: datasets_equal.slice(0, 20),
  };

  tag_data.chartData = chartData;

  return tag_data;
}
