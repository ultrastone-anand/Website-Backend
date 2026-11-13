
const lookupService = require("../services/lookup.service");
const { serialize } = require("../utils/serialize");

// ============================================================
// LOOKUP MASTER
// ============================================================

// GET ALL LOOKUPS
exports.getAllLookups = async (req, res, next) => {
  try {
    const data = await lookupService.getLookups();

    return res.json({
      success: true,
      data: serialize(data),
    });
  } catch (error) {
    return next(error);
  }
};

// GET LOOKUP BY ID
exports.getLookupById = async (req, res, next) => {
  try {
    const data = await lookupService.getLookupById(
      req.params.id
    );

    return res.json({
      success: true,
      data: serialize(data),
    });
  } catch (error) {
    return next(error);
  }
};

// CREATE LOOKUP
exports.createLookup = async (req, res, next) => {
  try {
    const data = await lookupService.createLookup(
      req.body
    );

    return res.status(201).json({
      success: true,
      data: serialize(data),
    });
  } catch (error) {
    return next(error);
  }
};

// UPDATE LOOKUP
exports.updateLookup = async (req, res, next) => {
  try {
    const data = await lookupService.updateLookup(
      req.params.id,
      req.body
    );

    return res.json({
      success: true,
      data: serialize(data),
    });
  } catch (error) {
    return next(error);
  }
};

// DELETE LOOKUP
exports.deleteLookup = async (req, res, next) => {
  try {
    await lookupService.deleteLookup(req.params.id);

    return res.json({
      success: true,
      message: "Lookup deleted successfully",
    });
  } catch (error) {
    return next(error);
  }
};

// ============================================================
// LOOKUP DETAILS
// ============================================================

// GET LOOKUP DETAILS
exports.getLookupDetails = async (req, res, next) => {
  try {
    const data = await lookupService.getLookupDetails(
      req.params.lookupId
    );

    return res.json({
      success: true,
      data: serialize(data),
    });
  } catch (error) {
    return next(error);
  }
};

// CREATE LOOKUP DETAIL
exports.createLookupDetail = async (req, res, next) => {
  try {
    const data = await lookupService.createLookupDetail(
      req.params.lookupId,
      req.body
    );

    return res.status(201).json({
      success: true,
      data: serialize(data),
    });
  } catch (error) {
    return next(error);
  }
};

// UPDATE LOOKUP DETAIL
exports.updateLookupDetail = async (req, res, next) => {
  try {
    const data = await lookupService.updateLookupDetail(
      req.params.id,
      req.body
    );

    return res.json({
      success: true,
      data: serialize(data),
    });
  } catch (error) {
    return next(error);
  }
};

// DELETE LOOKUP DETAIL
exports.deleteLookupDetail = async (req, res, next) => {
  try {
    await lookupService.deleteLookupDetail(
      req.params.id
    );

    return res.json({
      success: true,
      message: "Lookup detail deleted successfully",
    });
  } catch (error) {
    return next(error);
  }
};
