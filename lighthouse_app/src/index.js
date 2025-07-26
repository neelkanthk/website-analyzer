import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

async function runLighthouse(url) {
  const chrome = await chromeLauncher.launch({ chromeFlags: ["--headless"] });
  console.log(`✅ Launching Chrome for Lighthouse...`);
  console.log(`✅ Chrome launched with PID: ${chrome.pid}`);

  const options = {
    logLevel: "info",
    output: "json",
    outputPath: "./dumps/json/" + `${uuidv4()}.json`,
    port: chrome.port,
    preset: "desktop",
    skipAudits: ["screenshot-thumbnails"],
    onlyCategories: ["performance", "seo"],
    disableFullPageScreenshot: true,
  };

  const runnerResult = await lighthouse(url, options);

  // Save JSON report
  const reportJson = runnerResult.report;
  const outputDir = path.dirname(options.outputPath);

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  fs.writeFileSync(options.outputPath, reportJson);

  console.log(`✅ Lighthouse report generated at ${options.outputPath}`);
  await chrome.kill();
}

// Get URL from command-line args or use default
const url = process.argv[2];
runLighthouse(url);
