import projects_data from "./projects_data.json";
import * as fs from "fs/promises";
import fetch from "node-fetch";
import cliProgress from "cli-progress";

const fetchProjectData = async (project, progressBar) => {
  try {
    const response = await fetch(`https://registry.npmjs.org/${project.name}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${project.name}`);
    }

    const result = await response.json();

    // 增加进度条
    progressBar.increment();

    return {
      name: project.name,
      tags: [...project.tags],
      description: result.description,
      time: {
        modified: result.time.modified,
        created: result.time.created,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      name: project.name,
      tags: [],
    };
  }
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchProjectsSequentially = async () => {
  const objarr = [];

  const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
  progressBar.start(projects_data.projects.length, 0);

  for (const project of projects_data.projects) {
    const projectData = await fetchProjectData(project, progressBar);
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
  const filePath = "./projects_data.json";

  try {
    await fs.writeFile(filePath, jsonString, "utf-8");
    console.log("JSON file has been saved successfully.");
  } catch (err) {
    console.error("Error writing JSON file:", err);
  }
})();
