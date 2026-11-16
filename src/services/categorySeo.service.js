
const prisma = require("../config/prisma");

const auditService = require("./audit.service");

const { serialize } = require("../utils/serialize");

// ============================================
// CONSTANTS
// ============================================

const SEO_FIELDS = [
  "seo_title",
  "meta_description",
  "meta_keywords",
  "canonical_url",
  "og_title",
  "og_description",
  "og_image",
  "robots_index",
  "robots_follow",
  "schema_markup",
  "seo_content",
];

const TEXT_LIMITS = {
  seo_title: 255,
  og_title: 255,
};

const DEFAULT_SITE_URL =
  "https://www.ultrastones.com";

// ============================================
// HELPERS
// ============================================

const httpError = (message, status = 400) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

const hasField = (body, field) =>
  Object.prototype.hasOwnProperty.call(
    body,
    field
  );

const parseCategoryId = (value) => {
  const id = Number(value);

  if (
    !Number.isSafeInteger(id) ||
    id <= 0
  ) {
    throw httpError("Invalid category ID");
  }

  return id;
};

const parseBoolean = (value) => {
  if (value === true || value === "true") {
    return true;
  }

  if (value === false || value === "false") {
    return false;
  }

  throw httpError("Invalid boolean value");
};

const normalizeText = (value, field) => {
  if (value === null || value === "") {
    return null;
  }

  if (typeof value !== "string") {
    throw httpError(
      `${field} must be a string`
    );
  }

  const text = value.trim();

  if (!text) {
    return null;
  }

  const limit = TEXT_LIMITS[field];

  if (limit && text.length > limit) {
    throw httpError(
      `${field} cannot exceed ${limit} characters`
    );
  }

  return text;
};

const parseUrl = (value, field) => {
  const text = normalizeText(value, field);

  if (!text) {
    return null;
  }

  let url;

  try {
    url = new URL(text);
  } catch {
    throw httpError(
      `${field} must be a valid URL`
    );
  }

  if (
    !["http:", "https:"].includes(
      url.protocol
    ) ||
    url.username ||
    url.password
  ) {
    throw httpError(
      `${field} must be a valid HTTP or HTTPS URL`
    );
  }

  return url.toString();
};

const parseSchemaMarkup = (value) => {
  if (
    value === null ||
    value === ""
  ) {
    return null;
  }

  let parsed = value;

  if (typeof value === "string") {
    try {
      parsed = JSON.parse(value);
    } catch {
      throw httpError(
        "schema_markup must contain valid JSON"
      );
    }
  }

  if (
    !parsed ||
    typeof parsed !== "object" ||
    Array.isArray(parsed)
  ) {
    throw httpError(
      "schema_markup must be a JSON object"
    );
  }

  return parsed;
};

// ============================================
// SEO DATA BUILDER
// ============================================

const buildSeoData = (body = {}) => {
  if (
    !body ||
    typeof body !== "object" ||
    Array.isArray(body)
  ) {
    throw httpError(
      "Request body must be an object"
    );
  }

  const data = {};

  for (const field of SEO_FIELDS) {
    if (!hasField(body, field)) {
      continue;
    }

    const value = body[field];

    if (
      field === "robots_index" ||
      field === "robots_follow"
    ) {
      data[field] = parseBoolean(value);
      continue;
    }

    if (field === "schema_markup") {
      data[field] = parseSchemaMarkup(value);
      continue;
    }

    if (
      field === "canonical_url" ||
      field === "og_image"
    ) {
      data[field] = parseUrl(
        value,
        field
      );
      continue;
    }

    data[field] = normalizeText(
      value,
      field
    );
  }

  if (!Object.keys(data).length) {
    throw httpError(
      "No valid SEO fields provided"
    );
  }

  return data;
};

// ============================================
// CATEGORY LOOKUP
// ============================================

const findCategory = async (id) => {
  const categoryId = parseCategoryId(id);

  const category =
    await prisma.stone_categories.findUnique({
      where: {
        id: categoryId,
      },
    });

  if (!category) {
    throw httpError(
      "Category not found",
      404
    );
  }

  return category;
};

// ============================================
// SEO RESPONSE BUILDER
// ============================================

const formatCategorySeo = (category) => {
  const siteUrl = DEFAULT_SITE_URL;

  const defaultCanonical =
    `${siteUrl}/product-category/${encodeURIComponent(
      category.slug
    )}`;

  return {
    category_id: category.id,
    category_name: category.name,
    category_slug: category.slug,
    category_description: category.description,
    is_active: category.is_active,

    seo: {
      seo_title:
        category.seo_title,

      meta_description:
        category.meta_description,

      meta_keywords:
        category.meta_keywords,

      canonical_url:
        category.canonical_url,

      og_title:
        category.og_title,

      og_description:
        category.og_description,

      og_image:
        category.og_image,

      robots_index:
        category.robots_index,

      robots_follow:
        category.robots_follow,

      schema_markup:
        category.schema_markup,

      seo_content:
        category.seo_content,
    },

    defaults: {
      canonical_url: defaultCanonical,
      og_image:
        category.banner_url ||
        category.thumbnail_url ||
        null,
    },

    created_at: category.created_at,
    updated_at: category.updated_at,
  };
};

