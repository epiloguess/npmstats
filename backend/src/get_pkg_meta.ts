

import raw_data from "./data/raw_data.json" with { type: "json" };

import * as fs from "fs/promises";
import fetch from "node-fetch";
import cliProgress from "cli-progress";

const fetchProjectData = async (project, progressBar) => {
  try {
    const response = await fetch(`https://registry.npmjs.org/${project}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${project}`);
    }

    const res = await response.json();
    const result = (({ name,description,"dist-tags": distTags,time:{"created":createdTime} }) => ({ name,description,distTags,createdTime }))(res);

    // 增加进度条
    progressBar.increment();

    return result;
  } catch (error) {
    console.error(error);
  }
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchProjectsSequentially = async () => {
  const objarr = [];

  const progressBar = new cliProgress.SingleBar(
    {},
    cliProgress.Presets.shades_classic
  );

  const data_keys = Object.keys(raw_data);

  progressBar.start(data_keys.length, 0);

  for (const key of data_keys) {
    const projectData = await fetchProjectData(key, progressBar);
    objarr.push(projectData);

    // 引入延迟，确保每秒只发送一个请求
    await delay(500);
  }

  progressBar.stop();

  return objarr;
};

(async () => {
  const result = await fetchProjectsSequentially();

  const jsonString = JSON.stringify(result);
  const filePath = "./pkg_meta.json";

  try {
    await fs.writeFile(filePath, jsonString, "utf-8");
    console.log("JSON file has been saved successfully.");
  } catch (err) {
    console.error("Error writing JSON file:", err);
  }
})();