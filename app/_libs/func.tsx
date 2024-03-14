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



