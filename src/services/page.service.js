
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
// ID VALIDATION
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
// SEO IDENTIFIER MODE
// ============================================================

const resolveSeoMode = (mode = "page") => {
  if (!["page", "record"].includes(mode)) {
    throw httpError(
      400,
      "Invalid SEO mode. Use page or record."
    );
  }

  return mode;
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
// FRONTEND ROUTE NORMALIZATION
// ============================================================

const normalizeRoutePath = (value) => {
  if (
    typeof value !== "string" ||
    !value.trim()
  ) {
    throw httpError(
      400,
      "Frontend route is required"
    );
  }

  let routePath = value.trim();

  if (!routePath.startsWith("/")) {
    routePath = `/${routePath}`;
  }

  routePath =
    routePath.replace(/\/+$/, "") || "/";

  if (
    routePath.length > 255 ||
    !/^\/(?:[a-z0-9_-]+(?:\/[a-z0-9_-]+)*)?$/.test(
      routePath
    )
  ) {
    throw httpError(
      400,
      "Invalid frontend route"
    );
  }

  return routePath;
};

// ============================================================
// CMS PAGE FRONTEND ROUTE
// ============================================================

const getCmsPageRoute = (slug) => {
  const resolvedSlug = resolvePageSlug(slug);

  if (resolvedSlug === "silica-first") {
    return "/safety-first";
  }

  return normalizeRoutePath(resolvedSlug);
};

// ============================================================
// PAGE NAME VALIDATION
// ============================================================

const normalizePageName = (value) => {
  if (
    typeof value !== "string" ||
    !value.trim()
  ) {
    throw httpError(
      400,
      "Page name is required"
    );
  }

  const pageName = value.trim();

  if (pageName.length > 255) {
    throw httpError(
      400,
      "Page name cannot exceed 255 characters"
    );
  }

  return pageName;
};

// ============================================================
// SEO RELATION INCLUDE
// ============================================================

const SEO_PAGE_INCLUDE = {
  pages: {
    select: {
      id: true,
      slug: true,
      title: true,
      status: true,
    },
  },
};

// ============================================================
// DEFAULT SEO VALUES
// ============================================================

const getDefaultSeoValues = () => ({
  robots_index: "index",
  robots_follow: "follow",
  schema_markup: {},
});

// ============================================================
// FORMAT CENTRALIZED SEO RECORD
// ============================================================

const formatSeoRecord = (record) => {
  if (!record) {
    return null;
  }

  const { pages, ...seo } = record;

  const routePath =
    seo.route_path ||
    (pages
      ? getCmsPageRoute(pages.slug)
      : null);

  const pageName =
    seo.page_name ||
    pages?.title ||
    null;

  const isStandalone =
    seo.page_id === null;

  const isConfigured = Boolean(
    seo.meta_title?.trim() &&
    seo.meta_description?.trim()
  );

  return {
    ...seo,

    page_name: pageName,

    route_path: routePath,

    page_slug:
      pages?.slug ||
      routePath?.replace(/^\/+/, "") ||
      null,

    page_title: pageName,

    page_type: isStandalone
      ? "STANDALONE"
      : "CMS_MANAGED",

    page_status:
      pages?.status || null,

    seo_status: isConfigured
      ? "CONFIGURED"
      : "PENDING",
  };
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
    throw httpError(
      400,
      "Invalid SEO payload"
    );
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

  // ==========================================================
  // TITLE LENGTH VALIDATION
  // ==========================================================

  ["meta_title", "og_title"].forEach(
    (field) => {
      if (
        typeof seo[field] === "string" &&
        seo[field].length > 255
      ) {
        throw httpError(
          400,
          `${field} cannot exceed 255 characters`
        );
      }
    }
  );

  // ==========================================================
  // URL VALIDATION
  // ==========================================================

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

  // ==========================================================
  // ROBOTS INDEX
  // ==========================================================

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

  // ==========================================================
  // ROBOTS FOLLOW
  // ==========================================================

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

  // ==========================================================
  // SCHEMA MARKUP
  // ==========================================================

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
// CHECK CMS PAGE EXISTS
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
    throw httpError(
      404,
      "Page not found"
    );
  }

  return page;
};

// ============================================================
// CHECK SEO RECORD EXISTS
// ============================================================

const ensureSeoRecordExists = async (id) => {
  const seoId = parsePageId(id);

  const record =
    await prisma.page_seo.findUnique({
      where: {
        id: seoId,
      },

      include: SEO_PAGE_INCLUDE,
    });

  if (!record) {
    throw httpError(
      404,
      "Page SEO not found"
    );
  }

  return record;
};

// ============================================================
// CREATE CMS PAGE
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

  const pageName = normalizePageName(
    data.title
  );

  const routePath = getCmsPageRoute(
    data.slug
  );

  try {
    return await prisma.pages.create({
      data: {
        slug: data.slug,

        title: data.title,

        content: data.content ?? {},

        status: data.status || "draft",

        page_seo: {
          create: {
            page_name: pageName,

            route_path: routePath,

            ...getDefaultSeoValues(),

            ...seo,
          },
        },
      },

      include: {
        page_seo: true,
      },
    });
  } catch (error) {
    if (error.code === "P2002") {
      throw httpError(
        409,
        "Page slug or SEO route already exists"
      );
    }

    throw error;
  }
};

