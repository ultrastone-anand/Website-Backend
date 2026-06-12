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