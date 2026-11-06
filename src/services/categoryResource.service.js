
const prisma = require("../config/prisma");

const auditService = require("./audit.service");

const { serialize } = require("../utils/serialize");

// ============================================================
// HELPERS
// ============================================================

const httpError = (message, status = 400) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

const parseId = (value) => {
  try {
    const id = BigInt(value);

    if (id <= 0n) {
      throw new Error();
    }

    return id;
  } catch {
    throw httpError("Invalid resource ID");
  }
};

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

const parseDisplayOrder = (value) => {
  const order = Number(value);

  if (
    !Number.isSafeInteger(order) ||
    order < 0
  ) {
    throw httpError("Invalid display order");
  }

  return order;
};

const makeSlug = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const hasField = (body, field) =>
  Object.prototype.hasOwnProperty.call(
    body,
    field
  );

const normalizeText = (value) =>
  value === null || value === undefined
    ? null
    : String(value).trim() || null;

// ============================================================
// RESOURCE CATEGORY HELPERS
// ============================================================

const RESOURCE_CATEGORIES = [
  "CARE_MAINTENANCE",
  "WARRANTY",
  "FAQ",
  "SAFETY",
];

const parseResourceCategory = (value) => {
  const category = String(value || "")
    .trim()
    .toUpperCase();

  if (
    !RESOURCE_CATEGORIES.includes(category)
  ) {
    throw httpError(
      "Invalid resource category. Allowed values: CARE_MAINTENANCE, WARRANTY, FAQ, SAFETY"
    );
  }

  return category;
};

// ============================================================
// RESOURCE VALIDATION
// ============================================================

const validateResource = (data) => {
  if (!data.title) {
    throw httpError(
      "Resource title is required"
    );
  }

  if (!data.slug) {
    throw httpError(
      "Resource slug is required"
    );
  }

  if (
    !["PDF", "TEXT"].includes(
      data.resource_type
    )
  ) {
    throw httpError(
      "Resource type must be PDF or TEXT"
    );
  }

  if (
    !RESOURCE_CATEGORIES.includes(
      data.resource_category
    )
  ) {
    throw httpError(
      "Valid resource category is required"
    );
  }

  if (
    data.resource_type === "PDF" &&
    !data.file_url
  ) {
    throw httpError(
      "PDF file is required"
    );
  }

  if (
    data.resource_type === "TEXT" &&
    !data.content
  ) {
    throw httpError(
      "Text content is required"
    );
  }
};

// ============================================================
// GET ALL RESOURCES - ADMIN
// ============================================================

const getResources = async (query = {}) => {
  const where = {};

  // Filter by stone category
  if (
    query.category_id !== undefined &&
    query.category_id !== ""
  ) {
    where.category_id = parseCategoryId(
      query.category_id
    );
  }

  // Filter by resource format
  if (
    query.resource_type !== undefined &&
    query.resource_type !== ""
  ) {
    const type = String(
      query.resource_type
    ).toUpperCase();

    if (
      !["PDF", "TEXT"].includes(type)
    ) {
      throw httpError(
        "Invalid resource type"
      );
    }

    where.resource_type = type;
  }

  // Filter by document classification
  if (
    query.resource_category !== undefined &&
    query.resource_category !== ""
  ) {
    where.resource_category =
      parseResourceCategory(
        query.resource_category
      );
  }

  // Filter by active status
  if (
    query.is_active !== undefined &&
    query.is_active !== ""
  ) {
    where.is_active = parseBoolean(
      query.is_active
    );
  }

  const resources =
    await prisma.stone_category_resources.findMany({
      where,

      include: {
        stone_categories: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },

      orderBy: [
        { category_id: "asc" },
        { display_order: "asc" },
        { id: "asc" },
      ],
    });

  return serialize(resources);
};

// ============================================================
// GET ALL ACTIVE RESOURCES - PUBLIC
// ============================================================

const getPublicResources = async (
  query = {}
) => {
  const where = {
    is_active: true,

    stone_categories: {
      is: {
        is_active: true,
      },
    },
  };

  // Optional classification filter
  if (
    query.type !== undefined &&
    query.type !== ""
  ) {
    where.resource_category =
      parseResourceCategory(
        query.type
      );
  }

  const resources =
    await prisma.stone_category_resources.findMany({
      where,

      select: {
        id: true,
        category_id: true,

        title: true,
        slug: true,
        description: true,

        resource_type: true,
        resource_category: true,

        content: true,

        file_url: true,
        file_name: true,

        display_order: true,

        stone_categories: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },

      orderBy: [
        { category_id: "asc" },
        { display_order: "asc" },
        { id: "asc" },
      ],
    });

  return serialize(resources);
};

