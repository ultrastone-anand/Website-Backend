
const blogService = require("../services/blog.service");
const getAuditContext = require("../utils/getAuditContext");

// ======================================================
// SAFE ERROR HANDLING
// ======================================================

// Only explicitly approved validation messages
// may be returned to API clients.

const SAFE_BLOG_VALIDATION_MESSAGES = new Set([
  "Blog title is required",
  "Blog content is required",
  "Invalid blog status",
  "Invalid cover media",
  "Invalid content media",
]);

const SAFE_UPLOAD_VALIDATION_MESSAGES = new Set([
  "Filename is required",
  "Content type is required",
  "Invalid media type",
]);

const sendBlogError = (
  res,
  error,
  label,
  fallbackMessage,
  options = {}
) => {
  // Full error details remain server-side only.
  console.error(label, error);

  const {
    allowNotFound = false,
    allowDuplicate = false,
    allowedValidationMessages = null,
    duplicateMessage = "Resource already exists",
  } = options;

  // Preserve known blog-not-found responses.
  if (
    allowNotFound &&
    error?.message === "Blog post not found"
  ) {
    return res.status(404).json({
      success: false,
      message: "Blog post not found",
    });
  }

  // Preserve known Prisma duplicate handling.
  if (
    allowDuplicate &&
    error?.code === "P2002"
  ) {
    return res.status(400).json({
      success: false,
      message: duplicateMessage,
    });
  }

  // Only explicitly approved validation messages.
  if (
    allowedValidationMessages &&
    allowedValidationMessages.has(error?.message)
  ) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  // Never expose unexpected internal error messages.
  return res.status(500).json({
    success: false,
    message: fallbackMessage,
  });
};

// ======================================================
// GET ALL BLOGS
// ======================================================

const getBlogs = async (req, res) => {
  try {
    const filters = {
      status: req.query.status,
      search: req.query.search,
      tag: req.query.tag,
      page: req.query.page,
      limit: req.query.limit,
    };

    const result = await blogService.getBlogs(
      filters
    );

    return res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    return sendBlogError(
      res,
      error,
      "Get Blogs Error:",
      "Failed to fetch blogs"
    );
  }
};

// ======================================================
// GET BLOG BY ID
// ======================================================

const getBlogById = async (req, res) => {
  try {
    const { blogId } = req.params;

    const blog = await blogService.getBlogById(
      blogId
    );

    return res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    return sendBlogError(
      res,
      error,
      "Get Blog By ID Error:",
      "Failed to fetch blog",
      {
        allowNotFound: true,
      }
    );
  }
};

// ======================================================
// CREATE BLOG
// ======================================================

const createBlog = async (req, res) => {
  try {
    const blog = await blogService.createBlog(
      req.body,
      req.user,
      getAuditContext(req)
    );

    return res.status(201).json({
      success: true,
      message: "Blog post created successfully",
      data: blog,
    });
  } catch (error) {
    return sendBlogError(
      res,
      error,
      "Create Blog Error:",
      "Failed to create blog",
      {
        allowDuplicate: true,
        duplicateMessage:
          "A blog post with this slug already exists",
        allowedValidationMessages:
          SAFE_BLOG_VALIDATION_MESSAGES,
      }
    );
  }
};

// ======================================================
// UPDATE BLOG
// ======================================================

const updateBlog = async (req, res) => {
  try {
    const { blogId } = req.params;

    const blog = await blogService.updateBlog(
      blogId,
      req.body,
      req.user,
      getAuditContext(req)
    );

    return res.status(200).json({
      success: true,
      message: "Blog post updated successfully",
      data: blog,
    });
  } catch (error) {
    return sendBlogError(
      res,
      error,
      "Update Blog Error:",
      "Failed to update blog",
      {
        allowNotFound: true,
        allowDuplicate: true,
        duplicateMessage:
          "A blog post with this slug already exists",
        allowedValidationMessages:
          SAFE_BLOG_VALIDATION_MESSAGES,
      }
    );
  }
};

