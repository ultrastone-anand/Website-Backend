
const service = require(
  "../services/lotImages.service"
);

// ----------------------------------------------------------------------
// BIGINT SERIALIZATION
// ----------------------------------------------------------------------

const serializeBigInt = (data) =>
  JSON.parse(
    JSON.stringify(data, (key, value) =>
      typeof value === "bigint"
        ? value.toString()
        : value
    )
  );

// ----------------------------------------------------------------------
// SAFE ERROR HANDLING
// ----------------------------------------------------------------------

// Only known, explicitly approved service messages
// can be returned to API clients.

const SAFE_LOT_ERRORS = new Set([
  "Product not found",
  "Valid product ID is required",
  "Lot not found",
  "Lot image not found",
]);

const sendLotError = (
  res,
  error,
  label,
  fallbackMessage,
  statusCode
) => {
  // Full error details remain on the server.
  console.error(label, error);

  const message =
    SAFE_LOT_ERRORS.has(error?.message)
      ? error.message
      : fallbackMessage;

  return res.status(statusCode).json({
    success: false,
    message,
  });
};

// ----------------------------------------------------------------------
// GET PRODUCT LOTS
// ----------------------------------------------------------------------

const getProductLots = async (
  req,
  res
) => {
  try {
    const data =
      await service.getProductLots(
        req.params.productId
      );

    return res.status(200).json({
      success: true,
      data: serializeBigInt(data),
    });
  } catch (error) {
    const statusCode =
      error.message ===
      "Product not found"
        ? 404
        : error.message ===
            "Valid product ID is required"
          ? 400
          : 500;

    return sendLotError(
      res,
      error,
      "Get product lots error:",
      "Failed to fetch product lots",
      statusCode
    );
  }
};

// ----------------------------------------------------------------------
// CREATE LOT IMAGE UPLOAD URLS
// ----------------------------------------------------------------------

const createLotImageUploadUrls = async (
  req,
  res
) => {
  try {
    const data =
      await service.createLotImageUploadUrls(
        req.body
      );

    return res.status(200).json({
      success: true,
      data: serializeBigInt(data),
    });
  } catch (error) {
    return sendLotError(
      res,
      error,
      "Create lot image upload URLs error:",
      "Failed to create upload URLs",
      400
    );
  }
};

// ----------------------------------------------------------------------
// SAVE LOT IMAGES
// ----------------------------------------------------------------------

const saveLotImages = async (
  req,
  res
) => {
  try {
    const data =
      await service.saveLotImages(
        req.body
      );

    return res.status(201).json({
      success: true,
      message:
        "Lot images saved successfully",
      data: serializeBigInt(data),
    });
  } catch (error) {
    const statusCode =
      error.message ===
        "Product not found" ||
      error.message === "Lot not found"
        ? 404
        : 400;

    return sendLotError(
      res,
      error,
      "Save lot images error:",
      "Failed to save lot images",
      statusCode
    );
  }
};

// ----------------------------------------------------------------------
// UPDATE LOT
// ----------------------------------------------------------------------

const updateLot = async (req, res) => {
  try {
    const data =
      await service.updateLot(
        req.params.lotId,
        req.body
      );

    return res.status(200).json({
      success: true,
      message:
        "Lot updated successfully",
      data: serializeBigInt(data),
    });
  } catch (error) {
    const statusCode =
      error.message === "Lot not found"
        ? 404
        : 400;

    return sendLotError(
      res,
      error,
      "Update lot error:",
      "Failed to update lot",
      statusCode
    );
  }
};

// ----------------------------------------------------------------------
// UPDATE LOT IMAGE
// ----------------------------------------------------------------------

const updateLotImage = async (
  req,
  res
) => {
  try {
    const data =
      await service.updateLotImage(
        req.params.imageId,
        req.body
      );

    return res.status(200).json({
      success: true,
      message:
        "Lot image updated successfully",
      data: serializeBigInt(data),
    });
  } catch (error) {
    const statusCode =
      error.message ===
      "Lot image not found"
        ? 404
        : 400;

    return sendLotError(
      res,
      error,
      "Update lot image error:",
      "Failed to update lot image",
      statusCode
    );
  }
};

// ----------------------------------------------------------------------
// DELETE LOT IMAGE
// ----------------------------------------------------------------------

const deleteLotImage = async (
  req,
  res
) => {
  try {
    await service.deleteLotImage(
      req.params.imageId
    );

    return res.status(200).json({
      success: true,
      message:
        "Lot image deleted successfully",
    });
  } catch (error) {
    const statusCode =
      error.message ===
      "Lot image not found"
        ? 404
        : 400;

    return sendLotError(
      res,
      error,
      "Delete lot image error:",
      "Failed to delete lot image",
      statusCode
    );
  }
};

// ----------------------------------------------------------------------
// DELETE LOT
// ----------------------------------------------------------------------

const deleteLot = async (req, res) => {
  try {
    await service.deleteLot(
      req.params.lotId
    );

    return res.status(200).json({
      success: true,
      message:
        "Lot and all images deleted successfully",
    });
  } catch (error) {
    const statusCode =
      error.message === "Lot not found"
        ? 404
        : 400;

    return sendLotError(
      res,
      error,
      "Delete lot error:",
      "Failed to delete lot",
      statusCode
    );
  }
};

// ----------------------------------------------------------------------
// EXPORTS
// ----------------------------------------------------------------------

module.exports = {
  getProductLots,
  createLotImageUploadUrls,
  saveLotImages,
  updateLot,
  updateLotImage,
  deleteLotImage,
  deleteLot,
};
