// routes/career.routes.js

const router =
  require('express').Router();

const upload =
  require('../middlewares/upload');

const authenticate =
  require('../middlewares/auth.middleware');

const careerController =
  require('../controller/career.controller');

// ======================================================
// PUBLIC JOB ROUTES
// Keep specific routes before dynamic routes.
// ======================================================

// Get published career jobs
router.get(
  '/jobs',
  careerController.getPublishedJobs
);

// Get public filter options
router.get(
  '/jobs/filters',
  careerController.getPublicJobFilters
);

// Get published job by slug
router.get(
  '/jobs/:slug',
  careerController.getPublishedJobBySlug
);

// ======================================================
// PUBLIC APPLICATION ROUTES
// ======================================================

// Submit job application or general resume
router.post(
  '/applications',
  upload.fields([
    {
      name: 'resume',
      maxCount: 1,
    },
    {
      name: 'cover_letter',
      maxCount: 1,
    },
  ]),
  careerController.submitApplication
);

// ======================================================
// CMS JOB ROUTES
// ======================================================

// Get all jobs for CMS
router.get(
  '/admin/jobs',
  authenticate,
  careerController.getJobs
);

// Get CMS job statistics
router.get(
  '/admin/jobs/stats',
  authenticate,
  careerController.getJobStats
);

// Get single CMS job
router.get(
  '/admin/jobs/:jobId',
  authenticate,
  careerController.getJobById
);

// Create job
router.post(
  '/admin/jobs',
  authenticate,
  careerController.createJob
);

// Update complete job
router.put(
  '/admin/jobs/:jobId',
  authenticate,
  careerController.updateJob
);

// Partially update job
router.patch(
  '/admin/jobs/:jobId',
  authenticate,
  careerController.updateJob
);

// Update job status
router.patch(
  '/admin/jobs/:jobId/status',
  authenticate,
  careerController.updateJobStatus
);

// Archive job
router.delete(
  '/admin/jobs/:jobId',
  authenticate,
  careerController.archiveJob
);

// ======================================================
// CMS APPLICATION ROUTES
// ======================================================

// Get applications
router.get(
  '/admin/applications',
  authenticate,
  careerController.getApplications
);

// Get application statistics
router.get(
  '/admin/applications/stats',
  authenticate,
  careerController.getApplicationStats
);

// Get single application
router.get(
  '/admin/applications/:applicationId',
  authenticate,
  careerController.getApplicationById
);

// Update application
router.patch(
  '/admin/applications/:applicationId',
  authenticate,
  careerController.updateApplication
);

// Update application status
router.patch(
  '/admin/applications/:applicationId/status',
  authenticate,
  careerController.updateApplicationStatus
);

// Update internal notes
router.patch(
  '/admin/applications/:applicationId/notes',
  authenticate,
  careerController.updateApplicationNotes
);

// Delete application and resume files
router.delete(
  '/admin/applications/:applicationId',
  authenticate,
  careerController.deleteApplication
);

module.exports = router;