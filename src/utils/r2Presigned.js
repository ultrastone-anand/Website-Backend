const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const path = require("path");
const crypto = require("crypto");
const mime = require("mime-types");

const r2 = require("../config/r2");

const createR2UploadUrl = async (fileName, folder = "uploads") => {
  const ext = path.extname(fileName);

  const safeName = fileName
    .replace(ext, "")
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "")
    .toLowerCase();

  const objectKey = `${folder}/${Date.now()}-${crypto.randomUUID()}-${safeName}${ext}`;

  const contentType = mime.lookup(fileName) || "application/octet-stream";

  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: objectKey,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(r2, command, {
    expiresIn: 60 * 10,
  });

  return {
    uploadUrl,
    public_id: objectKey,
    secure_url: `${process.env.R2_PUBLIC_URL}/${objectKey}`,
    contentType,
  };
};

module.exports = {
  createR2UploadUrl,
};