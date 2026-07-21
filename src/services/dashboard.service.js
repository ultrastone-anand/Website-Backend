// services/dashboard.service.js

const prisma = require('../config/prisma');

const serialize = (obj) =>
  JSON.parse(
    JSON.stringify(
      obj,
      (_, value) =>
        typeof value === 'bigint'
          ? value.toString()
          : value
    )
  );

// ======================================================
// PRODUCT COMPLETENESS CONFIGURATION
// ======================================================

const REQUIRED_PRODUCT_FIELDS = [
  {
    key: 'small_description',
    label: 'Small Description',
    group: 'content',
    check: (product) =>
      Boolean(
        product.small_description?.trim()
      ),
  },
  {
    key: 'long_description',
    label: 'Long Description',
    group: 'content',
    check: (product) =>
      Boolean(
        product.long_description?.trim()
      ),
  },
  {
    key: 'pattern',
    label: 'Pattern',
    group: 'basic',
    check: (product) =>
      Boolean(product.pattern?.trim()),
  },
  {
    key: 'stone_group',
    label: 'Stone Group',
    group: 'basic',
    check: (product) =>
      Boolean(
        product.stone_group?.trim()
      ),
  },
  {
    key: 'origin_country',
    label: 'Origin Country',
    group: 'basic',
    check: (product) =>
      Boolean(
        product.origin_country?.trim()
      ),
  },
  {
    key: 'pantone_colour',
    label: 'Pantone Colour',
    group: 'basic',
    check: (product) =>
      Boolean(
        product.pantone_colour?.trim()
      ),
  },
  {
    key: 'finishes_available',
    label: 'Finishes Available',
    group: 'specifications',
    check: (product) =>
      Array.isArray(
        product.finishes_available
      ) &&
      product.finishes_available.length >
      0,
  },
  {
    key: 'thicknesses_cm',
    label: 'Thicknesses',
    group: 'specifications',
    check: (product) =>
      Array.isArray(
        product.thicknesses_cm
      ) &&
      product.thicknesses_cm.length >
      0,
  },
  {
    key: 'average_sizes_inches',
    label: 'Average Sizes',
    group: 'specifications',
    check: (product) =>
      Array.isArray(
        product.average_sizes_inches
      ) &&
      product.average_sizes_inches
        .length > 0,
  },
  {
    key: 'closeup_image',
    label: 'Close-up Image',
    group: 'media',
    check: (product) =>
      product.media.some(
        (media) =>
          media.media_type ===
          'CLOSEUP_IMAGE'
      ),
  },
  {
    key: 'slab_images',
    label: 'Slab Image',
    group: 'media',
    check: (product) =>
      product.media.some(
        (media) =>
          media.media_type ===
          'SLAB_IMAGE'
      ),
  },
  {
    key: 'featured_video',
    label: 'Featured Video',
    group: 'media',
    check: (product) =>
      product.media.some(
        (media) =>
          media.media_type ===
          'FEATURED_VIDEO'
      ),
  },
  {
    key: 'application_image',
    label: 'Application Image',
    group: 'media',
    check: (product) =>
      product.media.some(
        (media) =>
          media.media_type ===
          'APPLICATION_IMAGE'
      ),
  },
  {
    key: 'bookmatch_slipmatch',
    label: 'Bookmatch / Slipmatch',
    group: 'media',
    check: (product) =>
      product.media.some(
        (media) =>
          media.media_type ===
          'BOOKMATCH_SLIPMATCH'
      ),
  },
];

// ======================================================
// PRODUCT AUDIT
// ======================================================

