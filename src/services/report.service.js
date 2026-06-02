const prisma = require("../config/prisma");

// ================== PRODUCT AUDIT REPORT ==================

const getProductAuditReport = async (slug) => {
  // CATEGORY

  const category = await prisma.stone_categories.findFirst({
    where: {
      slug,
    },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  // PRODUCTS

  const products = await prisma.stone_products.findMany({
    where: {
      category_id: category.id,

      is_active: true,
    },

    include: {
      media: true,
    },
  });

  const auditProducts = products.map((product) => {
    const missingFields = [];

    // ==================
    // BASIC
    // ==================

    if (!product.name) {
      missingFields.push("name");
    }

    if (!product.small_description) {
      missingFields.push("small_description");
    }

    if (!product.long_description) {
      missingFields.push("long_description");
    }

    if (!product.pattern) {
      missingFields.push("pattern");
    }

    if (!product.stone_group) {
      missingFields.push("stone_group");
    }

    if (!product.origin_country) {
      missingFields.push("origin_country");
    }

    if (!product.pantone_colour) {
      missingFields.push("pantone_colour");
    }

    // ==================
    // ARRAYS
    // ==================

    if (!product.finishes_available?.length) {
      missingFields.push("finishes_available");
    }

    if (!product.thicknesses_cm?.length) {
      missingFields.push("thicknesses_cm");
    }

    if (!product.average_sizes_inches?.length) {
      missingFields.push("average_sizes_inches");
    }

    // ==================
    // MEDIA
    // ==================

    const hasFeaturedImage = product.media.some(
      (item) => item.media_type === "FEATURED_IMAGE",
    );

    if (!hasFeaturedImage) {
      missingFields.push("featured_image");
    }

    const hasGalleryImage = product.media.some(
      (item) => item.media_type === "GALLERY_IMAGE",
    );

    if (!hasGalleryImage) {
      missingFields.push("gallery_images");
    }

    const hasVideo = product.media.some(
      (item) => item.media_type === "FEATURED_VIDEO",
    );

    if (!hasVideo) {
      missingFields.push("featured_video");
    }

    // ==================
    // COMPLETION %
    // ==================

    const totalChecks = 13;

    const completedChecks = totalChecks - missingFields.length;

    const completionPercentage = Math.round(
      (completedChecks / totalChecks) * 100,
    );

    return {
      product_id: product.product_id,

      name: product.name,

      slug: product.slug,

      completion_percentage: completionPercentage,

      missing_fields: missingFields,
    };
  });

  // ==================
  // SUMMARY
  // ==================

  const summary = {
    total_products: products.length,

    complete_products: auditProducts.filter(
      (p) => p.missing_fields.length === 0,
    ).length,

    incomplete_products: auditProducts.filter(
      (p) => p.missing_fields.length > 0,
    ).length,

    missing_featured_images: auditProducts.filter((p) =>
      p.missing_fields.includes("featured_image"),
    ).length,

    missing_gallery_images: auditProducts.filter((p) =>
      p.missing_fields.includes("gallery_images"),
    ).length,

    missing_videos: auditProducts.filter((p) =>
      p.missing_fields.includes("featured_video"),
    ).length,

    missing_long_descriptions: auditProducts.filter((p) =>
      p.missing_fields.includes("long_description"),
    ).length,

    missing_origin_country: auditProducts.filter((p) =>
      p.missing_fields.includes("origin_country"),
    ).length,
  };

  return {
    category: {
      id: category.id,

      name: category.name,

      slug: category.slug,
    },

    summary,

    products: auditProducts,
  };
};

const getCategoryProductReport = async (slug) => {
  const category = await prisma.stone_categories.findFirst({
    where: {
      slug,
    },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  const products = await prisma.stone_products.findMany({
    where: {
      category_id: category.id,

      is_active: true,
    },

    include: {
      media: {
        select: {
          media_type: true,

          media_url: true,
        },
      },
    },

    orderBy: {
      name: "asc",
    },
  });

  return {
    category: {
      id: category.id,

      name: category.name,

      slug: category.slug,
    },

    total_products: products.length,

    products: products.map((product) => ({
      product_id: product.product_id,

      name: product.name,

      slug: product.slug,

      stone_group: product.stone_group,

      pattern: product.pattern,

      origin_country: product.origin_country,

      variation_level: product.variation_level,

      finishes_available: product.finishes_available,

      thicknesses_cm: product.thicknesses_cm,

      average_sizes_inches: product.average_sizes_inches,

      translucent: product.translucent,

      cut_to_size: product.cut_to_size,

      is_featured: product.is_featured,

      is_trending: product.is_trending,

      is_new_arrival: product.is_new_arrival,

      is_active: product.is_active,

      created_at: product.created_at,

      media_count: product.media.length,

      featured_images: product.media.filter(
        (m) => m.media_type === "FEATURED_IMAGE",
      ).length,

      gallery_images: product.media.filter(
        (m) => m.media_type === "GALLERY_IMAGE",
      ).length,

      videos: product.media.filter((m) => m.media_type === "FEATURED_VIDEO")
        .length,
    })),
  };
};

const getCategoryProductsReport = async (slug) => {
  // FIND CATEGORY

  const category = await prisma.stone_categories.findFirst({
    where: {
      slug,

      is_active: true,
    },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  // GET PRODUCTS

  const products = await prisma.stone_products.findMany({
    where: {
      category_id: category.id,

      is_active: true,
    },

    include: {
      media: {
        orderBy: {
          display_order: "asc",
        },
      },
    },

    orderBy: {
      name: "asc",
    },
  });

  const reportData = products.map((product) => {
    const featuredImages = product.media.filter(
      (m) => m.media_type === "FEATURED_IMAGE",
    );

    const galleryImages = product.media.filter(
      (m) => m.media_type === "GALLERY_IMAGE",
    );

    const videos = product.media.filter(
      (m) => m.media_type === "FEATURED_VIDEO",
    );

    return {
      product_id: product.product_id,

      name: product.name,

      slug: product.slug,

      small_description: product.small_description,

      long_description: product.long_description,

      stone_group: product.stone_group,

      pattern: product.pattern,

      origin_country: product.origin_country,

      variation_level: product.variation_level,

      finishes_available: product.finishes_available,

      thicknesses_cm: product.thicknesses_cm,

      average_sizes_inches: product.average_sizes_inches,

      pantone_colour: product.pantone_colour,

      translucent: product.translucent,

      cut_to_size: product.cut_to_size,

      countertops_vanities: product.countertops_vanities,

      interior_floor: product.interior_floor,

      shower_wall: product.shower_wall,

      shower_floor: product.shower_floor,

      exterior_floor: product.exterior_floor,

      exterior_wall: product.exterior_wall,

      pool_fountain: product.pool_fountain,

      fireplace: product.fireplace,

      furniture_top: product.furniture_top,

      abrasion_resistance: product.abrasion_resistance,

      stain_resistance: product.stain_resistance,

      etching_resistance: product.etching_resistance,

      heat_resistance: product.heat_resistance,

      uv_resistance: product.uv_resistance,

      color_range: product.color_range,

      movement_index: product.movement_index,

      is_featured: product.is_featured,

      is_new_arrival: product.is_new_arrival,

      is_trending: product.is_trending,

      featured_image_count: featuredImages.length,

      gallery_image_count: galleryImages.length,

      video_count: videos.length,

      featured_images: featuredImages.map((x) => x.media_url),

      gallery_images: galleryImages.map((x) => x.media_url),

      videos: videos.map((x) => x.media_url),

      created_at: product.created_at,

      updated_at: product.updated_at,
    };
  });

  return {
    category: {
      id: category.id,

      name: category.name,

      slug: category.slug,
    },

    total_products: reportData.length,

    products: reportData,
  };
};

module.exports = {
  getProductAuditReport,

  getCategoryProductReport,

  getCategoryProductsReport,
};
