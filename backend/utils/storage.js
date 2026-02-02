import fs from "fs";
import path from "path";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const bucket = process.env.AWS_S3_BUCKET;
const region = process.env.AWS_REGION;

let s3Client = null;
if (
  process.env.AWS_ACCESS_KEY_ID &&
  process.env.AWS_SECRET_ACCESS_KEY &&
  bucket &&
  region
) {
  s3Client = new S3Client({ region });
}

export async function uploadToS3(localPath, key, contentType) {
  if (!s3Client) throw new Error("S3 not configured");

  const body = fs.createReadStream(localPath);
  const params = {
    Bucket: bucket,
    Key: key,
    Body: body,
    ContentType: contentType || "application/octet-stream",
    ACL: "public-read",
  };

  const cmd = new PutObjectCommand(params);
  await s3Client.send(cmd);

  // Construct public URL (works for standard S3)
  return `https://${bucket}.s3.${region}.amazonaws.com/${encodeURIComponent(key)}`;
}

export function removeLocalFile(localPath) {
  try {
    if (fs.existsSync(localPath)) fs.unlinkSync(localPath);
  } catch (e) {
    console.warn("Failed to remove local file:", e.message || e);
  }
}

export default { uploadToS3, removeLocalFile };
