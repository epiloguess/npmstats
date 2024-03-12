export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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

export function getMonthList(dateRangeString: string) {
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

function getDownloadsByDay(remoteData, version) {
  const allDays = {};

  remoteData.downloads.forEach((x) => (allDays[x.day] = 0));

  for (const key in remoteData.versions) {
    if (!version || key.startsWith(`${version}`)) {
      remoteData.versions[key].forEach((item) => {
        allDays[item.day] += item.downloads;
      });
    }
  }
  return allDays;
}

export function getDownloadsByMonth(
  monthList,
  remoteData,
  version = undefined
) {
  const allDays = getDownloadsByDay(remoteData, version);
  const TotalDownloads = monthList.map((item) => {
    const totalDownloads = Object.entries(allDays)
      .filter((x) => x[0].startsWith(item))
      .reduce((pre, current) => pre + current[1], 0);

    return totalDownloads;
  });
  return TotalDownloads;
}

export function getChartOpt(title) {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: `${title}`,
      },
    },
  };
  return options;
}

export function getMinorList(remoteData) {
  const newSet = new Set();
  for (const key in remoteData.versions) {
    // const MinorLength = key.split(".")[1].length;
    newSet.add(
      key.split(".").slice(0, 2).join(".")
      // parseFloat(key.split(".").slice(0, 2).join(".")).toFixed(MinorLength)
    );
  }
  return [...newSet];
}

export function getMajorList(remoteData) {
  const newSet = new Set();
  for (const key in remoteData.versions) {
    newSet.add(parseInt(key.split(".")[0]));
  }
  return [...newSet];
}

export function getMainDatasets(monthList, remoteData, pkgName) {
  const data = getDownloadsByMonth(monthList, remoteData);
  // const pkg_detail = getPackageDetail(pkgName);
  // const years = pkg_detail.time.years;
  // const data_equal = data.map((e,index) => {
  //   return Math.floor(parseInt(e) / years[index]);
  // });
  return {
    label: `${pkgName}`,
    data: data,
    fill: false,
    borderColor: getRandomRGB(),
    tension: 0.1,
    borderWidth: 3, // 设置线的宽度
    pointRadius: 6, // 设置点的大小
    cubicInterpolationMode: "monotone", // 启用平滑曲线
  };
}

export function getDatasets(monthList, remoteData, pkgName) {
  const majorList = getMajorList(remoteData);
  const datasets = majorList
    .sort((a, b) => a - b)
    .map((major) => {
      const data = getDownloadsByMonth(monthList, remoteData, `${major}`);
      const dataReduced = data.reduce((pre, current) => pre + current, 0);
      if (dataReduced > 130000) {
        return {
          label: `${pkgName} ${major}`,
          data: data,
          fill: false,
          borderColor: getRandomRGB(),
          tension: 0.1,
          borderWidth: 3, // 设置线的宽度
          pointRadius: 6, // 设置点的大小
          cubicInterpolationMode: "monotone", // 启用平滑曲线
        };
      }
    });
  const activeDatasets = datasets.filter((e) => e != undefined);

  return activeDatasets;
}

// export function getMajorDatasets(monthList, remoteData, pkgName: string) {

//   const majorList = getMajorList(remoteData);
//   const majorListWithDownloads = majorList.map((x) => {
//     const TotalDownloadsByMonth = getDownloadsByMonth(
//       monthList,
//       remoteData,
//       `${x}.`
//     ).reduce((pre, current) => pre + current, 0);
//     return [x, TotalDownloadsByMonth];
//   });
//   const majorListSorted = majorListWithDownloads
//     .sort((a, b) => b[1] - a[1])
//     .slice(0, 10);

//   const newarr = majorListSorted.map((x) => {
//     return {
//       label: `${pkgName} ${x[0]}`,
//       data: getDownloadsByMonth(monthList, remoteData, `${x[0]}.`),
//       fill: false,
//       borderColor: getRandomRGB(),
//       tension: 0.1,
//       borderWidth: 3, // 设置线的宽度
//       pointRadius: 6, // 设置点的大小
//       cubicInterpolationMode: "monotone", // 启用平滑曲线
//     };
//   });

//   const activeDatasets = newarr.filter((e) => e != undefined);
//   return activeDatasets;
// }

export function getMajorDatasets(monthList, remoteData, pkgName: string) {
  const majorList = getMajorList(remoteData);
  const datasets = majorList
    .sort((a, b) => a - b)
    .map((x) => {
      const TotalDownloadsByMonth = getDownloadsByMonth(
        monthList,
        remoteData,
        `${x}.`
      ).reduce((pre, current) => pre + current, 0);
      if (TotalDownloadsByMonth > 1000) {
        return {
          label: `${pkgName} ${x}`,
          data: getDownloadsByMonth(monthList, remoteData, `${x}`),
          fill: false,
          borderColor: getRandomRGB(),
          tension: 0.1,
          borderWidth: 4, // 设置线的宽度
          pointRadius: 3, // 设置点的大小
          cubicInterpolationMode: "monotone", // 启用平滑曲线
        };
      } else {
        return undefined;
      }
    });
  const activeDatasets = datasets.filter((e) => e != undefined);
  return activeDatasets;
}

