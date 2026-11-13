
const companyService = require("../services/company.service");
const { serialize } = require("../utils/serialize");

// ============================================================
// COMPANY MASTER
// ============================================================

exports.getCompany = async (req, res, next) => {
  try {
    const data = await companyService.getCompany();

    return res.json({
      success: true,
      data: serialize(data),
    });
  } catch (error) {
    return next(error);
  }
};

exports.getCompanyById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isSafeInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid company ID",
      });
    }

    const data = await companyService.getCompanyById(id);

    return res.json({
      success: true,
      data: serialize(data),
    });
  } catch (error) {
    return next(error);
  }
};

exports.createCompany = async (req, res, next) => {
  try {
    const data = await companyService.createCompany(req.body);

    return res.status(201).json({
      success: true,
      data: serialize(data),
    });
  } catch (error) {
    return next(error);
  }
};

exports.updateCompany = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isSafeInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid company ID",
      });
    }

    const data = await companyService.updateCompany(
      id,
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

exports.deleteCompany = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isSafeInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid company ID",
      });
    }

    await companyService.deleteCompany(id);

    return res.json({
      success: true,
      message: "Company deleted successfully",
    });
  } catch (error) {
    return next(error);
  }
};

exports.getCompanyBySlug = async (req, res, next) => {
  try {
    const data = await companyService.getCompanyBySlug(
      req.params.slug
    );

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    return res.json({
      success: true,
      data: serialize(data),
    });
  } catch (error) {
    return next(error);
  }
};

// ============================================================
// SOCIAL MEDIA
// ============================================================

exports.getAllSocialMedia = async (req, res, next) => {
  try {
    const data = await companyService.getAllSocialMedia();

    return res.json({
      success: true,
      data: serialize(data),
    });
  } catch (error) {
    return next(error);
  }
};

exports.getSocialMedia = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isSafeInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid social media ID",
      });
    }

    const data = await companyService.getSocialMedia(id);

    return res.json({
      success: true,
      data: serialize(data),
    });
  } catch (error) {
    return next(error);
  }
};

exports.createSocialMedia = async (req, res, next) => {
  try {
    const data = await companyService.createSocialMedia(
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

exports.updateSocialMedia = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isSafeInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid social media ID",
      });
    }

    const data = await companyService.updateSocialMedia(
      id,
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

exports.deleteSocialMedia = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isSafeInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid social media ID",
      });
    }

    await companyService.deleteSocialMedia(id);

    return res.json({
      success: true,
      message: "Social media deleted successfully",
    });
  } catch (error) {
    return next(error);
  }
};
