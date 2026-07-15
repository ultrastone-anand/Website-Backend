const {
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");

const { Upload } = require("@aws-sdk/lib-storage");

const fs = require("fs");
const fsp = require("fs/promises");
const path = require("path");
const mime = require("mime-types");
const crypto = require("crypto");

const r2 = require("../config/r2");

// =====================================
// UPLOAD TO CLOUDFLARE R2
// =====================================

const uploadToR2 = async (file, folder = "uploads") => {
  const filePath = file.path || file;
  const fileName = path.basename(filePath);

  const ext = path.extname(fileName);
  const safeName = fileName
    .replace(ext, "")
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "")
    .toLowerCase();

  const objectKey = `${folder}/${Date.now()}-${crypto.randomUUID()}-${safeName}${ext}`;

  try {
    const stats = await fsp.stat(filePath);
    const sizeMB = stats.size / 1024 / 1024;
    const contentType = mime.lookup(fileName) || "application/octet-stream";


    console.time(`R2_UPLOAD_${fileName}`);

    const upload = new Upload({
      client: r2,
      params: {
        Bucket: process.env.R2_BUCKET_NAME,
        Key: objectKey,
        Body: fs.createReadStream(filePath),
        ContentType: contentType,
      },
      queueSize: 4,
      partSize: 10 * 1024 * 1024,
      leavePartsOnError: false,
    });

    upload.on("httpUploadProgress", (progress) => {
      if (!progress.loaded || !progress.total) return;

      const percent = ((progress.loaded / progress.total) * 100).toFixed(2);
    });

    await upload.done();

    console.timeEnd(`R2_UPLOAD_${fileName}`);

    await fsp.unlink(filePath).catch(() => null);

    return {
      secure_url: `${process.env.R2_PUBLIC_URL}/${objectKey}`,
      public_id: objectKey,
    };
  } catch (error) {
    await fsp.unlink(filePath).catch(() => null);

    console.error("========== R2 ERROR ==========");
    console.error({
      message: error.message,
      fileName,
      filePath,
      folder,
      objectKey,
    });

    throw error;
  }
};

// =====================================
// DELETE FROM CLOUDFLARE R2
// =====================================

const deleteFileFromR2 = async (objectKey) => {
  try {
    if (!objectKey) return false;

    await r2.send(
      new DeleteObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: objectKey,
      })
    );

    return true;
  } catch (error) {
    console.error("========== R2 DELETE ERROR ==========");
    console.error({
      message: error.message,
      objectKey,
    });

    throw error;
  }
};

module.exports = {
  uploadToR2,
  deleteFileFromR2,
};