// export function getMinorDatasets(monthList, remoteData, pkgName: string) {
//   const minorList = getMinorList(remoteData);
//   const datasets = minorList
//     .sort((a, b) => a - b)
//     .map((x) => {
//       const TotalDownloadsByMonth = getDownloadsByMonth(
//         monthList,
//         remoteData,
//         `${x}.`
//       ).reduce((pre, current) => pre + current, 0);
//       if (TotalDownloadsByMonth > 100000) {
//         return {
//           label: `${pkgName} ${x}`,
//           data: getDownloadsByMonth(monthList, remoteData, `${x}`),
//           fill: false,
//           borderColor: getRandomRGB(),
//           tension: 0.1,
//           borderWidth: 3, // 设置线的宽度
//           pointRadius: 6, // 设置点的大小
//           cubicInterpolationMode: "monotone", // 启用平滑曲线
//         };
//       } else {
//         return undefined;
//       }
//     });
//   const activeDatasets = datasets.filter((e) => e != undefined);
//   return activeDatasets;
// }

export function getAnotherMinorDatasets(
  monthList,
  remoteData,
  pkgName: string
) {
  const minorList = getMinorList(remoteData);
  const datasets = minorList.map((x) => {
    const TotalDownloadsByMonth = getDownloadsByMonth(
      monthList,
      remoteData,
      `${x}.`
    ).reduce((pre, current) => pre + current, 0);
    return [x, TotalDownloadsByMonth];
  });
  const arr = datasets.sort((a, b) => b[1] - a[1]);

  const allDownloads = remoteData.downloads.reduce(
    (pre, current) => pre + current.downloads,
    0
  );

  let part = Math.floor(allDownloads * 0.2);

  let ewq = 0;

  while (ewq < part) {
    let wqdq = arr.pop();
    ewq += wqdq[1];
  }
  const dwq = arr.reduce((pre, current) => pre + current[1], 0);
  const newarr = arr.map((x) => {
    return {
      label: `${pkgName} ${x[0]}`,
      data: getDownloadsByMonth(monthList, remoteData, `${x[0]}.`),
      fill: false,
      borderColor: getRandomRGB(),
      tension: 0.1,
      borderWidth: 3, // 设置线的宽度
      pointRadius: 3, // 设置点的大小
      cubicInterpolationMode: "monotone", // 启用平滑曲线
    };
  });

  const activeDatasets = newarr.filter((e) => e != undefined);
  return activeDatasets;
}

export function getMinorDatasets(monthList, remoteData, pkgName: string) {
  const minorList = getMinorList(remoteData);
  const minorListWithDownloads = minorList.map((x) => {
    const TotalDownloadsByMonth = getDownloadsByMonth(
      monthList,
      remoteData,
      `${x}.`
    ).reduce((pre, current) => pre + current, 0);
    return [x, TotalDownloadsByMonth];
  });
  const minorListSorted = minorListWithDownloads
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const newarr = minorListSorted.map((x) => {
    return {
      label: `${pkgName} ${x[0]}`,
      data: getDownloadsByMonth(monthList, remoteData, `${x[0]}.`),
      fill: false,
      borderColor: getRandomRGB(),
      tension: 0.1,
      borderWidth: 4, // 设置线的宽度
      pointRadius: 4, // 设置点的大小
      cubicInterpolationMode: "monotone", // 启用平滑曲线
    };
  });

  const activeDatasets = newarr.filter((e) => e != undefined);
  return activeDatasets;
}

export function getUrlList(pkgList) {
  const urlList = pkgList.map((pkg) => `${cnpm_url}${range}/${pkg}`);
  return urlList;
}

import projects_data from "../_data/projects_data.json";

export function calculateYearsAgo(dateString,monthList) {
const result = monthList.map((month)=>{
    // 将日期字符串解析为Date对象
    const date = new Date(dateString);

    // 获取当前日期
    const currentDate = new Date(month);
    // 计算年份差距
    const yearDifference = currentDate.getFullYear() - date.getFullYear();
  
    // 计算月份差距
    const monthDifference = currentDate.getMonth() - date.getMonth();
    // 计算总的月份差距
    const totalMonths = yearDifference * 12 + monthDifference;
  
    // 将总的月份差距转换为年和月的形式
    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;
  
    // 返回结果，以小数形式表示年和月的差距
    return years + months / 12;
})
return result
}

// 例如，计算12年前的六月的差距

export function getPackageDetail(pkg: string) {
  const [project] = projects_data.filter((e) => e.name == pkg);
  return project;
}
