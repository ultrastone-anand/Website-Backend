const service = require(
  "../services/lotImages.service"
);

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
    console.error(
      "Get product lots error:",
      error
    );

    const statusCode =
      error.message ===
      "Product not found"
        ? 404
        : error.message ===
            "Valid product ID is required"
          ? 400
          : 500;

    return res.status(statusCode).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch product lots",
    });
  }
};

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
    console.error(
      "Create lot image upload URLs error:",
      error
    );

    return res.status(400).json({
      success: false,
      message:
        error.message ||
        "Failed to create upload URLs",
    });
  }
};

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
    console.error(
      "Save lot images error:",
      error
    );

    const statusCode =
      error.message ===
        "Product not found" ||
      error.message === "Lot not found"
        ? 404
        : 400;

    return res.status(statusCode).json({
      success: false,
      message:
        error.message ||
        "Failed to save lot images",
    });
  }
};

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
    console.error(
      "Update lot error:",
      error
    );

    const statusCode =
      error.message === "Lot not found"
        ? 404
        : 400;

    return res.status(statusCode).json({
      success: false,
      message:
        error.message ||
        "Failed to update lot",
    });
  }
};

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
    console.error(
      "Update lot image error:",
      error
    );

    const statusCode =
      error.message ===
      "Lot image not found"
        ? 404
        : 400;

    return res.status(statusCode).json({
      success: false,
      message:
        error.message ||
        "Failed to update lot image",
    });
  }
};

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
    console.error(
      "Delete lot image error:",
      error
    );

    const statusCode =
      error.message ===
      "Lot image not found"
        ? 404
        : 400;

    return res.status(statusCode).json({
      success: false,
      message:
        error.message ||
        "Failed to delete lot image",
    });
  }
};

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
    console.error(
      "Delete lot error:",
      error
    );

    const statusCode =
      error.message === "Lot not found"
        ? 404
        : 400;

    return res.status(statusCode).json({
      success: false,
      message:
        error.message ||
        "Failed to delete lot",
    });
  }
};

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