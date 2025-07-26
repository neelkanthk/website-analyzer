import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";
import { v4 as uuidv4 } from "uuid";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

// import fs from "fs";
// import path from "path";

dotenv.config(); // Load environment variables from .env file

const s3 = new S3Client({ region: process.env.AWS_REGION });

async function runLighthouse(url) {
  const chrome = await chromeLauncher.launch({ chromeFlags: ["--headless"] });
  console.log(`✅ Launching Chrome for Lighthouse...`);
  console.log(`✅ Chrome launched with PID: ${chrome.pid}`);

  const options = {
    logLevel: "info",
    output: "json",
    //outputPath: "./audits/" + `${uuidv4()}.json`,
    port: chrome.port,
    preset: "desktop",
    skipAudits: ["screenshot-thumbnails"],
    onlyCategories: ["performance", "seo"],
    disableFullPageScreenshot: true,
  };

  const runnerResult = await lighthouse(url, options);
  const reportJson = runnerResult.report;

  // Save JSON report locally
  // const outputDir = path.dirname(options.outputPath);

  // if (!fs.existsSync(outputDir)) {
  //   fs.mkdirSync(outputDir, { recursive: true });
  // }
  // fs.writeFileSync(options.outputPath, reportJson);

  // console.log(`✅ Lighthouse report generated at ${options.outputPath}`);

  // Upload to S3
  await uploadToS3(reportJson, `audits/${uuidv4()}.json`);

  console.log(`☁️ Lighthouse report uploaded to S3.`);

  await chrome.kill();
}

async function uploadToS3(reportContent, key) {
  console.log(process.env.AWS_S3_BUCKET_NAME);
  const bucketName = process.env.AWS_S3_BUCKET_NAME; // Set this env variable
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: reportContent,
    ContentType: "application/json",
  });
  await s3.send(command);
}

// Get URL from command-line args or use default
const url = process.argv[2];
runLighthouse(url).catch(console.error);