// ============================================================
// UPDATE CMS PAGE
// ============================================================

const updatePage = async (id, data) => {
  const pageId = parsePageId(id);

  const page = await ensurePageExists(
    pageId
  );

  const updateData = {
    slug: data.slug,

    title: data.title,

    content: data.content,

    status: data.status,

    updated_at: new Date(),
  };

  // ==========================================================
  // SYNCHRONIZE SEO PAGE NAME AND ROUTE
  // ==========================================================

  const seoIdentity = {};

  if (
    data.title !== undefined &&
    data.title !== page.title
  ) {
    seoIdentity.page_name =
      normalizePageName(data.title);
  }

  if (
    data.slug !== undefined &&
    data.slug !== page.slug
  ) {
    seoIdentity.route_path =
      getCmsPageRoute(data.slug);
  }

  // ==========================================================
  // ONLY UPDATE SEO METADATA WHEN EXPLICITLY PROVIDED
  // ==========================================================

  const seo =
    data.seo !== undefined
      ? normalizeSeoPayload(data.seo)
      : {};

  const seoUpdate = {
    ...seoIdentity,
    ...seo,
  };

  if (Object.keys(seoUpdate).length > 0) {
    updateData.page_seo = {
      upsert: {
        create: {
          page_name: normalizePageName(
            data.title ?? page.title
          ),

          route_path: getCmsPageRoute(
            data.slug ?? page.slug
          ),

          ...getDefaultSeoValues(),

          ...seo,
        },

        update: {
          ...seoUpdate,

          updated_at: new Date(),
        },
      },
    };
  }

  try {
    return await prisma.pages.update({
      where: {
        id: pageId,
      },

      data: updateData,

      include: {
        page_seo: true,
      },
    });
  } catch (error) {
    if (error.code === "P2002") {
      throw httpError(
        409,
        "Page slug or SEO route already exists"
      );
    }

    throw error;
  }
};

// ============================================================
// GET CMS PAGE BY SLUG
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
// DELETE CMS PAGE
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

