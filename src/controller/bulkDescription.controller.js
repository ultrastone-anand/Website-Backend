const bulkDescriptionService = require(
  "../services/bulkDescription.service"
);

const parsePositiveInteger = (value) => {
  const parsedValue = Number.parseInt(value, 10);

  if (
    !Number.isInteger(parsedValue) ||
    parsedValue <= 0
  ) {
    return null;
  }

  return parsedValue;
};

const downloadTemplate = async (
  req,
  res,
  next
) => {
  console.log(
    "[Bulk Description Controller] Route called:",
    {
      categoryId: req.params.categoryId,
      query: req.query,
      time: new Date().toISOString(),
    }
  );

  try {
    const categoryId = Number.parseInt(
      req.params.categoryId,
      10
    );

    if (
      !Number.isInteger(categoryId) ||
      categoryId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "A valid category ID is required.",
      });
    }

    const result =
      await bulkDescriptionService.generateTemplate(
        categoryId
      );

    console.log(
      "[Bulk Description Controller] Sending file:",
      {
        fileName: result.fileName,
        totalProducts:
          result.totalProducts,
        bufferLength:
          result.buffer.length,
        isBuffer:
          Buffer.isBuffer(result.buffer),
      }
    );

    res.status(200);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${result.fileName}"`
    );

    res.setHeader(
      "Content-Length",
      String(result.buffer.length)
    );

    res.setHeader(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    );

    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    res.removeHeader("ETag");
    res.removeHeader("Last-Modified");

    return res.end(result.buffer);
  } catch (error) {
    console.error(
      "[Bulk Description Controller] Error:",
      error
    );

    return next(error);
  }
};

const validateExcel = async (req, res, next) => {
  try {
    const categoryId = parsePositiveInteger(
      req.body.category_id
    );

    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: "A valid category_id is required.",
      });
    }

    if (!req.file?.buffer) {
      return res.status(400).json({
        success: false,
        message: "Please upload an .xlsx file.",
      });
    }

    const result =
      await bulkDescriptionService.validateExcel({
        categoryId,
        fileBuffer: req.file.buffer,
        originalFileName: req.file.originalname,
      });

    return res.status(200).json({
      success: true,
      message: "Excel validation completed.",
      data: result,
    });
  } catch (error) {
    return next(error);
  }
};

const bulkUpdateDescriptions = async (
  req,
  res,
  next
) => {
  try {
    const categoryId = parsePositiveInteger(
      req.body.category_id
    );

    const rows = req.body.rows;

    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: "A valid category_id is required.",
      });
    }

    if (!Array.isArray(rows) || rows.length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "At least one product row is required.",
      });
    }

    const result =
      await bulkDescriptionService.bulkUpdateDescriptions(
        {
          categoryId,
          rows,

          // Replace this with your logged-in admin ID.
          updatedBy: req.user?.id || null,
        }
      );

    return res.status(200).json({
      success: true,
      message:
        "Bulk description update completed.",
      data: result,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  downloadTemplate,
  validateExcel,
  bulkUpdateDescriptions,
};