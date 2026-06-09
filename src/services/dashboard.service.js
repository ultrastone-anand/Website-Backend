// services/dashboard.service.js

const prisma = require('../config/prisma');

const serialize = (obj) =>
  JSON.parse(
    JSON.stringify(obj, (_, value) =>
      typeof value === 'bigint'
        ? value.toString()
        : value
    )
  );

const getAdminDashboard = async () => {
  const [
    totalUsers,
    totalProducts,
    totalCategories,
    recentActivities,
    products,
  ] = await Promise.all([
    prisma.users.count(),

    prisma.stone_products.count({
      where: {
        is_active: true,
      },
    }),

    prisma.stone_categories.count(),

    prisma.activity_logs.findMany({
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
    }),

    prisma.stone_products.findMany({
      where: {
        is_active: true,
      },

      include: {
        media: true,
      },
    }),
  ]);

const auditedProducts = products.map((product) => {
  const missingFields = [];

  // BASIC

  if (!product.small_description)
    missingFields.push('small_description');

  if (!product.long_description)
    missingFields.push('long_description');

  if (!product.pattern)
    missingFields.push('pattern');

  if (!product.stone_group)
    missingFields.push('stone_group');

  if (!product.origin_country)
    missingFields.push('origin_country');

  if (!product.pantone_colour)
    missingFields.push('pantone_colour');

  // ARRAYS

  if (!product.finishes_available?.length)
    missingFields.push('finishes_available');

  if (!product.thicknesses_cm?.length)
    missingFields.push('thicknesses_cm');

  if (!product.average_sizes_inches?.length)
    missingFields.push('average_sizes_inches');

  // MEDIA

  const hasCloseupImage = product.media.some(
    (x) => x.media_type === 'CLOSEUP_IMAGE'
  );

  if (!hasCloseupImage)
    missingFields.push('closeup_image');

  const hasSlabImage = product.media.some(
    (x) => x.media_type === 'SLAB_IMAGE'
  );

  if (!hasSlabImage)
    missingFields.push('slab_images');

  const hasVideo = product.media.some(
    (x) => x.media_type === 'FEATURED_VIDEO'
  );

  if (!hasVideo)
    missingFields.push('featured_video');

  const hasApplicationImage = product.media.some(
    (x) => x.media_type === 'APPLICATION_IMAGE'
  );

  if (!hasApplicationImage)
    missingFields.push('application_image');

  const hasBookmatchSlipmatch = product.media.some(
    (x) => x.media_type === 'BOOKMATCH_SLIPMATCH'
  );

  if (!hasBookmatchSlipmatch)
    missingFields.push('bookmatch_slipmatch');

  return {
    id: product.id,
    productId: product.product_id,
    name: product.name,
    slug: product.slug,
    missingCount: missingFields.length,
    missingFields,
  };
});

  const attentionRequiredProducts = auditedProducts
    .filter((x) => x.missingCount > 0)
    .sort((a, b) => b.missingCount - a.missingCount)
    .slice(0, 10);

  const missingReports = {
    missingFeaturedImages: auditedProducts.filter((p) =>
      p.missingFields.includes('closeup_image')
    ).length,

    missingGalleryImages: auditedProducts.filter((p) =>
      p.missingFields.includes('slab_images')
    ).length,

    missingVideos: auditedProducts.filter((p) =>
      p.missingFields.includes('featured_video')
    ).length,

    missingLongDescriptions: auditedProducts.filter((p) =>
      p.missingFields.includes('long_description')
    ).length,

    missingOriginCountry: auditedProducts.filter((p) =>
      p.missingFields.includes('origin_country')
    ).length,
  };

return serialize({
  summaryCards: {
    totalUsers,
    totalProducts,
    totalCategories,

    productsRequiringAttention:
      attentionRequiredProducts.length,
  },

  missingReports,

  attentionRequiredProducts,

  dailyActivities: recentActivities,
});
};

const getDesignerDashboard = async () => {
  const [
    totalProducts,
    totalMedia,
    recentMediaActivities,
  ] = await Promise.all([
    prisma.stone_products.count(),

    prisma.stone_product_media.count(),

    prisma.activity_logs.findMany({
      where: {
        module_name: 'Media',
      },
      take: 10,
      orderBy: {
        created_at: 'desc',
      },
    }),
  ]);

  const productsWithoutMedia =
    await prisma.stone_products.count({
      where: {
        media: {
          none: {},
        },
      },
    });

  return serialize({
    summaryCards: {
      totalProducts,
      totalMedia,
      productsWithoutMedia,
      productsWithMedia:
        totalProducts - productsWithoutMedia,
    },

    recentMediaActivities,
  });
};

const getSeoDashboard = async () => {
  const [
    totalProducts,
    missingMetaDescription,
    missingSeoTitle,
    categories,
  ] = await Promise.all([
    prisma.stone_products.count(),

    prisma.stone_categories.count({
      where: {
        OR: [
          {
            meta_description: null,
          },
          {
            meta_description: '',
          },
        ],
      },
    }),

    prisma.stone_categories.count({
      where: {
        OR: [
          {
            seo_title: null,
          },
          {
            seo_title: '',
          },
        ],
      },
    }),

    prisma.stone_categories.findMany(),
  ]);

  return serialize({
    summaryCards: {
      totalProducts,
      missingMetaDescription,
      missingSeoTitle,
      seoCompleted:
        categories.length -
        Math.max(
          missingMetaDescription,
          missingSeoTitle
        ),
    },

    seoStatus: categories.map((category) => ({
      category: category.name,
      hasSeoTitle: !!category.seo_title,
      hasMetaDescription:
        !!category.meta_description,
    })),
  });
};

const getBlogDashboard = async () => {
  return {
    message: 'Blog module not implemented yet',

    summaryCards: {
      totalBlogs: 0,
      publishedBlogs: 0,
      draftBlogs: 0,
    },
  };
};

module.exports = {
  getAdminDashboard,
  getDesignerDashboard,
  getSeoDashboard,
  getBlogDashboard,
};