const getAllPageSeo = async (
  mode = "page"
) => {
  const seoMode = resolveSeoMode(mode);

  // ==========================================================
  // CENTRALIZED SEO MANAGEMENT
  // RETURNS ALL RECORDS FROM page_seo
  // ==========================================================

  if (seoMode === "record") {
    const records =
      await prisma.page_seo.findMany({
        include: SEO_PAGE_INCLUDE,

        orderBy: [
          {
            page_name: "asc",
          },
          {
            id: "asc",
          },
        ],
      });

    return records.map(formatSeoRecord);
  }

  // ==========================================================
  // LEGACY CMS PAGE SEO
  // EXISTING RESPONSE STRUCTURE PRESERVED
  // ==========================================================

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
// PAGE SEO - GET BY PAGE ID OR SEO RECORD ID
// ============================================================

const getPageSeoById = async (
  id,
  mode = "page"
) => {
  const seoMode = resolveSeoMode(mode);

  // ==========================================================
  // CENTRALIZED SEO RECORD
  // ==========================================================

  if (seoMode === "record") {
    const record =
      await ensureSeoRecordExists(id);

    return formatSeoRecord(record);
  }

  // ==========================================================
  // LEGACY CMS PAGE ID
  // ==========================================================

  const pageId = parsePageId(id);

  const page = await ensurePageExists(
    pageId
  );

  const seo =
    await prisma.page_seo.findUnique({
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
// PAGE SEO - PUBLIC GET BY FRONTEND ROUTE
// ============================================================

const getPublicPageSeo = async (slug) => {
  let routePath = normalizeRoutePath(
    String(slug || "")
      .trim()
      .toLowerCase()
  );

  // Maintain existing Safety First alias.

  if (routePath === "/silica-first") {
    routePath = "/safety-first";
  }

  // ==========================================================
  // PRIMARY LOOKUP USING FRONTEND ROUTE
  // ==========================================================

  let record =
    await prisma.page_seo.findUnique({
      where: {
        route_path: routePath,
      },

      include: SEO_PAGE_INCLUDE,
    });

  // ==========================================================
  // LEGACY FALLBACK FOR CMS RECORDS WITHOUT ROUTE PATH
  // ==========================================================

  if (!record) {
    const resolvedSlug =
      resolvePageSlug(slug);

    record =
      await prisma.page_seo.findFirst({
        where: {
          route_path: null,

          pages: {
            is: {
              slug: resolvedSlug,

              status: "published",
            },
          },
        },

        include: SEO_PAGE_INCLUDE,
      });
  }

  if (!record) {
    return null;
  }

  // ==========================================================
  // CMS-MANAGED PAGES MUST BE PUBLISHED
  // ==========================================================

  if (
    record.page_id !== null &&
    record.pages?.status !== "published"
  ) {
    return null;
  }

  // Standalone pages do not require a pages table entry.

  return formatSeoRecord(record);
};

// ============================================================
// PAGE SEO - CREATE
// ============================================================

const createPageSeo = async (
  data,
  mode = "page"
) => {
  const seoMode = resolveSeoMode(mode);

  const seo = normalizeSeoPayload(data);

  let pageId = null;

  let pageName;

  let routePath;

  // ==========================================================
  // CREATE STANDALONE SEO RECORD
  // ==========================================================

  if (
    seoMode === "record" &&
    data.page_id == null
  ) {
    pageName = normalizePageName(
      data.page_name
    );

    routePath = normalizeRoutePath(
      data.route_path
    );

    // Prevent registering the old Safety First alias.

    if (routePath === "/silica-first") {
      throw httpError(
        400,
        "Use /safety-first as the frontend route"
      );
    }

    // Prevent a standalone SEO record from taking over
    // an existing CMS-managed page route.

    const existingPages =
      await prisma.pages.findMany({
        select: {
          id: true,
          slug: true,
        },
      });

    const conflictingPage =
      existingPages.find(
        (page) =>
          getCmsPageRoute(page.slug) ===
          routePath
      );

    if (conflictingPage) {
      throw httpError(
        409,
        "This route belongs to an existing CMS page"
      );
    }
  } else {
    // ========================================================
    // CREATE CMS-MANAGED SEO RECORD
    // ========================================================

    pageId = parsePageId(
      data.page_id
    );

    const page = await ensurePageExists(
      pageId
    );

    pageName = normalizePageName(
      page.title
    );

    routePath = getCmsPageRoute(
      page.slug
    );

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
  }

  // Legacy create requests must contain SEO metadata.
  // Record mode can register an empty SEO configuration.

  if (
    seoMode === "page" &&
    Object.keys(seo).length === 0
  ) {
    throw httpError(
      400,
      "No SEO fields provided"
    );
  }

  try {
    const record =
      await prisma.page_seo.create({
        data: {
          page_id: pageId,

          page_name: pageName,

          route_path: routePath,

          ...getDefaultSeoValues(),

          ...seo,
        },

        include: SEO_PAGE_INCLUDE,
      });

    if (seoMode === "record") {
      return formatSeoRecord(record);
    }

    // Preserve the original legacy response.

    const { pages, ...legacyRecord } =
      record;

    return legacyRecord;
  } catch (error) {
    if (error.code === "P2002") {
      throw httpError(
        409,
        "SEO already exists for this page or frontend route"
      );
    }

    throw error;
  }
};

// ============================================================
// PAGE SEO - UPDATE OR CREATE
// ============================================================

const updatePageSeo = async (
  id,
  data,
  mode = "page"
) => {
  const seoMode = resolveSeoMode(mode);

  const seo = normalizeSeoPayload(data);

  if (Object.keys(seo).length === 0) {
    throw httpError(
      400,
      "No SEO fields provided"
    );
  }

  // ==========================================================
  // CENTRALIZED SEO UPDATE
  // USES page_seo.id
  // SUPPORTS CMS AND STANDALONE RECORDS
  // ==========================================================

  if (seoMode === "record") {
    const seoId = parsePageId(id);

    await ensureSeoRecordExists(seoId);

    try {
      const record =
        await prisma.page_seo.update({
          where: {
            id: seoId,
          },

          data: {
            ...seo,

            updated_at: new Date(),
          },

          include: SEO_PAGE_INCLUDE,
        });

      return formatSeoRecord(record);
    } catch (error) {
      if (error.code === "P2025") {
        throw httpError(
          404,
          "Page SEO not found"
        );
      }

      throw error;
    }
  }

  // ==========================================================
  // LEGACY CMS PAGE SEO UPDATE
  // USES pages.id
  // ==========================================================

  const pageId = parsePageId(id);

  const page = await ensurePageExists(
    pageId
  );

  const pageName = normalizePageName(
    page.title
  );

  const routePath = getCmsPageRoute(
    page.slug
  );

  try {
    return await prisma.page_seo.upsert({
      where: {
        page_id: pageId,
      },

      create: {
        page_id: pageId,

        page_name: pageName,

        route_path: routePath,

        ...getDefaultSeoValues(),

        ...seo,
      },

      update: {
        page_name: pageName,

        route_path: routePath,

        ...seo,

        updated_at: new Date(),
      },
    });
  } catch (error) {
    if (error.code === "P2002") {
      throw httpError(
        409,
        "SEO route already exists"
      );
    }

    throw error;
  }
};

// ============================================================
// PAGE SEO - DELETE
// ============================================================

const deletePageSeo = async (
  id,
  mode = "page"
) => {
  const seoMode = resolveSeoMode(mode);

  const identifier = parsePageId(id);

  let where;

  // ==========================================================
  // DELETE USING SEO RECORD ID
  // ==========================================================

  if (seoMode === "record") {
    where = {
      id: identifier,
    };
  } else {
    // ========================================================
    // DELETE USING LEGACY CMS PAGE ID
    // ========================================================

    await ensurePageExists(identifier);

    where = {
      page_id: identifier,
    };
  }

  try {
    return await prisma.page_seo.delete({
      where,
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
