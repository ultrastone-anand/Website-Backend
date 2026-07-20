const blogService = require("../services/blog.service");
const getAuditContext = require("../utils/getAuditContext");

// ================== GET ALL BLOGS ==================

const getBlogs = async (
  req,
  res
) => {

  try {

    const filters = {

      status:
        req.query.status,

      search:
        req.query.search,

      tag:
        req.query.tag,

      page:
        req.query.page,

      limit:
        req.query.limit

    };

    const result =
      await blogService.getBlogs(
        filters
      );

    res.status(200).json({

      success: true,

      data:
        result.data,

      pagination:
        result.pagination

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message:
        error.message

    });

  }

};

// ================== GET BLOG BY ID ==================

const getBlogById = async (
  req,
  res
) => {

  try {

    const {
      blogId
    } = req.params;

    const blog =
      await blogService.getBlogById(
        blogId
      );

    res.status(200).json({

      success: true,

      data:
        blog

    });

  } catch (error) {

    if (
      error.message ===
      "Blog post not found"
    ) {

      return res.status(404).json({

        success: false,

        message:
          error.message

      });

    }

    res.status(500).json({

      success: false,

      message:
        error.message

    });

  }

};

// ================== CREATE BLOG ==================

const createBlog = async (
  req,
  res
) => {

  try {

    const blog =
      await blogService.createBlog(

        req.body,

        req.user,

        getAuditContext(req)

      );

    res.status(201).json({

      success: true,

      message:
        "Blog post created successfully",

      data:
        blog

    });

  } catch (error) {

    if (
      error.code ===
      "P2002"
    ) {

      return res.status(400).json({

        success: false,

        message:
          "A blog post with this slug already exists"

      });

    }

    if (
      error.message ===
      "Blog title is required" ||
      error.message ===
      "Blog content is required" ||
      error.message ===
      "Invalid blog status" ||
      error.message ===
      "Invalid cover media" ||
      error.message ===
      "Invalid content media"
    ) {

      return res.status(400).json({

        success: false,

        message:
          error.message

      });

    }

    res.status(500).json({

      success: false,

      message:
        error.message

    });

  }

};

// ================== UPDATE BLOG ==================

const updateBlog = async (
  req,
  res
) => {

  try {

    const {
      blogId
    } = req.params;

    const blog =
      await blogService.updateBlog(

        blogId,

        req.body,

        req.user,

        getAuditContext(req)

      );

    res.status(200).json({

      success: true,

      message:
        "Blog post updated successfully",

      data:
        blog

    });

  } catch (error) {

    if (
      error.message ===
      "Blog post not found"
    ) {

      return res.status(404).json({

        success: false,

        message:
          error.message

      });

    }

    if (
      error.code ===
      "P2002"
    ) {

      return res.status(400).json({

        success: false,

        message:
          "A blog post with this slug already exists"

      });

    }

    if (
      error.message ===
      "Blog title is required" ||
      error.message ===
      "Blog content is required" ||
      error.message ===
      "Invalid blog status" ||
      error.message ===
      "Invalid cover media" ||
      error.message ===
      "Invalid content media"
    ) {

      return res.status(400).json({

        success: false,

        message:
          error.message

      });

    }

    res.status(500).json({

      success: false,

      message:
        error.message

    });

  }

};

// ================== DELETE BLOG ==================

const deleteBlog = async (
  req,
  res
) => {

  try {

    const {
      blogId
    } = req.params;

    await blogService.deleteBlog(

      blogId,

      req.user,

      getAuditContext(req)

    );

    res.status(200).json({

      success: true,

      message:
        "Blog post deleted successfully"

    });

  } catch (error) {

    if (
      error.message ===
      "Blog post not found"
    ) {

      return res.status(404).json({

        success: false,

        message:
          error.message

      });

    }

    res.status(500).json({

      success: false,

      message:
        error.message

    });

  }

};

// ================== PUBLISH BLOG ==================

const publishBlog = async (
  req,
  res
) => {

  try {

    const {
      blogId
    } = req.params;

    const blog =
      await blogService.publishBlog(

        blogId,

        req.user,

        getAuditContext(req)

      );

    res.status(200).json({

      success: true,

      message:
        "Blog post published successfully",

      data:
        blog

    });

  } catch (error) {

    if (
      error.message ===
      "Blog post not found"
    ) {

      return res.status(404).json({

        success: false,

        message:
          error.message

      });

    }

    res.status(500).json({

      success: false,

      message:
        error.message

    });

  }

};

// ================== MOVE BLOG TO DRAFT ==================

const draftBlog = async (
  req,
  res
) => {

  try {

    const {
      blogId
    } = req.params;

    const blog =
      await blogService.draftBlog(

        blogId,

        req.user,

        getAuditContext(req)

      );

    res.status(200).json({

      success: true,

      message:
        "Blog post moved to draft successfully",

      data:
        blog

    });

  } catch (error) {

    if (
      error.message ===
      "Blog post not found"
    ) {

      return res.status(404).json({

        success: false,

        message:
          error.message

      });

    }

    res.status(500).json({

      success: false,

      message:
        error.message

    });

  }

};

// ================== ARCHIVE BLOG ==================

const archiveBlog = async (
  req,
  res
) => {

  try {

    const {
      blogId
    } = req.params;

    const blog =
      await blogService.archiveBlog(

        blogId,

        req.user,

        getAuditContext(req)

      );

    res.status(200).json({

      success: true,

      message:
        "Blog post archived successfully",

      data:
        blog

    });

  } catch (error) {

    if (
      error.message ===
      "Blog post not found"
    ) {

      return res.status(404).json({

        success: false,

        message:
          error.message

      });

    }

    res.status(500).json({

      success: false,

      message:
        error.message

    });

  }

};

// ================== GET BLOG TAGS ==================

const getTags = async (
  req,
  res
) => {

  try {

    const tags =
      await blogService.getTags();

    res.status(200).json({

      success: true,

      data:
        tags

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message:
        error.message

    });

  }

};

// ================== CREATE BLOG TAG ==================

const createTag = async (
  req,
  res
) => {

  try {

    const tag =
      await blogService.createTag(

        req.body,

        req.user,

        getAuditContext(req)

      );

    res.status(201).json({

      success: true,

      message:
        "Blog tag created successfully",

      data:
        tag

    });

  } catch (error) {

    if (
      error.code ===
      "P2002"
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Blog tag already exists"

      });

    }

    if (
      error.message ===
      "Tag name is required"
    ) {

      return res.status(400).json({

        success: false,

        message:
          error.message

      });

    }

    res.status(500).json({

      success: false,

      message:
        error.message

    });

  }

};

// ================== GENERATE R2 UPLOAD URL ==================

const generateUploadUrl = async (
  req,
  res
) => {

  try {

    const result =
      await blogService.generateUploadUrl(

        req.body,

        req.user

      );

    res.status(200).json({

      success: true,

      data:
        result

    });

  } catch (error) {

    if (
      error.message ===
      "Filename is required" ||
      error.message ===
      "Content type is required" ||
      error.message ===
      "Invalid media type"
    ) {

      return res.status(400).json({

        success: false,

        message:
          error.message

      });

    }

    res.status(500).json({

      success: false,

      message:
        error.message

    });

  }

};

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

  generateUploadUrl

};