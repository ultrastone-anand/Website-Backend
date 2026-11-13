
const careerService = require("../services/career.service");

const getAuditContext = require("../utils/getAuditContext");

// ======================================================
// SAFE ERROR STATUS MAPPING
// ======================================================

const SAFE_CAREER_ERRORS = new Map([
  ["Job not found", 404],
  ["Application not found", 404],

  ["Job is no longer available", 410],

  ["Job title is required", 400],
  ["Job slug is required", 400],
  ["Invalid employment type", 400],
  ["Invalid work mode", 400],
  ["Invalid job status", 400],
  ["Invalid application status", 400],
  ["Invalid application type", 400],
  ["Invalid experience level", 400],
  ["Resume is required", 400],
  ["First name is required", 400],
  ["Last name is required", 400],
  ["Email is required", 400],
  ["A valid email address is required", 400],
  ["Job is required", 400],
  ["Vacancies must be at least 1", 400],
  ["Invalid job ID", 400],
  ["Invalid application ID", 400],
]);

// ======================================================
// CENTRALIZED SAFE ERROR HANDLER
// ======================================================

const sendCareerError = (
  res,
  error,
  label,
  fallbackMessage,
  preserveValidation = true
) => {
  // Log complete error details on the server.
  console.error(label, error);

  const rawMessage = error?.message;

  const safeStatus =
    preserveValidation &&
    typeof rawMessage === "string"
      ? SAFE_CAREER_ERRORS.get(rawMessage)
      : undefined;

  const statusCode = safeStatus || 500;

  // Only known validation messages are returned.
  // Unexpected errors always use a generic message.
  const safeMessage = safeStatus
    ? rawMessage
    : fallbackMessage;

  return res.status(statusCode).json({
    success: false,
    message: safeMessage,
  });
};

// ======================================================
// PUBLIC JOBS
// ======================================================

const getPublishedJobs = async (req, res) => {
  try {
    const result =
      await careerService.getPublishedJobs({
        page: req.query.page,
        limit: req.query.limit,
        search: req.query.search,
        department: req.query.department,
        location: req.query.location,
        employmentType: req.query.employment_type,
        workMode: req.query.work_mode,
      });

    return res.status(200).json({
      success: true,
      data: result.jobs,
      pagination: result.pagination,
    });
  } catch (error) {
    return sendCareerError(
      res,
      error,
      "Get Published Jobs Error:",
      "Failed to fetch published jobs",
      false
    );
  }
};

// ======================================================
// PUBLIC JOB FILTERS
// ======================================================

const getPublicJobFilters = async (req, res) => {
  try {
    const filters =
      await careerService.getPublicJobFilters();

    return res.status(200).json({
      success: true,
      data: filters,
    });
  } catch (error) {
    return sendCareerError(
      res,
      error,
      "Get Career Filters Error:",
      "Failed to fetch career filters",
      false
    );
  }
};

// ======================================================
// PUBLIC JOB DETAILS
// ======================================================

const getPublishedJobBySlug = async (
  req,
  res
) => {
  try {
    const job =
      await careerService.getPublishedJobBySlug(
        req.params.slug
      );

    return res.status(200).json({
      success: true,
      data: job,
    });
  } catch (error) {
    return sendCareerError(
      res,
      error,
      "Get Published Job By Slug Error:",
      "Failed to fetch job details"
    );
  }
};

// ======================================================
// CMS GET JOBS
// ======================================================

const getJobs = async (req, res) => {
  try {
    const result =
      await careerService.getJobs({
        page: req.query.page,
        limit: req.query.limit,
        search: req.query.search,
        status: req.query.status,
        department: req.query.department,
        location: req.query.location,
        employmentType: req.query.employment_type,
        workMode: req.query.work_mode,
      });

    return res.status(200).json({
      success: true,
      data: result.jobs,
      pagination: result.pagination,
    });
  } catch (error) {
    return sendCareerError(
      res,
      error,
      "Get Career Jobs Error:",
      "Failed to fetch career jobs",
      false
    );
  }
};

