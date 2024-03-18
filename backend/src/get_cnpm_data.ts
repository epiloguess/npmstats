import raw_data from "./data/raw_data.json" with { type: "json" };

import * as fs from "fs/promises";
import fetch from "node-fetch";
import cliProgress from "cli-progress";
import {
  range,
  getMonthList,
  getMajorDatasets,
  getMainDatasets,
} from "./lib/func.js";

const monthList = getMonthList(range);

const fetchProjectData = async (project, progressBar) => {
  try {
    const response = await fetch(
      `https://registry.npmmirror.com/downloads/range/2023-02-01:2024-02-01/${project}`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch ${project}`);
    }

    const data = await response.json();

    const major_chartdata = getMajorDatasets(monthList, data, project);

    const main_chartdata = getMainDatasets(monthList, data, project);

    const result = { major_chartdata, main_chartdata };

    // 增加进度条
    progressBar.increment();

    return result;
  } catch (error) {
    console.error(error, project);
  }
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchProjectsSequentially = async () => {
  const raw_data_keys = Object.keys(raw_data);


  const progressBar = new cliProgress.SingleBar(
    {},
    cliProgress.Presets.shades_classic
  );
  progressBar.start(raw_data_keys.length, 0);

  const result = {}

  for (const project of raw_data_keys) {
    let projectData;
    try {
      projectData = await fetchProjectData(project, progressBar);
    } catch (error) {
      console.error(error);
    }
    result[project] = projectData
    await delay(1000);

  }







  progressBar.stop();

  return {cnpm:result,monthList};
};

(async () => {
  let result;
  try {
    result = await fetchProjectsSequentially();
  } catch (error) {
    console.error("fetchProjectsSequentially", error);
  }

  const jsonString = JSON.stringify(result);
  const filePath = "./cnpm_data.json";

  try {
    await fs.writeFile(filePath, jsonString, "utf-8");
    console.log("JSON file has been saved successfully.");
  } catch (err) {
    console.error("Error writing JSON file:", err);
  }
})();
