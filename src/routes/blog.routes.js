const router = require("express").Router();

const blogController = require("../controller/blog.controller");
const authenticate = require("../middlewares/auth.middleware");

// ================== BLOG TAG ROUTES ==================

// Get all blog tags
router.get(
  "/tags",
  blogController.getTags
);

// Create a new blog tag
router.post(
  "/tags",
  authenticate,
  blogController.createTag
);


// ================== BLOG UPLOAD ROUTES ==================

// Generate R2 presigned upload URL
router.post(
  "/upload-url",
  authenticate,
  blogController.generateUploadUrl
);


// ================== BLOG STATUS ROUTES ==================

// Publish blog post
router.patch(
  "/:blogId/publish",
  authenticate,
  blogController.publishBlog
);

// Move blog post to draft
router.patch(
  "/:blogId/draft",
  authenticate,
  blogController.draftBlog
);

// Archive blog post
router.patch(
  "/:blogId/archive",
  authenticate,
  blogController.archiveBlog
);


// ================== BLOG CRUD ROUTES ==================

// Get all blog posts
router.get(
  "/",
  blogController.getBlogs
);

// Get single blog post by ID
router.get(
  "/:blogId",
  blogController.getBlogById
);

// Create a new blog post
router.post(
  "/",
  authenticate,
  blogController.createBlog
);

// Update complete blog post
router.put(
  "/:blogId",
  authenticate,
  blogController.updateBlog
);

// Partially update blog post
router.patch(
  "/:blogId",
  authenticate,
  blogController.updateBlog
);

// Soft delete blog post
router.delete(
  "/:blogId",
  authenticate,
  blogController.deleteBlog
);

module.exports = router;