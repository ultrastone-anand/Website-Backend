const cloudinary =require("cloudinary").v2;
const fs = require("fs/promises");

// ==============================
// CLOUDINARY CONFIG
// ==============================

cloudinary.config({

  cloud_name:
    process.env.CLOUDINARY_CLOUD_NAME,

  api_key:
    process.env.CLOUDINARY_API_KEY,

  api_secret:
    process.env.CLOUDINARY_API_SECRET,

});

// ==============================
// UPLOAD FUNCTION
// ==============================

const uploadToCloudinary = async (

  file,

  folder = "uploads",

  resourceType = "image"

) => {

  try {

    // SUPPORT:
    // file object OR file path

    const filePath =
      file.path || file;

      console.log("Uploading File:");
console.log(file);
console.log("Resolved Path:", filePath);

const exists = require("fs").existsSync(filePath);
console.log("File Exists:", exists);

    const result =
      await cloudinary.uploader.upload(

        filePath,

        {

          folder,

          resource_type:
            resourceType,

        }

      );

    // Delete local file after upload

    if (
      typeof filePath === "string"
    ) {
      try {
  await fs.unlink(filePath);


} catch (err) {

  console.error(
    "Delete Error:",
    err
  );

  console.error(
    "File Path:",
    filePath
  );

}
    }


    return result;

   } catch (error) {

  console.log("========== CLOUDINARY ERROR ==========");
  console.dir(error, { depth: null });

  console.log("Message:", error.message);
  console.log("HTTP:", error.http_code);
  console.log("Stack:", error.stack);

  throw error;
}

};

module.exports = {
  uploadToCloudinary,
};