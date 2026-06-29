const {
  PutObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");

const fs = require("fs/promises");
const path = require("path");
const mime = require("mime-types");

const r2 = require("../config/r2");

// =====================================
// UPLOAD TO CLOUDFLARE R2
// =====================================

const uploadToR2 = async (

  file,

  folder = "uploads",

  resourceType = "image"

) => {

  try {

    const filePath =
      file.path || file;

    const fileBuffer =
      await fs.readFile(filePath);

    const fileName =
      path.basename(filePath);

    const objectKey =
      `${folder}/${Date.now()}-${fileName}`;

    await r2.send(

      new PutObjectCommand({

        Bucket:
          process.env.R2_BUCKET_NAME,

        Key:
          objectKey,

        Body:
          fileBuffer,

        ContentType:
          mime.lookup(fileName)
          || "application/octet-stream",

      })

    );

    await fs.unlink(filePath);

    return {

      secure_url:
        `${process.env.R2_PUBLIC_URL}/${objectKey}`,

      public_id:
        objectKey,

    };

  } catch (error) {

    console.error(
      "========== R2 ERROR =========="
    );

    console.error(error);

    throw error;

  }

};

// =====================================
// DELETE FROM CLOUDFLARE R2
// =====================================

const deleteFileFromR2 = async (objectKey) => {

  try {

    if (!objectKey) {
      throw new Error("Object key is required.");
    }

    await r2.send(
      new DeleteObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: objectKey,
      })
    );

    return true;

  } catch (error) {

    console.error(
      "========== R2 DELETE ERROR =========="
    );

    console.error(error);

    throw error;

  }

};

module.exports = {
  uploadToR2,
  deleteFileFromR2
};