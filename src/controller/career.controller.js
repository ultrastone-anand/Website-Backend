// controller/career.controller.js

const careerService =
  require('../services/career.service');

const getAuditContext =
  require('../utils/getAuditContext');

// ======================================================
// ERROR STATUS HELPER
// ======================================================

const getErrorStatusCode = (
  error
) => {
  switch (error.message) {
    case 'Job not found':
    case 'Application not found':
      return 404;

    case 'Job is no longer available':
      return 410;

    case 'Job title is required':
    case 'Job slug is required':
    case 'Invalid employment type':
    case 'Invalid work mode':
    case 'Invalid job status':
    case 'Invalid application status':
    case 'Invalid application type':
    case 'Invalid experience level':
    case 'Resume is required':
    case 'First name is required':
    case 'Last name is required':
    case 'Email is required':
    case 'A valid email address is required':
    case 'Job is required':
    case 'Vacancies must be at least 1':
    case 'Invalid job ID':
    case 'Invalid application ID':
      return 400;

    default:
      return 500;
  }
};

// ======================================================
// PUBLIC JOBS
// ======================================================

const getPublishedJobs = async (
  req,
  res
) => {
  try {
    const result =
      await careerService.getPublishedJobs({
        page:
          req.query.page,

        limit:
          req.query.limit,

        search:
          req.query.search,

        department:
          req.query.department,

        location:
          req.query.location,

        employmentType:
          req.query.employment_type,

        workMode:
          req.query.work_mode,
      });

    return res.status(200).json({
      success: true,
      data:
        result.jobs,
      pagination:
        result.pagination,
    });
  } catch (error) {
    console.error(
      'Get Published Jobs Error:',
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message,
    });
  }
};

// ======================================================
// PUBLIC JOB FILTERS
// ======================================================

const getPublicJobFilters =
  async (
    req,
    res
  ) => {
    try {
      const filters =
        await careerService.getPublicJobFilters();

      return res.status(200).json({
        success: true,
        data:
          filters,
      });
    } catch (error) {
      console.error(
        'Get Career Filters Error:',
        error
      );

      return res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

// ======================================================
// PUBLIC JOB DETAILS
// ======================================================

const getPublishedJobBySlug =
  async (
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
        data:
          job,
      });
    } catch (error) {
      const statusCode =
        getErrorStatusCode(
          error
        );

      return res.status(statusCode).json({
        success: false,
        message:
          error.message,
      });
    }
  };

// ======================================================
// CMS GET JOBS
// ======================================================

const getJobs = async (
  req,
  res
) => {
  try {
    const result =
      await careerService.getJobs({
        page:
          req.query.page,

        limit:
          req.query.limit,

        search:
          req.query.search,

        status:
          req.query.status,

        department:
          req.query.department,

        location:
          req.query.location,

        employmentType:
          req.query.employment_type,

        workMode:
          req.query.work_mode,
      });

    return res.status(200).json({
      success: true,
      data:
        result.jobs,
      pagination:
        result.pagination,
    });
  } catch (error) {
    console.error(
      'Get Career Jobs Error:',
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message,
    });
  }
};

// ======================================================
// CMS JOB STATS
// ======================================================

const getJobStats = async (
  req,
  res
) => {
  try {
    const stats =
      await careerService.getJobStats();

    return res.status(200).json({
      success: true,
      data:
        stats,
    });
  } catch (error) {
    console.error(
      'Get Job Stats Error:',
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message,
    });
  }
};

// ======================================================
// CMS GET JOB BY ID
// ======================================================

const getJobById = async (
  req,
  res
) => {
  try {
    const job =
      await careerService.getJobById(
        req.params.jobId
      );

    return res.status(200).json({
      success: true,
      data:
        job,
    });
  } catch (error) {
    const statusCode =
      getErrorStatusCode(
        error
      );

    return res.status(statusCode).json({
      success: false,
      message:
        error.message,
    });
  }
};

// ======================================================
// CREATE JOB
// ======================================================

const createJob = async (
  req,
  res
) => {
  try {
    const job =
      await careerService.createJob(
        req.body,
        getAuditContext(req)
      );

    return res.status(201).json({
      success: true,
      message:
        'Career job created successfully',
      data:
        job,
    });
  } catch (error) {
    if (
      error.code ===
      'P2002'
    ) {
      return res.status(400).json({
        success: false,
        message:
          'A career job with this slug already exists',
      });
    }

    const statusCode =
      getErrorStatusCode(
        error
      );

    return res.status(statusCode).json({
      success: false,
      message:
        error.message,
    });
  }
};

// ======================================================
// UPDATE JOB
// ======================================================

const updateJob = async (
  req,
  res
) => {
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
        'Career job updated successfully',
      data:
        job,
    });
  } catch (error) {
    if (
      error.code ===
      'P2002'
    ) {
      return res.status(400).json({
        success: false,
        message:
          'A career job with this slug already exists',
      });
    }

    const statusCode =
      getErrorStatusCode(
        error
      );

    return res.status(statusCode).json({
      success: false,
      message:
        error.message,
    });
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
        'Career job status updated successfully',
      data:
        job,
    });
  } catch (error) {
    const statusCode =
      getErrorStatusCode(
        error
      );

    return res.status(statusCode).json({
      success: false,
      message:
        error.message,
    });
  }
};

