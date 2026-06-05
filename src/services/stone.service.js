const prisma = require("../config/prisma");
const { uploadToCloudinary } = require("../utils/uploadToCloudinary");

const getStones = async () => {
  return await prisma.stone_categories.findMany({
    orderBy: {
      display_order: "asc",
    },
  });
};

const getCategoryProducts = async (slug) => {

  // FIND CATEGORY

  const category =
    await prisma.stone_categories.findFirst({
      where: {
        slug,
        is_active: true,
      },
    });

  if (!category) {
    throw new Error("Category not found");
  }

  // PRODUCTS

  const products =
    await prisma.stone_products.findMany({

      where: {
        category_id: category.id,
        is_active: true,
      },

      orderBy: {
        created_at: "desc",
      },

      select: {

        id: true,

        product_id: true,

        name: true,

        slug: true,

        small_description: true,

        stone_group: true,

        pattern: true,

        origin_country: true,

        variation_level: true,

        is_featured: true,

        is_trending: true,

        is_new_arrival: true,

        created_at: true,

        media: {

          where: {
            media_type: "CLOSEUP_IMAGE",
          },

          take: 1,

          select: {
            media_url: true,
          },
        },
      },
    });

  // FORMAT FEATURE IMAGE

  const formattedProducts =
    products.map((product) => ({

      ...product,

      closeup_image:
        product.media?.[0]?.media_url || null,

    }));

  // SERIALIZE BIGINT

  const serializedProducts =
    JSON.parse(
      JSON.stringify(
        formattedProducts,
        (_, value) =>
          typeof value === "bigint"
            ? value.toString()
            : value
      )
    );

  return {
    category,
    products: serializedProducts,
  };
};
const getProductDetails = async (slug) => {
  const product = await prisma.stone_products.findFirst({
    where: {
      slug,
      is_active: true,
    },

    select: {
      // BASIC

      id: true,
      product_id: true,

      name: true,
      slug: true,

      small_description: true,
      long_description: true,

      category_id: true,

      // DETAILS

      finishes_available: true,

      pattern: true,

      thicknesses_cm: true,

      average_sizes_inches: true,

      stone_group: true,

      translucent: true,

      cut_to_size: true,

      origin_country: true,

      pantone_colour: true,

      // APPLICATIONS

      color_enhancing: true,

      countertops_vanities: true,

      interior_floor: true,

      shower_wall: true,

      shower_floor: true,

      exterior_floor: true,

      exterior_wall: true,

      pool_fountain: true,

      fireplace: true,

      furniture_top: true,

      // SPECIFICATIONS

      abrasion_resistance: true,

      stain_resistance: true,

      etching_resistance: true,

      heat_resistance: true,

      uv_resistance: true,

      color_range: true,

      movement_index: true,

      // VARIATION

      variation_level: true,

      // FLAGS

      is_featured: true,

      is_new_arrival: true,

      is_trending: true,

      is_active: true,

      // DATES

      created_at: true,
      updated_at: true,

      // CATEGORY

      stone_categories: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },

      // MEDIA

      media: {
        orderBy: {
          display_order: "asc",
        },

        select: {
          id: true,
          media_type: true,
          media_url: true,
          public_id: true,
          display_order: true,
        },
      },
    },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  // Separate media types

  const closeup_images = product.media
    .filter((item) => item.media_type === "closeup_image")
    .map((item) => item.media_url);

  const slab_images = product.media
    .filter((item) => item.media_type === "slab_image")
    .map((item) => item.media_url);

  const featured_videos = product.media
    .filter((item) => item.media_type === "featured_video")
    .map((item) => item.media_url);

  return {
    ...product,

    id: Number(product.id),

    category_id: Number(product.category_id),

    media: product.media.map((item) => ({
      ...item,
      id: Number(item.id),
    })),

    closeup_images,
    slab_images,
    featured_videos,
  };
};

// ================ CRUD ================

const createCategory = async (body) => {
  return await prisma.stone_categories.create({
    data: {
      name: body.name,

      slug: body.slug,

      description: body.description,

      parent_id: body.parent_id || null,

      thumbnail_url: body.thumbnail_url,

      banner_url: body.banner_url,

      display_order: body.display_order || 1,

      is_active: true,
    },
  });
};

const updateCategory = async (id, body) => {
  const updateData = {
    ...body,
  };

  // Only handle parent_id if it exists

  if ("parent_id" in updateData) {
    updateData.parent_id =
      updateData.parent_id === "" || updateData.parent_id === null
        ? null
        : Number(updateData.parent_id);
  }

  return await prisma.stone_categories.update({
    where: {
      id: Number(id),
    },

    data: updateData,
  });
};

const serializeBigInt = (data) => {
  return JSON.parse(
    JSON.stringify(
      data,
      (_, value) =>
        typeof value === "bigint"
          ? value.toString()
          : value
    )
  );
};

const createProduct = async (body, files) => {

  const toBool = (value) =>
    value === true || value === "true";

  const parseArray = (value) => {
    try {
      if (!value) return [];
      if (Array.isArray(value)) return value;
      return JSON.parse(value);
    } catch {
      return [];
    }
  };

  // ==============================
  // UPLOAD FILES
  // ==============================

  const uploadFiles = async (
    fileArray,
    folder,
    resourceType = "image"
  ) => {

    if (
      !fileArray ||
      fileArray.length === 0
    ) {
      return [];
    }

    return Promise.all(
      fileArray.map(async (file) => {

        const uploaded =
          await uploadToCloudinary(
            file.path,
            folder,
            resourceType
          );

        return uploaded.secure_url;

      })
    );
  };

  const featuredImages =
    await uploadFiles(
      files?.closeup_images,
      "ultrastones/products/featured"
    );

  const galleryImages =
    await uploadFiles(
      files?.slab_images,
      "ultrastones/products/gallery"
    );

  const featuredVideos =
    await uploadFiles(
      files?.featured_videos,
      "ultrastones/products/videos",
      "video"
    );

  const applicationImages =
    await uploadFiles(
      files?.application_images,
      "ultrastones/products/application"
    );

  const bookmatchSlipmatchImages =
    await uploadFiles(
      files?.bookmatch_slipmatch,
      "ultrastones/products/bookmatch-slipmatch"
    );

  // ==============================
  // CREATE PRODUCT
  // ==============================

  const createdProduct =
    await prisma.stone_products.create({

      data: {

        // BASIC

        name: body.name,

        slug: body.slug,

        small_description:
          body.small_description,

        long_description:
          body.long_description,

        category_id:
          body.category_id
            ? Number(body.category_id)
            : null,

        // DETAILS

        finishes_available:
          parseArray(
            body.finishes_available
          ),

        pattern:
          body.pattern,

        thicknesses_cm:
          parseArray(
            body.thicknesses_cm
          ),

        average_sizes_inches:
          parseArray(
            body.average_sizes_inches
          ),

        stone_group:
          body.stone_group,

        translucent:
          toBool(
            body.translucent
          ),

        cut_to_size:
          toBool(
            body.cut_to_size
          ),

        origin_country:
          body.origin_country,

        pantone_colour:
          body.pantone_colour,

        // APPLICATIONS

        color_enhancing:
          toBool(
            body.color_enhancing
          ),

        countertops_vanities:
          toBool(
            body.countertops_vanities
          ),

        interior_floor:
          toBool(
            body.interior_floor
          ),

        shower_wall:
          toBool(
            body.shower_wall
          ),

        shower_floor:
          toBool(
            body.shower_floor
          ),

        exterior_floor:
          toBool(
            body.exterior_floor
          ),

        exterior_wall:
          toBool(
            body.exterior_wall
          ),

        pool_fountain:
          toBool(
            body.pool_fountain
          ),

        fireplace:
          toBool(
            body.fireplace
          ),

        furniture_top:
          toBool(
            body.furniture_top
          ),

        // SPECIFICATIONS

        abrasion_resistance:
          body.abrasion_resistance,

        stain_resistance:
          body.stain_resistance,

        etching_resistance:
          body.etching_resistance,

        heat_resistance:
          body.heat_resistance,

        uv_resistance:
          body.uv_resistance,

        color_range:
          body.color_range,

        movement_index:
          body.movement_index,

        // VARIATION

        variation_level:
          body.variation_level,

        // FLAGS

        is_featured:
          toBool(
            body.is_featured
          ),

        is_trending:
          toBool(
            body.is_trending
          ),

        is_new_arrival:
          toBool(
            body.is_new_arrival
          ),

        is_active: true,

        // ==============================
        // MEDIA
        // ==============================

        media: {

          create: [

            ...featuredImages.map(
              (url, index) => ({
                media_type:
                  "CLOSEUP_IMAGE",
                media_url: url,
                display_order:
                  index,
              })
            ),

            ...galleryImages.map(
              (url, index) => ({
                media_type:
                  "SLAB_IMAGE",
                media_url: url,
                display_order:
                  index,
              })
            ),

            ...featuredVideos.map(
              (url, index) => ({
                media_type:
                  "FEATURED_VIDEO",
                media_url: url,
                display_order:
                  index,
              })
            ),

            ...applicationImages.map(
              (url, index) => ({
                media_type:
                  "APPLICATION_IMAGE",
                media_url: url,
                display_order:
                  index,
              })
            ),

            ...bookmatchSlipmatchImages.map(
              (url, index) => ({
                media_type:
                  "BOOKMATCH_SLIPMATCH",
                media_url: url,
                display_order:
                  index,
              })
            ),

          ],

        },

      },

      include: {
        media: true,
      },

    });

  return serializeBigInt(
    createdProduct
  );

};
const updateProduct = async (
  id,
  body,
  files
) => {

  console.log(
    "BODY:",
    body
  );

  console.log(
    "FILES:",
    files
  );

  // ==============================
  // HELPERS
  // ==============================

  const toBool = (value) => {

    return (
      value === true ||
      value === "true"
    );

  };

  const parseArray = (value) => {

    try {

      if (!value) {
        return [];
      }

      if (Array.isArray(value)) {
        return value;
      }

      return JSON.parse(value);

    } catch {

      return [];

    }

  };

  // ==============================
  // FIND EXISTING PRODUCT
  // ==============================

  const existingProduct =
    await prisma.stone_products.findUnique({

      where: {
        id: BigInt(id),
      },

      include: {
        media: true,
      },

    });

  if (!existingProduct) {

    throw new Error(
      "Product not found"
    );

  }

  // ==============================
  // FEATURED IMAGES
  // ==============================

  let featuredImages = [];

  if (
    files?.closeup_images &&
    files.closeup_images.length > 0
  ) {

    featuredImages =
      await Promise.all(

        files.closeup_images.map(
          async (file) => {

            const uploaded =
              await uploadToCloudinary(

                file.path,

                "ultrastones/products/featured"

              );

            return uploaded.secure_url;

          }
        )

      );

  } else {

    // KEEP OLD

    featuredImages =
      existingProduct.media

        .filter(
          (item) =>
            item.media_type ===
            "CLOSEUP_IMAGE"
        )

        .map(
          (item) =>
            item.media_url
        );

  }

  // ==============================
  // GALLERY IMAGES
  // ==============================

  let galleryImages = [];

  if (
    files?.slab_images &&
    files.slab_images.length > 0
  ) {

    galleryImages =
      await Promise.all(

        files.slab_images.map(
          async (file) => {

            const uploaded =
              await uploadToCloudinary(

                file.path,

                "ultrastones/products/gallery"

              );

            return uploaded.secure_url;

          }
        )

      );

  } else {

    // KEEP OLD

    galleryImages =
      existingProduct.media

        .filter(
          (item) =>
            item.media_type ===
            "SLAB_IMAGE"
        )

        .map(
          (item) =>
            item.media_url
        );

  }

  // ==============================
  // FEATURED VIDEOS
  // ==============================

  let featuredVideos = [];

  if (
    files?.featured_videos &&
    files.featured_videos.length > 0
  ) {

    featuredVideos =
      await Promise.all(

        files.featured_videos.map(
          async (file) => {

            const uploaded =
              await uploadToCloudinary(

                file.path,

                "ultrastones/products/videos",

                "video"

              );

            return uploaded.secure_url;

          }
        )

      );

  } else {

    // KEEP OLD

    featuredVideos =
      existingProduct.media

        .filter(
          (item) =>
            item.media_type ===
            "FEATURED_VIDEO"
        )

        .map(
          (item) =>
            item.media_url
        );

  }

  // ==============================
  // APPLICATION IMAGES
  // ==============================

  let applicationImages = [];

  if (
    files?.application_images &&
    files.application_images.length > 0
  ) {
    applicationImages =
      await Promise.all(
        files.application_images.map(
          async (file) => {
            const uploaded =
              await uploadToCloudinary(
                file.path,
                "ultrastones/products/application"
              );

            return uploaded.secure_url;
          }
        )
      );
  } else {
    applicationImages =
      existingProduct.media
        .filter(
          (item) =>
            item.media_type ===
            "APPLICATION_IMAGE"
        )
        .map(
          (item) =>
            item.media_url
        );
  }

  // ==============================
  // BOOKMATCH / SLIPMATCH
  // ==============================

  let bookmatchSlipmatchImages = [];

  if (
    files?.bookmatch_slipmatch &&
    files.bookmatch_slipmatch.length > 0
  ) {
    bookmatchSlipmatchImages =
      await Promise.all(
        files.bookmatch_slipmatch.map(
          async (file) => {
            const uploaded =
              await uploadToCloudinary(
                file.path,
                "ultrastones/products/bookmatch-slipmatch"
              );

            return uploaded.secure_url;
          }
        )
      );
  } else {
    bookmatchSlipmatchImages =
      existingProduct.media
        .filter(
          (item) =>
            item.media_type ===
            "BOOKMATCH_SLIPMATCH"
        )
        .map(
          (item) =>
            item.media_url
        );
  }

  // ==============================
  // UPDATE PRODUCT
  // ==============================

  const updatedProduct =
    await prisma.stone_products.update({

      where: {
        id: BigInt(id),
      },

      data: {

        // BASIC

        name:
          body.name,

        slug:
          body.slug,

        small_description:
          body.small_description,

        long_description:
          body.long_description,

        category_id:
          body.category_id
            ? Number(body.category_id)
            : null,

        // DETAILS

        pattern:
          body.pattern,

        stone_group:
          body.stone_group,

        origin_country:
          body.origin_country,

        pantone_colour:
          body.pantone_colour,

        variation_level:
          body.variation_level,

        finishes_available:
          parseArray(
            body.finishes_available
          ),

        thicknesses_cm:
          parseArray(
            body.thicknesses_cm
          ),

        average_sizes_inches:
          parseArray(
            body.average_sizes_inches
          ),

        translucent:
          toBool(
            body.translucent
          ),

        cut_to_size:
          toBool(
            body.cut_to_size
          ),

        // APPLICATIONS

        color_enhancing:
          toBool(
            body.color_enhancing
          ),

        countertops_vanities:
          toBool(
            body.countertops_vanities
          ),

        interior_floor:
          toBool(
            body.interior_floor
          ),

        shower_wall:
          toBool(
            body.shower_wall
          ),

        shower_floor:
          toBool(
            body.shower_floor
          ),

        exterior_floor:
          toBool(
            body.exterior_floor
          ),

        exterior_wall:
          toBool(
            body.exterior_wall
          ),

        pool_fountain:
          toBool(
            body.pool_fountain
          ),

        fireplace:
          toBool(
            body.fireplace
          ),

        furniture_top:
          toBool(
            body.furniture_top
          ),

        // SPECIFICATIONS

        abrasion_resistance:
          body.abrasion_resistance,

        stain_resistance:
          body.stain_resistance,

        etching_resistance:
          body.etching_resistance,

        heat_resistance:
          body.heat_resistance,

        uv_resistance:
          body.uv_resistance,

        color_range:
          body.color_range,

        movement_index:
          body.movement_index,

        // FLAGS

        is_featured:
          toBool(
            body.is_featured
          ),

        is_trending:
          toBool(
            body.is_trending
          ),

        is_new_arrival:
          toBool(
            body.is_new_arrival
          ),

        // ==============================
        // MEDIA
        // ==============================

        media: {

          deleteMany: {},

          create: [

            // FEATURED IMAGES

            ...featuredImages.map(
              (url, index) => ({

                media_type:
                  "CLOSEUP_IMAGE",

                media_url:
                  url,

                display_order:
                  index,

              })
            ),

            // GALLERY IMAGES

            ...galleryImages.map(
              (url, index) => ({

                media_type:
                  "SLAB_IMAGE",

                media_url:
                  url,

                display_order:
                  index,

              })
            ),

            // VIDEOS

            ...featuredVideos.map(
              (url, index) => ({

                media_type:
                  "FEATURED_VIDEO",

                media_url:
                  url,

                display_order:
                  index,

              })
            ),

            ...applicationImages.map(
              (url, index) => ({
                media_type:
                  "APPLICATION_IMAGE",

                media_url: url,

                display_order: index,
              })
            ),

            // BOOKMATCH / SLIPMATCH

            ...bookmatchSlipmatchImages.map(
              (url, index) => ({
                media_type:
                  "BOOKMATCH_SLIPMATCH",

                media_url: url,

                display_order: index,
              })
            ),

          ],

        },

      },

      include: {
        media: true,
      },

    });

  return serializeBigInt(
    updatedProduct
  );

};

const deleteProduct = async (id) => {
return await prisma.stone_products.update({
  where: {
    id: BigInt(id),
  },
  data: {
    is_active: false,
  },
});
};

module.exports = {
  getStones,
  getCategoryProducts,
  getProductDetails,

  createCategory,
  updateCategory,

  createProduct,
  updateProduct,
  deleteProduct,
};
