const lookupService = require('../services/lookup.service');
const { serialize } = require('../utils/serialize');

// =========================
// LOOKUP MASTER
// =========================

exports.getAllLookups = async (req, res) => {
  try {
    const data = await lookupService.getLookups();

    res.json({
      success: true,
      data : serialize(data),
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getLookupById = async (req, res) => {
  try {
    const data = await lookupService.getLookupById(
      req.params.id
    );

    res.json({
      success: true,
      data : serialize(data),
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.createLookup = async (req, res) => {
  try {
    const data = await lookupService.createLookup(
      req.body
    );

    res.status(201).json({
      success: true,
      data : serialize(data),
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateLookup = async (req, res) => {
  try {
    const data = await lookupService.updateLookup(
      req.params.id,
      req.body
    );

    res.json({
      success: true,
      data : serialize(data),
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteLookup = async (req, res) => {
  try {
    await lookupService.deleteLookup(req.params.id);

    res.json({
      success: true,
      message: 'Lookup deleted successfully',
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// LOOKUP DETAILS
// =========================

exports.getLookupDetails = async (req, res) => {
  try {
    const data =
      await lookupService.getLookupDetails(
        req.params.lookupId
      );

    res.json({
      success: true,
      data : serialize(data),
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.createLookupDetail = async (req, res) => {
  try {
    const data =
      await lookupService.createLookupDetail(
        req.params.lookupId,
        req.body
      );

    res.status(201).json({
      success: true,
      data : serialize(data),
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateLookupDetail = async (req, res) => {
  try {
    const data =
      await lookupService.updateLookupDetail(
        req.params.id,
        req.body
      );

    res.json({
      success: true,
      data : serialize(data),
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteLookupDetail = async (req, res) => {
  try {
    await lookupService.deleteLookupDetail(
      req.params.id
    );

    res.json({
      success: true,
      message: 'Lookup detail deleted successfully',
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};