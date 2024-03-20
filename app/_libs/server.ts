export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const range = "2023-02-01:2024-02-01";
export const cnpm_url = "https://registry.npmmirror.com/downloads/range";

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
    if (!version || key.startsWith(`${version}.`)) {
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

    return { [item]: totalDownloads };
  });
  return TotalDownloads;
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
  return {
    [`${pkgName}`]: data,
  };
}

export function getMajorDatasets(monthList, remoteData, pkgName) {
  const majorList = getMajorList(remoteData);
  const datasets = majorList
    .sort((a, b) => a - b)
    .reduce((result, x) => {
      result[`${pkgName} ${x}`] = getDownloadsByMonth(
        monthList,
        remoteData,
        `${x}`
      );
      return result;
    }, {});
  return datasets;
}