const auditProduct = (product) => {
  const missingItems =
    REQUIRED_PRODUCT_FIELDS.filter(
      (field) =>
        !field.check(product)
    ).map((field) => ({
      key: field.key,
      label: field.label,
      group: field.group,
    }));

  const missingFields =
    missingItems.map(
      (item) => item.key
    );

  const missingFieldLabels =
    missingItems.map(
      (item) => item.label
    );

  const missingGroups =
    missingItems.reduce(
      (groups, item) => {
        if (!groups[item.group]) {
          groups[item.group] = [];
        }

        groups[item.group].push({
          key: item.key,
          label: item.label,
        });

        return groups;
      },
      {}
    );

  const totalRequiredFields =
    REQUIRED_PRODUCT_FIELDS.length;

  const completedFields =
    totalRequiredFields -
    missingItems.length;

  const completionPercentage =
    Math.round(
      (completedFields /
        totalRequiredFields) *
      100
    );

  let priority = 'low';

  if (
    missingItems.length >= 8
  ) {
    priority = 'high';
  } else if (
    missingItems.length >= 4
  ) {
    priority = 'medium';
  }

  return {
    id: product.id,

    productId:
      product.product_id,

    name:
      product.name,

    slug:
      product.slug,

    categoryId:
      product.category_id,

    categoryName:
      product.stone_categories
        ?.name || 'Uncategorized',

    categorySlug:
      product.stone_categories
        ?.slug || null,

    isPublished:
      Boolean(
        product.is_published
      ),

    createdAt:
      product.created_at,

    updatedAt:
      product.updated_at,

    missingCount:
      missingItems.length,

    completedCount:
      completedFields,

    totalRequiredFields,

    completionPercentage,

    priority,

    missingFields,

    missingFieldLabels,

    missingGroups,
  };
};

// ======================================================
// MISSING REPORTS
// ======================================================

const createMissingReports = (
  auditedProducts
) => {
  const countMissingField = (
    field
  ) =>
    auditedProducts.filter(
      (product) =>
        product.missingFields.includes(
          field
        )
    ).length;

  return {
    missingFeaturedImages:
      countMissingField(
        'closeup_image'
      ),

    missingGalleryImages:
      countMissingField(
        'slab_images'
      ),

    missingVideos:
      countMissingField(
        'featured_video'
      ),

    missingApplicationImages:
      countMissingField(
        'application_image'
      ),

    missingBookmatchSlipmatch:
      countMissingField(
        'bookmatch_slipmatch'
      ),

    missingSmallDescriptions:
      countMissingField(
        'small_description'
      ),

    missingLongDescriptions:
      countMissingField(
        'long_description'
      ),

    missingOriginCountry:
      countMissingField(
        'origin_country'
      ),

    missingPantoneColour:
      countMissingField(
        'pantone_colour'
      ),

    missingFinishes:
      countMissingField(
        'finishes_available'
      ),

    missingThicknesses:
      countMissingField(
        'thicknesses_cm'
      ),

    missingAverageSizes:
      countMissingField(
        'average_sizes_inches'
      ),
  };
};

// ======================================================
// CATEGORY REPORT
// ======================================================

const createCategoryAttentionReport = (
  auditedProducts
) => {
  const categoryMap =
    new Map();

  auditedProducts.forEach(
    (product) => {
      const key =
        product.categoryId ||
        'uncategorized';

      if (
        !categoryMap.has(key)
      ) {
        categoryMap.set(key, {
          categoryId:
            product.categoryId,

          categoryName:
            product.categoryName,

          categorySlug:
            product.categorySlug,

          totalProducts: 0,

          productsRequiringAttention:
            0,

          totalMissingFields: 0,
        });
      }

      const category =
        categoryMap.get(key);

      category.totalProducts += 1;

      if (
        product.missingCount > 0
      ) {
        category.productsRequiringAttention +=
          1;
      }

      category.totalMissingFields +=
        product.missingCount;
    }
  );

  return Array.from(
    categoryMap.values()
  )
    .map((category) => ({
      ...category,

      attentionPercentage:
        category.totalProducts > 0
          ? Math.round(
            (category.productsRequiringAttention /
              category.totalProducts) *
            100
          )
          : 0,
    }))
    .sort(
      (a, b) =>
        b.productsRequiringAttention -
        a.productsRequiringAttention
    );
};

// ======================================================
// COMMON PRODUCT QUERY
// ======================================================