// ======================================================
// DELETE BLOG
// ======================================================

const deleteBlog = async (req, res) => {
  try {
    const { blogId } = req.params;

    await blogService.deleteBlog(
      blogId,
      req.user,
      getAuditContext(req)
    );

    return res.status(200).json({
      success: true,
      message: "Blog post deleted successfully",
    });
  } catch (error) {
    return sendBlogError(
      res,
      error,
      "Delete Blog Error:",
      "Failed to delete blog",
      {
        allowNotFound: true,
      }
    );
  }
};

// ======================================================
// PUBLISH BLOG
// ======================================================

const publishBlog = async (req, res) => {
  try {
    const { blogId } = req.params;

    const blog = await blogService.publishBlog(
      blogId,
      req.user,
      getAuditContext(req)
    );

    return res.status(200).json({
      success: true,
      message: "Blog post published successfully",
      data: blog,
    });
  } catch (error) {
    return sendBlogError(
      res,
      error,
      "Publish Blog Error:",
      "Failed to publish blog",
      {
        allowNotFound: true,
      }
    );
  }
};

// ======================================================
// MOVE BLOG TO DRAFT
// ======================================================

const draftBlog = async (req, res) => {
  try {
    const { blogId } = req.params;

    const blog = await blogService.draftBlog(
      blogId,
      req.user,
      getAuditContext(req)
    );

    return res.status(200).json({
      success: true,
      message:
        "Blog post moved to draft successfully",
      data: blog,
    });
  } catch (error) {
    return sendBlogError(
      res,
      error,
      "Draft Blog Error:",
      "Failed to move blog to draft",
      {
        allowNotFound: true,
      }
    );
  }
};

// ======================================================
// ARCHIVE BLOG
// ======================================================

const archiveBlog = async (req, res) => {
  try {
    const { blogId } = req.params;

    const blog = await blogService.archiveBlog(
      blogId,
      req.user,
      getAuditContext(req)
    );

    return res.status(200).json({
      success: true,
      message: "Blog post archived successfully",
      data: blog,
    });
  } catch (error) {
    return sendBlogError(
      res,
      error,
      "Archive Blog Error:",
      "Failed to archive blog",
      {
        allowNotFound: true,
      }
    );
  }
};

// ======================================================
// GET BLOG TAGS
// ======================================================

const getTags = async (req, res) => {
  try {
    const tags = await blogService.getTags();

    return res.status(200).json({
      success: true,
      data: tags,
    });
  } catch (error) {
    return sendBlogError(
      res,
      error,
      "Get Blog Tags Error:",
      "Failed to fetch blog tags"
    );
  }
};

// ======================================================
// CREATE BLOG TAG
// ======================================================

const createTag = async (req, res) => {
  try {
    const tag = await blogService.createTag(
      req.body,
      req.user,
      getAuditContext(req)
    );

    return res.status(201).json({
      success: true,
      message: "Blog tag created successfully",
      data: tag,
    });
  } catch (error) {
    return sendBlogError(
      res,
      error,
      "Create Blog Tag Error:",
      "Failed to create blog tag",
      {
        allowDuplicate: true,
        duplicateMessage:
          "Blog tag already exists",
        allowedValidationMessages:
          new Set(["Tag name is required"]),
      }
    );
  }
};

// ======================================================
// GENERATE R2 UPLOAD URL
// ======================================================

const generateUploadUrl = async (req, res) => {
  try {
    const result =
      await blogService.generateUploadUrl(
        req.body,
        req.user
      );

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return sendBlogError(
      res,
      error,
      "Generate Blog Upload URL Error:",
      "Failed to generate upload URL",
      {
        allowedValidationMessages:
          SAFE_UPLOAD_VALIDATION_MESSAGES,
      }
    );
  }
};

// ======================================================
// EXPORTS
// ======================================================

module.exports = {
  getBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  publishBlog,
  draftBlog,
  archiveBlog,
  getTags,
  createTag,
  generateUploadUrl,
};