// ======================================================
// CMS JOB STATS
// ======================================================

const getJobStats = async (req, res) => {
  try {
    const stats =
      await careerService.getJobStats();

    return res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    return sendCareerError(
      res,
      error,
      "Get Job Stats Error:",
      "Failed to fetch job statistics",
      false
    );
  }
};

// ======================================================
// CMS GET JOB BY ID
// ======================================================

const getJobById = async (req, res) => {
  try {
    const job =
      await careerService.getJobById(
        req.params.jobId
      );

    return res.status(200).json({
      success: true,
      data: job,
    });
  } catch (error) {
    return sendCareerError(
      res,
      error,
      "Get Job By ID Error:",
      "Failed to fetch job"
    );
  }
};

// ======================================================
// CREATE JOB
// ======================================================

const createJob = async (req, res) => {
  try {
    const job =
      await careerService.createJob(
        req.body,
        getAuditContext(req)
      );

    return res.status(201).json({
      success: true,
      message:
        "Career job created successfully",
      data: job,
    });
  } catch (error) {
    if (error?.code === "P2002") {
      console.error(
        "Create Career Job Error:",
        error
      );

      return res.status(400).json({
        success: false,
        message:
          "A career job with this slug already exists",
      });
    }

    return sendCareerError(
      res,
      error,
      "Create Career Job Error:",
      "Failed to create career job"
    );
  }
};

// ======================================================
// UPDATE JOB
// ======================================================

const updateJob = async (req, res) => {
  try {
    const job =
      await careerService.updateJob(
        req.params.jobId,
        req.body,
        getAuditContext(req)
      );

    return res.status(200).json({
      success: true,
      message:
        "Career job updated successfully",
      data: job,
    });
  } catch (error) {
    if (error?.code === "P2002") {
      console.error(
        "Update Career Job Error:",
        error
      );

      return res.status(400).json({
        success: false,
        message:
          "A career job with this slug already exists",
      });
    }

    return sendCareerError(
      res,
      error,
      "Update Career Job Error:",
      "Failed to update career job"
    );
  }
};

// ======================================================
// UPDATE JOB STATUS
// ======================================================

const updateJobStatus = async (
  req,
  res
) => {
  try {
    const job =
      await careerService.updateJobStatus(
        req.params.jobId,
        req.body.status,
        getAuditContext(req)
      );

    return res.status(200).json({
      success: true,
      message:
        "Career job status updated successfully",
      data: job,
    });
  } catch (error) {
    return sendCareerError(
      res,
      error,
      "Update Career Job Status Error:",
      "Failed to update career job status"
    );
  }
};

// ======================================================
// ARCHIVE JOB
// ======================================================

const archiveJob = async (req, res) => {
  try {
    const job =
      await careerService.archiveJob(
        req.params.jobId,
        getAuditContext(req)
      );

    return res.status(200).json({
      success: true,
      message:
        "Career job archived successfully",
      data: job,
    });
  } catch (error) {
    return sendCareerError(
      res,
      error,
      "Archive Career Job Error:",
      "Failed to archive career job"
    );
  }
};

// ======================================================
// SUBMIT APPLICATION
// ======================================================

const submitApplication = async (
  req,
  res
) => {
  try {
    const application =
      await careerService.submitApplication({
        body: req.body,
        files: req.files,

        requestContext: {
          ipAddress:
            req.ip ||
            req.socket?.remoteAddress ||
            null,

          userAgent:
            req.get("user-agent") ||
            null,
        },
      });

    return res.status(201).json({
      success: true,
      message:
        "Application submitted successfully",
      data: application,
    });
  } catch (error) {
    return sendCareerError(
      res,
      error,
      "Submit Application Error:",
      "Failed to submit application"
    );
  }
};

// ======================================================
// GET APPLICATIONS
// ======================================================