const getDashboardProducts =
  async () =>
    prisma.stone_products.findMany({
      where: {
        is_active: true,
      },

      select: {
        id: true,
        product_id: true,
        category_id: true,

        name: true,
        slug: true,

        small_description: true,
        long_description: true,

        pattern: true,
        stone_group: true,
        origin_country: true,
        pantone_colour: true,

        finishes_available: true,
        thicknesses_cm: true,
        average_sizes_inches: true,

        is_published: true,

        created_at: true,
        updated_at: true,

        stone_categories: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },

        media: {
          select: {
            media_type: true,
          },
        },
      },
    });

// ======================================================
// COMMON DASHBOARD DATA
// ======================================================

const getCommonDashboardData =
  async ({
    includeActivities = false,
  } = {}) => {
    const [
      totalUsers,
      totalProducts,
      totalCategories,
      products,
      recentActivities,
    ] = await Promise.all([
      prisma.users.count({
        where: {
          is_active: true,
        },
      }),

      prisma.stone_products.count({
        where: {
          is_active: true,
        },
      }),

      prisma.stone_categories.count({
        where: {
          is_active: true,
        },
      }),

      getDashboardProducts(),

      includeActivities
        ? prisma.activity_logs.findMany({
          take: 5,

          orderBy: {
            created_at: 'desc',
          },

          select: {
            id: true,
            action: true,
            module_name: true,
            description: true,
            created_by_name: true,
            created_at: true,
          },
        })
        : Promise.resolve([]),
    ]);

    const auditedProducts =
      products.map(
        auditProduct
      );

    const incompleteProducts =
      auditedProducts
        .filter(
          (product) =>
            product.missingCount > 0
        )
        .sort((a, b) => {
          if (
            b.missingCount !==
            a.missingCount
          ) {
            return (
              b.missingCount -
              a.missingCount
            );
          }

          return (
            a.completionPercentage -
            b.completionPercentage
          );
        });

    const completeProducts =
      auditedProducts.filter(
        (product) =>
          product.missingCount === 0
      ).length;

    const attentionRequiredProducts = incompleteProducts;

    const averageCompletion =
      auditedProducts.length > 0
        ? Math.round(
          auditedProducts.reduce(
            (total, product) =>
              total +
              product.completionPercentage,
            0
          ) /
          auditedProducts.length
        )
        : 0;

    return {
      summaryCards: {
        totalUsers,
        totalProducts,
        totalCategories,

        // Total incomplete products,
        // not only the first ten.
        productsRequiringAttention:
          incompleteProducts.length,

        completeProducts,

        averageProductCompletion:
          averageCompletion,

        publishedProducts:
          auditedProducts.filter(
            (product) =>
              product.isPublished
          ).length,

        unpublishedProducts:
          auditedProducts.filter(
            (product) =>
              !product.isPublished
          ).length,
      },

      missingReports:
        createMissingReports(
          auditedProducts
        ),

      attentionRequiredProducts,

      categoryAttentionReport:
        createCategoryAttentionReport(
          auditedProducts
        ),

      dailyActivities:
        recentActivities,
    };
  };

// ======================================================
// ADMIN DASHBOARD
// ======================================================

const getAdminDashboard =
  async () => {
    const data =
      await getCommonDashboardData({
        includeActivities: true,
      });

    return serialize(data);
  };

// ======================================================
// DESIGNER DASHBOARD
// ======================================================

const getDesignerDashboard =
  async () => {
    const data =
      await getCommonDashboardData({
        includeActivities: false,
      });

    delete data.dailyActivities;

    return serialize(data);
  };

// ======================================================
// SEO DASHBOARD
// ======================================================

const getSeoDashboard =
  async () => {
    const data =
      await getCommonDashboardData({
        includeActivities: false,
      });

    delete data.dailyActivities;

    return serialize(data);
  };

// ======================================================
// BLOG DASHBOARD
// ======================================================

const getBlogDashboard =
  async () => {
    const data =
      await getCommonDashboardData({
        includeActivities: false,
      });

    delete data.dailyActivities;

    return serialize(data);
  };

module.exports = {
  getAdminDashboard,
  getDesignerDashboard,
  getSeoDashboard,
  getBlogDashboard,
};