// ======================================================
// ARCHIVE JOB
// ======================================================

const archiveJob = async (
  req,
  res
) => {
  try {
    const job =
      await careerService.archiveJob(
        req.params.jobId,
        getAuditContext(req)
      );

    return res.status(200).json({
      success: true,
      message:
        'Career job archived successfully',
      data:
        job,
    });
  } catch (error) {
    const statusCode =
      getErrorStatusCode(
        error
      );

    return res.status(statusCode).json({
      success: false,
      message:
        error.message,
    });
  }
};

// ======================================================
// SUBMIT APPLICATION
// ======================================================

const submitApplication =
  async (
    req,
    res
  ) => {
    try {
      const application =
        await careerService.submitApplication({
          body:
            req.body,

          files:
            req.files,

          requestContext: {
            ipAddress:
              req.ip ||
              req.socket
                ?.remoteAddress ||
              null,

            userAgent:
              req.get(
                'user-agent'
              ) ||
              null,
          },
        });

      return res.status(201).json({
        success: true,
        message:
          'Application submitted successfully',
        data:
          application,
      });
    } catch (error) {
      console.error(
        'Submit Application Error:',
        error
      );

      const statusCode =
        getErrorStatusCode(
          error
        );

      return res.status(statusCode).json({
        success: false,
        message:
          error.message,
      });
    }
  };

// ======================================================
// GET APPLICATIONS
// ======================================================

const getApplications =
  async (
    req,
    res
  ) => {
    try {
      const result =
        await careerService.getApplications({
          page:
            req.query.page,

          limit:
            req.query.limit,

          search:
            req.query.search,

          status:
            req.query.status,

          applicationType:
            req.query.application_type,

          jobId:
            req.query.job_id,

          department:
            req.query.department,
        });

      return res.status(200).json({
        success: true,
        data:
          result.applications,
        pagination:
          result.pagination,
      });
    } catch (error) {
      console.error(
        'Get Applications Error:',
        error
      );

      return res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

// ======================================================
// APPLICATION STATS
// ======================================================

const getApplicationStats =
  async (
    req,
    res
  ) => {
    try {
      const stats =
        await careerService.getApplicationStats();

      return res.status(200).json({
        success: true,
        data:
          stats,
      });
    } catch (error) {
      console.error(
        'Get Application Stats Error:',
        error
      );

      return res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

// ======================================================
// GET APPLICATION BY ID
// ======================================================

const getApplicationById =
  async (
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
        data:
          application,
      });
    } catch (error) {
      const statusCode =
        getErrorStatusCode(
          error
        );

      return res.status(statusCode).json({
        success: false,
        message:
          error.message,
      });
    }
  };

// ======================================================
// UPDATE APPLICATION
// ======================================================

const updateApplication =
  async (
    req,
    res
  ) => {
    try {
      const application =
        await careerService.updateApplication(
          req.params.applicationId,
          req.body,
          req.user?.id ||
            null,
          getAuditContext(req)
        );

      return res.status(200).json({
        success: true,
        message:
          'Application updated successfully',
        data:
          application,
      });
    } catch (error) {
      const statusCode =
        getErrorStatusCode(
          error
        );

      return res.status(statusCode).json({
        success: false,
        message:
          error.message,
      });
    }
  };

// ======================================================
// UPDATE APPLICATION STATUS
// ======================================================

const updateApplicationStatus =
  async (
    req,
    res
  ) => {
    try {
      const application =
        await careerService.updateApplicationStatus(
          req.params.applicationId,
          req.body.status,
          req.user?.id ||
            null,
          getAuditContext(req)
        );

      return res.status(200).json({
        success: true,
        message:
          'Application status updated successfully',
        data:
          application,
      });
    } catch (error) {
      const statusCode =
        getErrorStatusCode(
          error
        );

      return res.status(statusCode).json({
        success: false,
        message:
          error.message,
      });
    }
  };

// ======================================================
// UPDATE APPLICATION NOTES
// ======================================================

const updateApplicationNotes =
  async (
    req,
    res
  ) => {
    try {
      const application =
        await careerService.updateApplicationNotes(
          req.params.applicationId,
          req.body.internal_notes,
          req.user?.id ||
            null,
          getAuditContext(req)
        );

      return res.status(200).json({
        success: true,
        message:
          'Application notes updated successfully',
        data:
          application,
      });
    } catch (error) {
      const statusCode =
        getErrorStatusCode(
          error
        );

      return res.status(statusCode).json({
        success: false,
        message:
          error.message,
      });
    }
  };

// ======================================================
// DELETE APPLICATION
// ======================================================

const deleteApplication =
  async (
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
          'Application deleted successfully',
      });
    } catch (error) {
      const statusCode =
        getErrorStatusCode(
          error
        );

      return res.status(statusCode).json({
        success: false,
        message:
          error.message,
      });
    }
  };

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