const cloudinary =
  require("cloudinary").v2;

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

    const result =
      await cloudinary.uploader.upload(

        filePath,

        {

          folder,

          resource_type:
            resourceType,

        }

      );

    return result;

  } catch (error) {

    console.log(
      "Cloudinary Upload Error:",
      error
    );

    throw error;

  }

};

module.exports = {
  uploadToCloudinary,
};