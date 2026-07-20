const express = require("express");
const multer = require("multer");

const bulkDescriptionController = require(
  "../controller/bulkDescription.controller"
);

const router = express.Router();

console.log(
  "[Bulk Description Routes] File loaded"
);

router.use((req, res, next) => {
  console.log(
    "[Bulk Description Routes] Incoming request:",
    req.method,
    req.originalUrl
  );

  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.setHeader("Surrogate-Control", "no-store");

  next();
});

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1,
  },

  fileFilter: (req, file, callback) => {
    const allowedMimeTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/octet-stream",
    ];

    const hasValidExtension = file.originalname
      ?.toLowerCase()
      .endsWith(".xlsx");

    if (
      !hasValidExtension ||
      !allowedMimeTypes.includes(file.mimetype)
    ) {
      return callback(
        new Error("Only .xlsx Excel files are allowed.")
      );
    }

    return callback(null, true);
  },
});

router.get(
  "/test",
  (req, res) => {
    console.log(
      "[Bulk Description Routes] Test route reached"
    );

    return res.status(200).json({
      success: true,
      message: "New bulk description route is active.",
      time: new Date().toISOString(),
    });
  }
);

router.get(
  "/template/:categoryId",
  bulkDescriptionController.downloadTemplate
);

router.post(
  "/validate",
  upload.single("file"),
  bulkDescriptionController.validateExcel
);

router.patch(
  "/update",
  bulkDescriptionController.bulkUpdateDescriptions
);

module.exports = router;