const getApplications = async (
  req,
  res
) => {
  try {
    const result =
      await careerService.getApplications({
        page: req.query.page,
        limit: req.query.limit,
        search: req.query.search,
        status: req.query.status,
        applicationType:
          req.query.application_type,
        jobId: req.query.job_id,
        department: req.query.department,
      });

    return res.status(200).json({
      success: true,
      data: result.applications,
      pagination: result.pagination,
    });
  } catch (error) {
    return sendCareerError(
      res,
      error,
      "Get Applications Error:",
      "Failed to fetch applications",
      false
    );
  }
};

// ======================================================
// APPLICATION STATS
// ======================================================

const getApplicationStats = async (
  req,
  res
) => {
  try {
    const stats =
      await careerService.getApplicationStats();

    return res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    return sendCareerError(
      res,
      error,
      "Get Application Stats Error:",
      "Failed to fetch application statistics",
      false
    );
  }
};

// ======================================================
// GET APPLICATION BY ID
// ======================================================

const getApplicationById = async (
  req,
  res
) => {
  try {
    const application =
      await careerService.getApplicationById(
        req.params.applicationId
      );

    return res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error) {
    return sendCareerError(
      res,
      error,
      "Get Application By ID Error:",
      "Failed to fetch application"
    );
  }
};

// ======================================================
// UPDATE APPLICATION
// ======================================================

const updateApplication = async (
  req,
  res
) => {
  try {
    const application =
      await careerService.updateApplication(
        req.params.applicationId,
        req.body,
        req.user?.id || null,
        getAuditContext(req)
      );

    return res.status(200).json({
      success: true,
      message:
        "Application updated successfully",
      data: application,
    });
  } catch (error) {
    return sendCareerError(
      res,
      error,
      "Update Application Error:",
      "Failed to update application"
    );
  }
};

// ======================================================
// UPDATE APPLICATION STATUS
// ======================================================

const updateApplicationStatus = async (
  req,
  res
) => {
  try {
    const application =
      await careerService.updateApplicationStatus(
        req.params.applicationId,
        req.body.status,
        req.user?.id || null,
        getAuditContext(req)
      );

    return res.status(200).json({
      success: true,
      message:
        "Application status updated successfully",
      data: application,
    });
  } catch (error) {
    return sendCareerError(
      res,
      error,
      "Update Application Status Error:",
      "Failed to update application status"
    );
  }
};

// ======================================================
// UPDATE APPLICATION NOTES
// ======================================================

const updateApplicationNotes = async (
  req,
  res
) => {
  try {
    const application =
      await careerService.updateApplicationNotes(
        req.params.applicationId,
        req.body.internal_notes,
        req.user?.id || null,
        getAuditContext(req)
      );

    return res.status(200).json({
      success: true,
      message:
        "Application notes updated successfully",
      data: application,
    });
  } catch (error) {
    return sendCareerError(
      res,
      error,
      "Update Application Notes Error:",
      "Failed to update application notes"
    );
  }
};

// ======================================================
// DELETE APPLICATION
// ======================================================

const deleteApplication = async (
  req,
  res
) => {
  try {
    await careerService.deleteApplication(
      req.params.applicationId,
      getAuditContext(req)
    );

    return res.status(200).json({
      success: true,
      message:
        "Application deleted successfully",
    });
  } catch (error) {
    return sendCareerError(
      res,
      error,
      "Delete Application Error:",
      "Failed to delete application"
    );
  }
};

// ======================================================
// EXPORTS
// ======================================================

module.exports = {
  getPublishedJobs,
  getPublicJobFilters,
  getPublishedJobBySlug,

  getJobs,
  getJobStats,
  getJobById,
  createJob,
  updateJob,
  updateJobStatus,
  archiveJob,

  submitApplication,
  getApplications,
  getApplicationStats,
  getApplicationById,
  updateApplication,
  updateApplicationStatus,
  updateApplicationNotes,
  deleteApplication,
};
