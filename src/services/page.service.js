const prisma = require("../config/prisma");
const { uploadToR2 } = require("../utils/uploadToR2");

// ============================================================
// ERROR HELPER
// ============================================================

const httpError = (status, message) => {
  const error = new Error(message);

  error.status = status;
  error.statusCode = status;

  return error;
};

// ============================================================
// PAGE ID VALIDATION
// ============================================================

const parsePageId = (id) => {
  const pageId = Number(id);

  if (
    !Number.isSafeInteger(pageId) ||
    pageId <= 0 ||
    pageId > 2147483647
  ) {
    throw httpError(400, "Invalid page ID");
  }

  return pageId;
};

// ============================================================
// WEBSITE SLUG MAPPING
// ============================================================

const PAGE_SLUG_MAP = {
  "about-us": "about-us",
  "our-process": "our-process",
  "safety-first": "silica-first",
};

const resolvePageSlug = (slug) => {
  const value = String(slug || "")
    .trim()
    .toLowerCase()
    .replace(/^\/+|\/+$/g, "");

  return PAGE_SLUG_MAP[value] || value;
};

// ============================================================
// SEO PAYLOAD VALIDATION
// ============================================================

const normalizeSeoPayload = (data = {}) => {
  if (
    !data ||
    typeof data !== "object" ||
    Array.isArray(data)
  ) {
    throw httpError(400, "Invalid SEO payload");
  }

  const seo = {};

  const textFields = [
    "meta_title",
    "meta_description",
    "canonical_url",
    "og_title",
    "og_image_url",
    "og_description",
    "seo_content",
  ];

  textFields.forEach((field) => {
    if (data[field] === undefined) {
      return;
    }

    if (data[field] === null) {
      seo[field] = null;
      return;
    }

    if (typeof data[field] !== "string") {
      throw httpError(
        400,
        `${field} must be a string`
      );
    }

    seo[field] = data[field].trim();
  });

  // Validate URLs

  ["canonical_url", "og_image_url"].forEach(
    (field) => {
      if (!seo[field]) {
        return;
      }

      let url;

      try {
        url = new URL(seo[field]);
      } catch {
        throw httpError(
          400,
          `${field} must be a valid absolute URL`
        );
      }

      if (
        !["http:", "https:"].includes(
          url.protocol
        )
      ) {
        throw httpError(
          400,
          `${field} must use HTTP or HTTPS`
        );
      }
    }
  );

  // Robots Index

  if (data.robots_index !== undefined) {
    if (
      !["index", "noindex"].includes(
        data.robots_index
      )
    ) {
      throw httpError(
        400,
        "Invalid robots_index value"
      );
    }

    seo.robots_index = data.robots_index;
  }

  // Robots Follow

  if (data.robots_follow !== undefined) {
    if (
      !["follow", "nofollow"].includes(
        data.robots_follow
      )
    ) {
      throw httpError(
        400,
        "Invalid robots_follow value"
      );
    }

    seo.robots_follow = data.robots_follow;
  }

  // Schema Markup

  if (data.schema_markup !== undefined) {
    let schema = data.schema_markup;

    if (typeof schema === "string") {
      try {
        schema = JSON.parse(
          schema.trim() || "{}"
        );
      } catch {
        throw httpError(
          400,
          "Schema markup must be valid JSON"
        );
      }
    }

    if (schema === null) {
      schema = {};
    }

    if (typeof schema !== "object") {
      throw httpError(
        400,
        "Schema markup must be a JSON object or array"
      );
    }

    seo.schema_markup = schema;
  }

  return seo;
};

// ============================================================
// CHECK PAGE EXISTS
// ============================================================

const ensurePageExists = async (id) => {
  const pageId = parsePageId(id);

  const page = await prisma.pages.findUnique({
    where: {
      id: pageId,
    },

    select: {
      id: true,
      slug: true,
      title: true,
      status: true,
    },
  });

  if (!page) {
    throw httpError(404, "Page not found");
  }

  return page;
};

// ============================================================
// CREATE PAGE
// ============================================================

const createPage = async (data) => {
  const existingPage =
    await prisma.pages.findUnique({
      where: {
        slug: data.slug,
      },
    });

  if (existingPage) {
    throw httpError(
      409,
      "Page slug already exists"
    );
  }

  const seo = normalizeSeoPayload(
    data.seo ?? {}
  );

  return prisma.pages.create({
    data: {
      slug: data.slug,

      title: data.title,

      content: data.content ?? {},

      status: data.status || "draft",

      page_seo: {
        create: {
          robots_index: "index",

          robots_follow: "follow",

          schema_markup: {},

          ...seo,
        },
      },
    },

    include: {
      page_seo: true,
    },
  });
};

// ============================================================
// UPDATE PAGE
// ============================================================

