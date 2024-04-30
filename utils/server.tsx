import raw_data from "@/_data/raw_data.json";
import { Package } from "@type/npm";

export function dayDiff(date1: string, date2: string) {
  const dateOne = new Date(date1);
  const dateTwo = new Date(date2);

  // 计算两个日期之间的毫秒差值
  const timeDifference = dateOne.getTime() - dateTwo.getTime();

  // 将毫秒差值转换为天数
  return timeDifference / (1000 * 3600 * 24);
}

// 定义函数，将日期格式化为指定格式
export const formatDate = (date: Date) => {
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
  oneDaysAgo.setDate(today.getDate() - 2);

  const thirtyDaysAgo = new Date(today);
  if (today.getDate() > 15) {
    thirtyDaysAgo.setDate(1);
  } else {
    thirtyDaysAgo.setDate(today.getDate() - 31);
  }

  return `${formatDate(thirtyDaysAgo)}:${formatDate(oneDaysAgo)}`;
};
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

export function getChartOpt() {
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
        mode: "nearest" as const,
        intersect: false, // 如果为 true，则仅当鼠标位置与元素相交时才应用工具提示模式。如果为 false，则将始终应用该模式。
        displayColors: true,
        multiKeyBackground: "transparent",
      },
    },
    hover: {
      mode: "index" as const,
      intersect: false,
    },
  };
  return options;
}

interface RawData {
  [key: string]: string[];
}
const typedRawData: RawData = raw_data;

export function getPkgTag(pkg_name: string) {
  return typedRawData[pkg_name];
}

function getTags() {
  const data = Object.entries(raw_data);
  // 生成按照tags分类的JSON
  const categorizedData = data.reduce(
    (acc: { [key: string]: string[] }, [pkg_name, tags]) => {
      tags.forEach((tag) => {
        if (!acc[tag]) {
          acc[tag] = [];
        }
        acc[tag].push(pkg_name);
      });
      return acc;
    },
    {}
  );

  // 对categorizedData进行倒序排序并转换为数组
  const sortedCategorizedData = Object.entries(categorizedData)
    .sort((a, b) => b[1].length - a[1].length)
    .map(([tag, packages]) => {
      return { tag, packages };
    });
  return sortedCategorizedData;
}

export const TAGS = getTags();


export async function getRealMeta(pkg: string):Promise<Package> {

  try {
    let res = await fetch(`https://npmstats.com/api/package/${pkg}`)
    if(!res){
      throw new Error('fetch no data')
    }
    return res.json()
  } catch(e){
    throw e
  }
}
