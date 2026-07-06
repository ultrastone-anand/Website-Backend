const companyService = require('../services/company.service');
const { serialize } = require('../utils/serialize');

// =========================
// COMPANY MASTER
// =========================

exports.getCompany = async (req, res) => {
  try {
    const data = await companyService.getCompany();

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

exports.getCompanyById = async (req, res) => {
  try {
    const data = await companyService.getCompanyById(
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

exports.createCompany = async (req, res) => {
  try {
    const data = await companyService.createCompany(
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

exports.updateCompany = async (req, res) => {
  try {
    const data = await companyService.updateCompany(
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

exports.deleteCompany = async (req, res) => {
  try {
    await companyService.deleteCompany(req.params.id);

    res.json({
      success: true,
      message: 'Company deleted successfully',
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getCompanyBySlug = async (req, res) => {
  try {
    const data = await companyService.getCompanyBySlug(req.params.slug);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Company not found',
      });
    }

    res.json({
      success: true,
      data: serialize(data),
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
// SOCIAL MEDIA
// =========================

exports.getAllSocialMedia = async (req, res) => {
  try {
    const data = await companyService.getAllSocialMedia();

    res.json({
      success: true,
      data: serialize(data),
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getSocialMedia = async (req, res) => {
  try {
    const data = await companyService.getSocialMedia(
      req.params.id
    );

    res.json({
      success: true,
      data: serialize(data),
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.createSocialMedia = async (req, res) => {
  try {
const data = await companyService.createSocialMedia(
  req.body
);

    res.status(201).json({
      success: true,
      data: serialize(data),
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateSocialMedia = async (req, res) => {
  try {
    const data = await companyService.updateSocialMedia(
      req.params.id,
      req.body
    );

    res.json({
      success: true,
      data: serialize(data),
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteSocialMedia = async (req, res) => {
  try {
    await companyService.deleteSocialMedia(
      req.params.id
    );

    res.json({
      success: true,
      message: 'Social media deleted successfully',
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

