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

  // dailyActivities: recentActivities,
});
};

const getSeoDashboard = async () => {
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

  // dailyActivities: recentActivities,
});
};

const getBlogDashboard = async () => {
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

  // dailyActivities: recentActivities,
});
};

module.exports = {
  getAdminDashboard,
  getDesignerDashboard,
  getSeoDashboard,
  getBlogDashboard,
};