const updatePage = async (id, data) => {
  const pageId = parsePageId(id);

  await ensurePageExists(pageId);

  const updateData = {
    slug: data.slug,

    title: data.title,

    content: data.content,

    status: data.status,

    updated_at: new Date(),
  };

  // Only update SEO when explicitly provided.
  // Normal content saves will not modify SEO.

  if (data.seo !== undefined) {
    const seo = normalizeSeoPayload(
      data.seo
    );

    if (Object.keys(seo).length > 0) {
      updateData.page_seo = {
        upsert: {
          create: {
            robots_index: "index",

            robots_follow: "follow",

            schema_markup: {},

            ...seo,
          },

          update: {
            ...seo,

            updated_at: new Date(),
          },
        },
      };
    }
  }

  return prisma.pages.update({
    where: {
      id: pageId,
    },

    data: updateData,

    include: {
      page_seo: true,
    },
  });
};

// ============================================================
// GET PAGE BY SLUG
// ============================================================

const getPageBySlug = async (slug) => {
  return prisma.pages.findFirst({
    where: {
      slug,

      status: "published",
    },

    include: {
      page_seo: true,
    },
  });
};

// ============================================================
// DELETE PAGE
// ============================================================

const deletePage = async (id) => {
  const pageId = parsePageId(id);

  await ensurePageExists(pageId);

  return prisma.pages.delete({
    where: {
      id: pageId,
    },
  });
};

// ============================================================
// UPLOAD PAGE IMAGE
// ============================================================

const uploadPageImage = async (file) => {
  if (!file) {
    throw httpError(
      400,
      "Image is required"
    );
  }

  const uploadedImage = await uploadToR2(
    file,
    "cms-pages",
    "image"
  );

  return uploadedImage;
};

// ============================================================
// PAGE SEO - GET ALL
// ============================================================

const getAllPageSeo = async () => {
  return prisma.pages.findMany({
    select: {
      id: true,

      slug: true,

      title: true,

      status: true,

      page_seo: true,
    },

    orderBy: {
      title: "asc",
    },
  });
};

// ============================================================
// PAGE SEO - GET BY PAGE ID
// ============================================================

const getPageSeoById = async (id) => {
  const pageId = parsePageId(id);

  const page = await ensurePageExists(
    pageId
  );

  const seo = await prisma.page_seo.findUnique({
    where: {
      page_id: pageId,
    },
  });

  return {
    ...page,

    page_seo: seo,
  };
};

// ============================================================
// PAGE SEO - PUBLIC GET BY SLUG
// ============================================================

const getPublicPageSeo = async (slug) => {
  const resolvedSlug = resolvePageSlug(
    slug
  );

  const page = await prisma.pages.findFirst({
    where: {
      slug: resolvedSlug,

      status: "published",
    },

    select: {
      id: true,

      slug: true,

      title: true,

      page_seo: true,
    },
  });

  if (!page || !page.page_seo) {
    return null;
  }

  return {
    ...page.page_seo,

    page_id: page.id,

    page_slug: page.slug,

    page_title: page.title,
  };
};

// ============================================================
// PAGE SEO - CREATE
// ============================================================

const createPageSeo = async (data) => {
  const pageId = parsePageId(
    data.page_id
  );

  await ensurePageExists(pageId);

  const existingSeo =
    await prisma.page_seo.findUnique({
      where: {
        page_id: pageId,
      },
    });

  if (existingSeo) {
    throw httpError(
      409,
      "SEO already exists for this page"
    );
  }

  const seo = normalizeSeoPayload(data);

  if (Object.keys(seo).length === 0) {
    throw httpError(
      400,
      "No SEO fields provided"
    );
  }

  try {
    return await prisma.page_seo.create({
      data: {
        page_id: pageId,

        robots_index: "index",

        robots_follow: "follow",

        schema_markup: {},

        ...seo,
      },
    });
  } catch (error) {
    if (error.code === "P2002") {
      throw httpError(
        409,
        "SEO already exists for this page"
      );
    }

    throw error;
  }
};

// ============================================================
// PAGE SEO - UPDATE OR CREATE
// ============================================================

const updatePageSeo = async (id, data) => {
  const pageId = parsePageId(id);

  await ensurePageExists(pageId);

  const seo = normalizeSeoPayload(data);

  if (Object.keys(seo).length === 0) {
    throw httpError(
      400,
      "No SEO fields provided"
    );
  }

  return prisma.page_seo.upsert({
    where: {
      page_id: pageId,
    },

    create: {
      page_id: pageId,

      robots_index: "index",

      robots_follow: "follow",

      schema_markup: {},

      ...seo,
    },

    update: {
      ...seo,

      updated_at: new Date(),
    },
  });
};

// ============================================================
// PAGE SEO - DELETE
// ============================================================

const deletePageSeo = async (id) => {
  const pageId = parsePageId(id);

  await ensurePageExists(pageId);

  try {
    return await prisma.page_seo.delete({
      where: {
        page_id: pageId,
      },
    });
  } catch (error) {
    if (error.code === "P2025") {
      throw httpError(
        404,
        "Page SEO not found"
      );
    }

    throw error;
  }
};

// ============================================================
// EXPORTS
// ============================================================

module.exports = {
  // Existing Page CRUD

  createPage,

  updatePage,

  getPageBySlug,

  deletePage,

  uploadPageImage,

  // Page SEO CRUD

  getAllPageSeo,

  getPageSeoById,

  getPublicPageSeo,

  createPageSeo,

  updatePageSeo,

  deletePageSeo,
};