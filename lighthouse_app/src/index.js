import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";
import { v4 as uuidv4 } from "uuid";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import axios from "axios";

// import fs from "fs";
// import path from "path";

dotenv.config(); // Load environment variables from .env file

const s3 = new S3Client({ region: process.env.AWS_REGION });

async function runLighthouse(targetUrl) {
  const chrome = await chromeLauncher.launch({ chromeFlags: ["--headless"] });
  console.log(`✅ Launching Chrome for Lighthouse...`);
  console.log(`✅ Chrome launched with PID: ${chrome.pid}`);

  const auditId = uuidv4();
  const timestamp = new Date().toISOString();
  const objectKey = `audits/${auditId}.json`;

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

  const runnerResult = await lighthouse(targetUrl, options);
  const reportJson = runnerResult.report;

  // Save JSON report locally
  // const outputDir = path.dirname(options.outputPath);

  // if (!fs.existsSync(outputDir)) {
  //   fs.mkdirSync(outputDir, { recursive: true });
  // }
  // fs.writeFileSync(options.outputPath, reportJson);

  // console.log(`✅ Lighthouse report generated at ${options.outputPath}`);

  // Upload to S3
  await uploadToS3(reportJson, objectKey);

  console.log(`✅ Lighthouse report uploaded to S3.`);

  // Send metadata to webhook
  await sendMetadataToBackend({
    audit_id: auditId,
    url: targetUrl,
    bucket_name: process.env.AWS_S3_BUCKET_NAME,
    object_key: objectKey,
    timestamp: timestamp,
  });

  await chrome.kill();
}

async function uploadToS3(reportContent, objectKey) {
  console.log(process.env.AWS_S3_BUCKET_NAME);
  const bucketName = process.env.AWS_S3_BUCKET_NAME; // Set this env variable
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: objectKey,
    Body: reportContent,
    ContentType: "application/json",
  });
  await s3.send(command);
}

async function sendMetadataToBackend(metadata) {
  try {
    await axios.post(process.env.METADATA_WEBHOOK_URL, metadata);
    console.log(`✅ Metadata sent to backend webhook`);
    // Log the response of webhook for debugging
  } catch (error) {
    console.error("❌ Failed to send metadata:", error.message);
  }
}

// Get URL from command-line args or use default
const targetUrl = process.argv[2];
runLighthouse(targetUrl).catch(console.error);