// ============================================================
// GET RESOURCES BY CATEGORY SLUG - PUBLIC
// ============================================================

const getResourcesByCategory = async (
  slug,
  query = {}
) => {
  const category =
    await prisma.stone_categories.findFirst({
      where: {
        slug,
        is_active: true,
      },

      select: {
        id: true,
        name: true,
        slug: true,
      },
    });

  if (!category) {
    throw httpError(
      "Category not found",
      404
    );
  }

  const where = {
    category_id: category.id,
    is_active: true,
  };

  // Optional classification filter
  if (
    query.type !== undefined &&
    query.type !== ""
  ) {
    where.resource_category =
      parseResourceCategory(
        query.type
      );
  }

  const resources =
    await prisma.stone_category_resources.findMany({
      where,

      select: {
        id: true,

        title: true,
        slug: true,
        description: true,

        resource_type: true,
        resource_category: true,

        content: true,

        file_url: true,
        file_name: true,

        display_order: true,
      },

      orderBy: [
        { display_order: "asc" },
        { id: "asc" },
      ],
    });

  return serialize({
    category,
    resources,
  });
};

// ============================================================
// GET RESOURCE BY ID - ADMIN
// ============================================================

const getResourceById = async (id) => {
  const resource =
    await prisma.stone_category_resources.findUnique({
      where: {
        id: parseId(id),
      },

      include: {
        stone_categories: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

  if (!resource) {
    throw httpError(
      "Resource not found",
      404
    );
  }

  return serialize(resource);
};

// ============================================================
// CREATE RESOURCE
// ============================================================

const createResource = async (
  body,
  uploadedFile = null,
  audit = {}
) => {
  const categoryId = parseCategoryId(
    body.category_id
  );

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

  const type = String(
    body.resource_type || ""
  )
    .trim()
    .toUpperCase();

  const title = normalizeText(
    body.title
  );

  const resourceCategory =
    parseResourceCategory(
      body.resource_category
    );

  const data = {
    category_id: categoryId,

    title,

    slug: makeSlug(
      body.slug || title
    ),

    description: normalizeText(
      body.description
    ),

    resource_type: type,

    resource_category:
      resourceCategory,

    content: normalizeText(
      body.content
    ),

    file_url:
      type === "PDF"
        ? uploadedFile?.secure_url || null
        : null,

    file_object_key:
      type === "PDF"
        ? uploadedFile?.public_id || null
        : null,

    file_name:
      type === "PDF"
        ? uploadedFile?.file_name || null
        : null,

    file_mime_type:
      type === "PDF"
        ? "application/pdf"
        : null,

    file_size:
      type === "PDF" &&
      uploadedFile?.file_size != null
        ? BigInt(
            uploadedFile.file_size
          )
        : null,

    display_order:
      body.display_order === undefined ||
      body.display_order === ""
        ? 0
        : parseDisplayOrder(
            body.display_order
          ),

    is_active:
      body.is_active === undefined
        ? true
        : parseBoolean(
            body.is_active
          ),
  };

  validateResource(data);

  const created =
    await auditService.track({
      audit,

      action: "CREATE",

      resourceType:
        "CATEGORY_RESOURCE",

      moduleName:
        "Stone Management",

      operation: () =>
        prisma.stone_category_resources.create({
          data,
        }),
    });

  return serialize(created);
};

// ============================================================
// UPDATE RESOURCE
// ============================================================

const updateResource = async (
  id,
  body,
  uploadedFile = null,
  audit = {}
) => {
  const resourceId = parseId(id);

  const existing =
    await prisma.stone_category_resources.findUnique({
      where: {
        id: resourceId,
      },
    });

  if (!existing) {
    throw httpError(
      "Resource not found",
      404
    );
  }

  const data = {};

  // Update stone category
  if (
    hasField(
      body,
      "category_id"
    )
  ) {
    const categoryId =
      parseCategoryId(
        body.category_id
      );

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

    data.category_id =
      categoryId;
  }

  // Update title
  if (
    hasField(
      body,
      "title"
    )
  ) {
    data.title = normalizeText(
      body.title
    );
  }

  // Update slug
  if (
    hasField(
      body,
      "slug"
    )
  ) {
    data.slug = makeSlug(
      body.slug
    );
  }

  // Update description
  if (
    hasField(
      body,
      "description"
    )
  ) {
    data.description =
      normalizeText(
        body.description
      );
  }

  // Update content
  if (
    hasField(
      body,
      "content"
    )
  ) {
    data.content =
      normalizeText(
        body.content
      );
  }

  // Update display order
  if (
    hasField(
      body,
      "display_order"
    )
  ) {
    data.display_order =
      parseDisplayOrder(
        body.display_order
      );
  }

  // Update active status
  if (
    hasField(
      body,
      "is_active"
    )
  ) {
    data.is_active =
      parseBoolean(
        body.is_active
      );
  }

  // Update resource format
  if (
    hasField(
      body,
      "resource_type"
    )
  ) {
    data.resource_type =
      String(
        body.resource_type
      )
        .trim()
        .toUpperCase();
  }

  // Update document classification
  if (
    hasField(
      body,
      "resource_category"
    )
  ) {
    data.resource_category =
      parseResourceCategory(
        body.resource_category
      );
  }

  const finalType =
    data.resource_type ||
    existing.resource_type;

  if (
    !["PDF", "TEXT"].includes(
      finalType
    )
  ) {
    throw httpError(
      "Invalid resource type"
    );
  }

  if (
    uploadedFile &&
    finalType !== "PDF"
  ) {
    throw httpError(
      "PDF upload is only allowed for PDF resources"
    );
  }

  // Clear PDF fields for TEXT resources
  if (
    finalType === "TEXT"
  ) {
    data.file_url = null;
    data.file_object_key = null;
    data.file_name = null;
    data.file_mime_type = null;
    data.file_size = null;
  }

  // Replace PDF if a new file is uploaded
  else if (uploadedFile) {
    data.file_url =
      uploadedFile.secure_url;

    data.file_object_key =
      uploadedFile.public_id;

    data.file_name =
      uploadedFile.file_name;

    data.file_mime_type =
      "application/pdf";

    data.file_size =
      uploadedFile.file_size != null
        ? BigInt(
            uploadedFile.file_size
          )
        : null;
  }

  const finalData = {
    ...existing,
    ...data,
  };

  validateResource(finalData);

  const updated =
    await auditService.track({
      audit,

      action: "UPDATE",

      resourceType:
        "CATEGORY_RESOURCE",

      resourceId:
        existing.id,

      moduleName:
        "Stone Management",

      oldValues:
        serialize(existing),

      operation: () =>
        prisma.stone_category_resources.update({
          where: {
            id: resourceId,
          },

          data: {
            ...data,
            updated_at:
              new Date(),
          },
        }),
    });

  return {
    resource:
      serialize(updated),

    previousFileKey:
      existing.file_object_key ||
      null,

    currentFileKey:
      updated.file_object_key ||
      null,
  };
};

// ============================================================
// UPDATE RESOURCE STATUS
// ============================================================

const updateResourceStatus = async (
  id,
  isActive,
  audit = {}
) => {
  const resourceId = parseId(id);

  const existing =
    await prisma.stone_category_resources.findUnique({
      where: {
        id: resourceId,
      },
    });

  if (!existing) {
    throw httpError(
      "Resource not found",
      404
    );
  }

  const updated =
    await auditService.track({
      audit,

      action: "UPDATE",

      resourceType:
        "CATEGORY_RESOURCE",

      resourceId:
        existing.id,

      moduleName:
        "Stone Management",

      oldValues:
        serialize(existing),

      operation: () =>
        prisma.stone_category_resources.update({
          where: {
            id: resourceId,
          },

          data: {
            is_active:
              parseBoolean(
                isActive
              ),

            updated_at:
              new Date(),
          },
        }),
    });

  return serialize(updated);
};

// ============================================================
// DELETE RESOURCE
// ============================================================

const deleteResource = async (
  id,
  audit = {}
) => {
  const resourceId = parseId(id);

  const existing =
    await prisma.stone_category_resources.findUnique({
      where: {
        id: resourceId,
      },
    });

  if (!existing) {
    throw httpError(
      "Resource not found",
      404
    );
  }

  const deleted =
    await auditService.track({
      audit,

      action: "DELETE",

      resourceType:
        "CATEGORY_RESOURCE",

      resourceId:
        existing.id,

      moduleName:
        "Stone Management",

      oldValues:
        serialize(existing),

      operation: () =>
        prisma.stone_category_resources.delete({
          where: {
            id: resourceId,
          },
        }),
    });

  return {
    resource:
      serialize(deleted),

    fileKey:
      existing.file_object_key ||
      null,
  };
};

// ============================================================
// EXPORTS
// ============================================================

module.exports = {
  getResources,
  getPublicResources,
  getResourcesByCategory,
  getResourceById,
  createResource,
  updateResource,
  updateResourceStatus,
  deleteResource,
};