// ============================================
// GET ALL - ADMIN
// ============================================

const getAllCategorySeo = async (
  query = {}
) => {
  const where = {};

  if (
    query.is_active !== undefined &&
    query.is_active !== ""
  ) {
    where.is_active = parseBoolean(
      query.is_active
    );
  }

  if (
    query.search !== undefined &&
    String(query.search).trim()
  ) {
    const search = String(
      query.search
    ).trim();

    where.OR = [
      {
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        slug: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        seo_title: {
          contains: search,
          mode: "insensitive",
        },
      },
    ];
  }

  const categories =
    await prisma.stone_categories.findMany({
      where,

      orderBy: [
        {
          display_order: "asc",
        },
        {
          name: "asc",
        },
      ],
    });

  return serialize(
    categories.map(formatCategorySeo)
  );
};

// ============================================
// GET BY CATEGORY ID - ADMIN
// ============================================

const getCategorySeoById = async (id) => {
  const category = await findCategory(id);

  return serialize(
    formatCategorySeo(category)
  );
};

// ============================================
// PUBLIC GET BY SLUG
// ============================================

const getPublicCategorySeo = async (
  slug
) => {
  const categorySlug = String(
    slug || ""
  ).trim();

  if (!categorySlug) {
    throw httpError(
      "Category slug is required"
    );
  }

  const category =
    await prisma.stone_categories.findFirst({
      where: {
        slug: categorySlug,
        is_active: true,
      },
    });

  if (!category) {
    throw httpError(
      "Category not found",
      404
    );
  }

  const formatted =
    formatCategorySeo(category);

  const seo = formatted.seo;

  const result = {
    category_id: category.id,
    category_name: category.name,
    category_slug: category.slug,

    title:
      seo.seo_title ||
      `${category.name} | Ultra Stones`,

    description:
      seo.meta_description ||
      category.description ||
      null,

    canonical_url:
      seo.canonical_url ||
      formatted.defaults.canonical_url,

    og_title:
      seo.og_title ||
      seo.seo_title ||
      `${category.name} | Ultra Stones`,

    og_description:
      seo.og_description ||
      seo.meta_description ||
      category.description ||
      null,

    og_image:
      seo.og_image ||
      formatted.defaults.og_image,

    robots_index:
      seo.robots_index,

    robots_follow:
      seo.robots_follow,

    schema_markup:
      seo.schema_markup,

    seo_content:
      seo.seo_content,
  };

  return serialize(result);
};

// ============================================
// CREATE / SAVE SEO
// ============================================

const createCategorySeo = async (
  id,
  body,
  audit = {}
) => {
  const category = await findCategory(id);

  const data = buildSeoData(body);

  const updated = await auditService.track({
    audit,

    action: "CREATE",

    resourceType: "CATEGORY_SEO",

    resourceId: category.id,

    moduleName: "Stone Management",

    oldValues: serialize(
      formatCategorySeo(category).seo
    ),

    operation: () =>
      prisma.stone_categories.update({
        where: {
          id: category.id,
        },

        data: {
          ...data,
          updated_at: new Date(),
        },
      }),
  });

  return serialize(
    formatCategorySeo(updated)
  );
};

// ============================================
// UPDATE SEO
// ============================================

const updateCategorySeo = async (
  id,
  body,
  audit = {}
) => {
  const category = await findCategory(id);

  const data = buildSeoData(body);

  const updated = await auditService.track({
    audit,

    action: "UPDATE",

    resourceType: "CATEGORY_SEO",

    resourceId: category.id,

    moduleName: "Stone Management",

    oldValues: serialize(
      formatCategorySeo(category).seo
    ),

    operation: () =>
      prisma.stone_categories.update({
        where: {
          id: category.id,
        },

        data: {
          ...data,
          updated_at: new Date(),
        },
      }),
  });

  return serialize(
    formatCategorySeo(updated)
  );
};

// ============================================
// DELETE / CLEAR SEO
// ============================================

const deleteCategorySeo = async (
  id,
  audit = {}
) => {
  const category = await findCategory(id);

  const clearedSeo = {
    seo_title: null,
    meta_description: null,
    meta_keywords: null,
    canonical_url: null,
    og_title: null,
    og_description: null,
    og_image: null,
    robots_index: true,
    robots_follow: true,
    schema_markup: null,
    seo_content: null,
  };

  const updated = await auditService.track({
    audit,

    action: "DELETE",

    resourceType: "CATEGORY_SEO",

    resourceId: category.id,

    moduleName: "Stone Management",

    oldValues: serialize(
      formatCategorySeo(category).seo
    ),

    operation: () =>
      prisma.stone_categories.update({
        where: {
          id: category.id,
        },

        data: {
          ...clearedSeo,
          updated_at: new Date(),
        },
      }),
  });

  return serialize(
    formatCategorySeo(updated)
  );
};

// ============================================
// EXPORTS
// ============================================

module.exports = {
  getAllCategorySeo,
  getCategorySeoById,
  getPublicCategorySeo,
  createCategorySeo,
  updateCategorySeo,
  deleteCategorySeo,
};
