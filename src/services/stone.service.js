const prisma = require("../config/prisma");
const { serialize } = require("../utils/serialize");
const { uploadToR2, deleteFileFromR2 } = require("../utils/uploadToR2");

const auditService = require("./audit.service");


// ================= GET ALLs =================
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

        is_active: true,

        is_published: true,

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
      sealer: true,

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

      interior_wall: true,

      shower_wall: true,

      shower_floor: true,

      exterior_floor: true,

      exterior_wall: true,

      pool_fountain: true,

      fireplace: true,

      furniture_top: true,

      silica_warning: true,

      silica_warning_message: true,

      silica_datasheet_url: true,

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

          silica_warning: true,
          silica_warning_message: true,
          silica_datasheet_url: true,
        },
      },

      // SEO

      stone_product_seo: {
        select: {
          id: true,
          meta_title: true,
          meta_description: true,
          canonical_url: true,
          og_title: true,
          og_description: true,
          og_image: true,
          schema_markup: true,
          robots_index: true,
          robots_follow: true,
          seo_content: true,
        },
      },

      product_faqs: {
        where: {
          is_active: true,
        },

        orderBy: {
          sort_order: "asc",
        },

        select: {
          id: true,
          question: true,
          answer: true,
          sort_order: true,
          is_active: true,
        },
      },

      // MEDIA

      media: {
        orderBy: {
          display_order: "asc",
        },

        select: {
          id: true,
          alt_text: true,
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

  const application_images = product.media
    .filter((item) => item.media_type === "application_image")
    .map((item) => item.media_url);

  const bookmatch_slipmatchs = product.media
    .filter((item) => item.media_type === "bookmatch_slipmatch")
    .map((item) => item.media_url);

  const {
    stone_product_seo,
    product_faqs,
    ...productWithoutSeo
  } = product;

  return {
    ...productWithoutSeo,

    id: Number(product.id),

    category_id: Number(product.category_id),

    media: product.media.map((item) => ({
      ...item,
      id: Number(item.id),
    })),

    seo: stone_product_seo ? {
      id: Number(stone_product_seo.id),

      meta_title:
        stone_product_seo.meta_title,

      meta_description:
        stone_product_seo.meta_description,

      canonical_url:
        stone_product_seo.canonical_url,

      og_title:
        stone_product_seo.og_title,

      og_description:
        stone_product_seo.og_description,

      og_image:
        stone_product_seo.og_image,

      schema_markup:
        stone_product_seo.schema_markup,

      robots_index:
        stone_product_seo.robots_index,

      robots_follow:
        stone_product_seo.robots_follow,

      seo_content:
        stone_product_seo.seo_content,
    }
      : null,

    faqs: product_faqs.map((faq) => ({
      id: Number(faq.id),
      question: faq.question,
      answer: faq.answer,
      sort_order: faq.sort_order,
      is_active: faq.is_active,
    })),

    silica_warning:
      product.silica_warning ||

      product.stone_categories?.silica_warning ||

      false,

    silica_warning_message:
      product.silica_warning_message ||
      product.stone_categories?.silica_warning_message ||
      null,

    silica_datasheet_url:
      product.silica_datasheet_url ||
      product.stone_categories?.silica_datasheet_url ||
      null,

    closeup_images,
    slab_images,
    featured_videos,
    application_images,
    bookmatch_slipmatchs,
  };
};

// ================  CATEGORY CRUD ================

const createCategory = async (
  body,
  audit = {}
) => {

  return await auditService.track({

    audit,

    action: "CREATE",

    resourceType: "CATEGORY",

    moduleName:
      "Stone Management",

    operation: () =>
      prisma.stone_categories.create({

        data: {

          name:
            body.name,

          slug:
            body.slug,

          description:
            body.description,

          parent_id:
            body.parent_id || null,

          thumbnail_url:
            body.thumbnail_url,

          banner_url:
            body.banner_url,

          display_order:
            body.display_order || 1,

          silica_warning:
            body.silica_warning === "true" ||
            body.silica_warning === true,

          silica_warning_message:
            body.silica_warning_message || null,

          silica_datasheet_url:
            body.silica_datasheet_url || null,

          is_active:
            true

        }

      })

  });

};

const updateCategory = async (
  id,
  body,
  audit = {}
) => {

  const existingCategory =
    await prisma.stone_categories.findUnique({
      where: {
        id: Number(id)
      }
    });

  if (!existingCategory) {
    throw new Error(
      "Category not found"
    );
  }

  const updateData = {
    ...body
  };


  if (
    "is_active" in updateData
  ) {
    updateData.is_active =
      updateData.is_active === "true" ||
      updateData.is_active === true;
  }

  if (
    "silica_warning" in updateData
  ) {
    updateData.silica_warning =
      updateData.silica_warning === "true" ||
      updateData.silica_warning === true;
  }

  if (
    "silica_warning_message" in updateData
  ) {
    updateData.silica_warning_message =
      updateData.silica_warning_message || null;
  }

  if (
    "silica_datasheet_url" in updateData
  ) {
    updateData.silica_datasheet_url =
      updateData.silica_datasheet_url || null;
  }

  if (
    "parent_id" in updateData
  ) {
    updateData.parent_id =
      updateData.parent_id === "" ||
        updateData.parent_id === null
        ? null
        : Number(updateData.parent_id);
  }

  return await auditService.track({

    audit,

    action: "UPDATE",

    resourceType: "CATEGORY",

    resourceId:
      existingCategory.id,

    moduleName:
      "Stone Management",

    oldValues:
      existingCategory,

    operation: async () => {

      const updatedCategory =
        await prisma.stone_categories.update({

          where: {
            id: Number(id)
          },

          data: updateData

        });

      // If parent category is deactivated,
      // deactivate all child categories
      if (
        "is_active" in updateData &&
        updateData.is_active === false
      ) {

        await prisma.stone_categories.updateMany({

          where: {
            parent_id: Number(id)
          },

          data: {
            is_active: false
          }

        });

      }

      return updatedCategory;

    }

  });

};

// ================  PRODUCT CRUD ================

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

const createProduct = async (body, files, audit = {}) => {

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
  const parseFaqs = (value) => {
    try {
      if (!value) return [];

      if (Array.isArray(value)) {
        return value;
      }

      return JSON.parse(value);
    } catch {
      return [];
    }
  };
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
          await uploadToR2(
            file.path,
            folder,
            resourceType
          );

       return {
    url: uploaded.secure_url,
    public_id: uploaded.public_id,
};

      })
    );
  };

  const featuredImages = await uploadFiles(
    files?.closeup_images,
    "ultrastones/products/featured"
  );

  const galleryImages = await uploadFiles(
    files?.slab_images,
    "ultrastones/products/gallery"
  );

  const featuredVideos = await uploadFiles(
    files?.featured_videos,
    "ultrastones/products/videos",
    "video"
  );

  const applicationImages = await uploadFiles(
    files?.application_images,
    "ultrastones/products/application"
  );

  const bookmatchSlipmatchImages = await uploadFiles(
    files?.bookmatch_slipmatch,
    "ultrastones/products/bookmatch-slipmatch"
  );

  const faqs = parseFaqs(body.faqs);

  // ==============================
  // CREATE PRODUCT
  // ==============================

  const createdProduct =
    await auditService.track({
      audit,

      action: "CREATE",

      resourceType: "PRODUCT",

      moduleName:
        "Stone Management",

      operation: () =>
        prisma.stone_products.create({

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

            silica_warning:
              toBool(body.silica_warning),

            silica_warning_message:
              body.silica_warning_message || null,

            silica_datasheet_url:
              body.silica_datasheet_url || null,

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

            sealer:
              body.sealer,

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

            interior_wall:
              toBool(
                body.interior_wall
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

            silica_warning:
              toBool(
                body.silica_warning
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
            // SEO
            // ==============================

            stone_product_seo: {
              create: {
                meta_title:
                  body.meta_title || null,

                meta_description:
                  body.meta_description || null,

                canonical_url:
                  body.canonical_url || null,

                og_title:
                  body.og_title || null,

                og_description:
                  body.og_description || null,

                og_image:
                  body.og_image || null,

                schema_markup:
                  body.schema_markup
                    ? JSON.parse(body.schema_markup)
                    : null,

                robots_index:
                  body.robots_index !== undefined
                    ? toBool(body.robots_index)
                    : true,

                robots_follow:
                  body.robots_follow !== undefined
                    ? toBool(body.robots_follow)
                    : true,

                seo_content:
                  body.seo_content || null,
              },
            },

            product_faqs: {
              create: faqs
                .filter(
                  (faq) =>
                    faq.question?.trim() &&
                    faq.answer?.trim()
                )
                .map((faq, index) => ({
                  question: faq.question.trim(),
                  answer: faq.answer.trim(),
                  sort_order:
                    faq.sort_order ?? index,
                  is_active:
                    faq.is_active ?? true,
                })),
            },


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
            stone_product_seo: true,
            media: true,
            product_faqs: true,
          },

        })
    });

  return serializeBigInt(
    createdProduct
  );

};

const updateProduct = async (id, body, files, audit = {}) => {
    console.time(`UPDATE_PRODUCT_TOTAL_${id}`);

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

  const parseJson = (value) => {
    try {
      if (!value) return null;

      if (typeof value === "object") {
        return value;
      }

      return JSON.parse(value);
    } catch {
      return null;
    }
  };

  const parseFaqs = (value) => {
    try {
      if (!value) return [];

      if (Array.isArray(value)) {
        return value;
      }

      return JSON.parse(value);
    } catch {
      return [];
    }
  };

  const existingProduct = await prisma.stone_products.findUnique({

    where: {
      id: BigInt(id),
    },

    include: {
      stone_product_seo: true,
      media: true,
      product_faqs: true,
    },

  });

  if (!existingProduct) {

    throw new Error(
      "Product not found"
    );

  }

  const existingMedia = JSON.parse(
    body.existing_media || "[]"
  );

  const oldMedia = existingProduct.media
    .map((m) => ({
      id: m.id.toString(),
      alt_text: m.alt_text,
    }))
    .sort((a, b) =>
      Number(a.id) - Number(b.id)
    );

  const newMedia =
    existingMedia
      .map((m) => ({
        id: m.id.toString(),
        alt_text: m.alt_text || null,
      }))
      .sort((a, b) =>
        Number(a.id) - Number(b.id)
      );

  const mediaChanged =
    JSON.stringify(oldMedia) !==
    JSON.stringify(newMedia);

  const altTextMap = new Map(
    existingMedia.map((item) => [
      `${item.media_type}_${item.media_url}`,
      item.alt_text || null,
    ])
  );


  let silicaDatasheetUrl =
    existingProduct.silica_datasheet_url;

  if (
    files?.silica_datasheet &&
    files.silica_datasheet.length > 0
  ) {
    silicaDatasheetUrl =
      `/uploads/${files.silica_datasheet[0].filename}`;
  }

  const faqs = parseFaqs(body.faqs);

  const newFaqs = faqs
    .filter(
      (faq) =>
        faq.question?.trim() &&
        faq.answer?.trim()
    )
    .map((faq, index) => ({
      question: faq.question.trim(),
      answer: faq.answer.trim(),
      sort_order:
        faq.sort_order ?? index,
      is_active:
        faq.is_active ?? true,
    }));

  const oldFaqs =
    existingProduct.product_faqs
      .map((faq) => ({
        question: faq.question,
        answer: faq.answer,
        sort_order: faq.sort_order,
        is_active: faq.is_active,
      }));

  const faqChanged =
    JSON.stringify(oldFaqs) !==
    JSON.stringify(newFaqs);


  const oldSeo =
    existingProduct.stone_product_seo || {};

  const newSeo = {
    meta_title: body.meta_title || null,
    meta_description:
      body.meta_description || null,
    canonical_url:
      body.canonical_url || null,
    og_title:
      body.og_title || null,
    og_description:
      body.og_description || null,
    og_image:
      body.og_image || null,
    schema_markup:
      parseJson(body.schema_markup),
    robots_index:
      toBool(body.robots_index),
    robots_follow:
      toBool(body.robots_follow),
    seo_content:
      body.seo_content || null,
  };


  const seoChanged =
    JSON.stringify({
      meta_title: oldSeo.meta_title,
      meta_description:
        oldSeo.meta_description,
      canonical_url:
        oldSeo.canonical_url,
      og_title:
        oldSeo.og_title,
      og_description:
        oldSeo.og_description,
      og_image:
        oldSeo.og_image,
      schema_markup:
        oldSeo.schema_markup,
      robots_index:
        oldSeo.robots_index,
      robots_follow:
        oldSeo.robots_follow,
      seo_content:
        oldSeo.seo_content,
    })
    !==
    JSON.stringify(newSeo);

  // ==============================
  // FEATURED IMAGES
  // ==============================

 let featuredImages = existingProduct.media
  .filter((item) => item.media_type === "CLOSEUP_IMAGE")
  .map((item) => ({
    media_url: item.media_url,
    public_id: item.public_id,
  }));

if (files?.closeup_images && files.closeup_images.length > 0) {

  const uploadedImages = await Promise.all(

    files.closeup_images.map(async (file) => {

      const uploaded = await uploadToR2(
        file.path,
        "ultrastones/products/featured"
      );

      return {
        media_url: uploaded.secure_url,
        public_id: uploaded.public_id,
      };

    })

  );

  featuredImages.push(...uploadedImages);

}

// ==============================
// GALLERY IMAGES
// ==============================

let galleryImages = existingProduct.media
  .filter((item) => item.media_type === "SLAB_IMAGE")
  .map((item) => ({
    media_url: item.media_url,
    public_id: item.public_id,
  }));

if (files?.slab_images && files.slab_images.length > 0) {

  const uploadedImages = await Promise.all(

    files.slab_images.map(async (file) => {

      const uploaded = await uploadToR2(
        file.path,
        "ultrastones/products/gallery"
      );

      return {
        media_url: uploaded.secure_url,
        public_id: uploaded.public_id,
      };

    })

  );

  // Append new uploads instead of replacing old ones
  galleryImages.push(...uploadedImages);

}
  

 // ==============================

// FEATURED VIDEOS

// ==============================

let featuredVideos = existingProduct.media

  .filter((item) => item.media_type === "FEATURED_VIDEO")

  .map((item) => ({

    media_url: item.media_url,

    public_id: item.public_id,

  }));

if (files?.featured_videos && files.featured_videos.length > 0) {

  console.time("FEATURED_VIDEOS_TOTAL_UPLOAD");

  const uploadedVideos = await Promise.all(

    files.featured_videos.map(async (file, index) => {

      console.log("VIDEO FILE RECEIVED BY SERVER:", {

        index,

        originalname: file.originalname,

        filename: file.filename,

        path: file.path,

        sizeMB: (file.size / 1024 / 1024).toFixed(2),

      });

      console.time(`SERVER_TO_R2_VIDEO_${index}_${file.originalname}`);

      const uploaded = await uploadToR2(

        file.path,

        "ultrastones/products/videos"

      );

      console.timeEnd(`SERVER_TO_R2_VIDEO_${index}_${file.originalname}`);

      return {

        media_url: uploaded.secure_url,

        public_id: uploaded.public_id,

      };

    })

  );

  console.timeEnd("FEATURED_VIDEOS_TOTAL_UPLOAD");

  featuredVideos.push(...uploadedVideos);

}

  // ==============================
// APPLICATION IMAGES
// ==============================

let applicationImages = existingProduct.media
  .filter((item) => item.media_type === "APPLICATION_IMAGE")
  .map((item) => ({
    media_url: item.media_url,
    public_id: item.public_id,
  }));

if (files?.application_images && files.application_images.length > 0) {

  const uploadedImages = await Promise.all(

    files.application_images.map(async (file) => {

      const uploaded = await uploadToR2(
        file.path,
        "ultrastones/products/application"
      );

      return {
        media_url: uploaded.secure_url,
        public_id: uploaded.public_id,
      };

    })

  );

  applicationImages.push(...uploadedImages);

}

  // ==============================
// BOOKMATCH / SLIPMATCH
// ==============================

let bookmatchSlipmatchImages = existingProduct.media
  .filter((item) => item.media_type === "BOOKMATCH_SLIPMATCH")
  .map((item) => ({
    media_url: item.media_url,
    public_id: item.public_id,
  }));

if (files?.bookmatch_slipmatch && files.bookmatch_slipmatch.length > 0) {

  const uploadedImages = await Promise.all(

    files.bookmatch_slipmatch.map(async (file) => {

      const uploaded = await uploadToR2(
        file.path,
        "ultrastones/products/bookmatch-slipmatch"
      );

      return {
        media_url: uploaded.secure_url,
        public_id: uploaded.public_id,
      };

    })

  );

  bookmatchSlipmatchImages.push(...uploadedImages);

}

// ==============================
// BUILD MEDIA ARRAY
// ==============================

const mediaToCreate = [];

// CLOSEUP IMAGES
featuredImages.forEach((image, index) => {
  mediaToCreate.push({
    product_id: BigInt(id),
    media_type: "CLOSEUP_IMAGE",
    media_url: image.media_url,
    public_id: image.public_id,
    alt_text:altTextMap.get(`CLOSEUP_IMAGE_${image.media_url}`) || null,
    display_order: index,
  });
});

// SLAB IMAGES
galleryImages.forEach((image, index) => {
  mediaToCreate.push({
    product_id: BigInt(id),
    media_type: "SLAB_IMAGE",
    media_url: image.media_url,
    public_id: image.public_id,
    alt_text: altTextMap.get(`SLAB_IMAGE_${image.media_url}`) || null,
    display_order: index,
  });
});

// APPLICATION IMAGES
applicationImages.forEach((image, index) => {
  mediaToCreate.push({
    product_id: BigInt(id),
    media_type: "APPLICATION_IMAGE",
    media_url: image.media_url,
    public_id: image.public_id,
    alt_text: altTextMap.get(`APPLICATION_IMAGE_${image.media_url}`) || null,
    display_order: index,
  });
});

// BOOKMATCH / SLIPMATCH
bookmatchSlipmatchImages.forEach((image, index) => {
  mediaToCreate.push({
    product_id: BigInt(id),
    media_type: "BOOKMATCH_SLIPMATCH",
    media_url: image.media_url,
    public_id: image.public_id,
    alt_text: altTextMap.get(`BOOKMATCH_SLIPMATCH_${image.media_url}`) || null,
    display_order: index,
  });
});

// VIDEOS
featuredVideos.forEach((video, index) => {
  mediaToCreate.push({
    product_id: BigInt(id),
    media_type: "FEATURED_VIDEO",
    media_url: video.media_url,
    public_id: video.public_id,
    alt_text: altTextMap.get(`FEATURED_VIDEO_${video.media_url}`) || null,
    display_order: index,
  });
});
  // ==============================
  // UPDATE PRODUCT
  // ==============================



if (seoChanged) {

  await auditService.track({

    audit,

    action: "UPDATE",

    resourceType: "PRODUCT_SEO",

    resourceId: BigInt(id),

    description:
      `${existingProduct.name} SEO updated`,

    moduleName:
      "Stone Management",

    oldValues: {
      meta_title:
        oldSeo.meta_title,

      meta_description:
        oldSeo.meta_description,

      canonical_url:
        oldSeo.canonical_url,

      og_title:
        oldSeo.og_title,

      og_description:
        oldSeo.og_description,

      og_image:
        oldSeo.og_image,

      schema_markup:
        oldSeo.schema_markup,

      robots_index:
        oldSeo.robots_index,

      robots_follow:
        oldSeo.robots_follow,

      seo_content:
        oldSeo.seo_content,
    },

    operation: async () => {

      await prisma.stone_product_seo.upsert({

        where: {
          product_id:
            BigInt(id),
        },

        create: {
          product_id:
            BigInt(id),

          ...newSeo,
        },

        update:
          newSeo,

      });

      return newSeo;
    },

  });

}

if (faqChanged) {

  await auditService.track({

    audit,

    action: "UPDATE",

    resourceType: "PRODUCT_FAQ",

    resourceId: BigInt(id),

    description:
      `${existingProduct.name} FAQ updated`,

    moduleName:
      "Stone Management",

    oldValues:
      oldFaqs,

    operation: async () => {

      await prisma.product_faqs.deleteMany({
        where: {
          product_id:
            BigInt(id),
        },
      });

      if (newFaqs.length) {

        await prisma.product_faqs.createMany({

          data:
            newFaqs.map((faq) => ({
              ...faq,
              product_id:
                BigInt(id),
            })),

        });

      }

      return newFaqs;

    },

  });

}

  const productAuditData = {
    ...existingProduct,
  };

  delete productAuditData.media;
  delete productAuditData.product_faqs;
  delete productAuditData.stone_product_seo;

  const updatedProduct =
    await auditService.track({
      audit,

      action: "UPDATE",

      resourceType:
        "PRODUCT",

      resourceId:
        existingProduct.id,

      moduleName:
        "Stone Management",

      oldValues:
        serializeBigInt(
          productAuditData
        ),

      operation: async () => {

        const updated =
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

              sealer:
                body.sealer,

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

              interior_wall:
                toBool(
                  body.interior_wall
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

              silica_warning:
                toBool(
                  body.silica_warning
                ),

              silica_warning_message:
                body.silica_warning_message
              ,

              silica_datasheet_url:
                silicaDatasheetUrl,

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
            },

            include: {
              stone_product_seo: true,
              media: true,
              product_faqs: true,
            },

          });

if (mediaToCreate.length > 0) {
   await prisma.stone_product_media.deleteMany({
  where: {
    product_id: BigInt(id),
  },
});

// Insert the rebuilt media list
if (mediaToCreate.length > 0) {
  await prisma.stone_product_media.createMany({
    data: mediaToCreate,
  });
}}

// Reload updated media
const finalProduct = await prisma.stone_products.findUnique({
  where: {
    id: BigInt(id),
  },
  include: {
    media: true,
    stone_product_seo: true,
    product_faqs: true,
  },
});

return finalProduct;

      }
      
    });

    console.timeEnd(`UPDATE_PRODUCT_TOTAL_${id}`);
  return serializeBigInt(
    updatedProduct
  );

};

const deleteProduct = async (id, audit = {}) => {

  const existingProduct =
    await prisma.stone_products.findUnique({

      where: {
        id: BigInt(id)
      },

      include: {
        media: true
      }

    });

  if (!existingProduct) {

    throw new Error(
      "Product not found"
    );

  }

  return await auditService.track({

    audit,

    action: "DELETE",

    resourceType:
      "PRODUCT",

    resourceId:
      existingProduct.id,

    moduleName:
      "Stone Management",

    oldValues:
      serializeBigInt(
        existingProduct
      ),

    operation: () =>
      prisma.stone_products.update({

        where: {
          id: BigInt(id)
        },

        data: {
          is_active: false
        }

      })

  });

};

const bulkCreateProducts = async (
  products,
  audit = {}
) => {

  return await auditService.track({

    audit,

    action: "BULK_CREATE",

    resourceType: "PRODUCT",

    moduleName:
      "Stone Management",

    operation: async () => {

      const createdProducts =
        await prisma.$transaction(
          products.map((product) =>
            prisma.stone_products.create({
              data: {
                name: product.name,
                slug: product.slug,

                category_id:
                  product.category_id,

                stone_group:
                  product.stone_group,

                origin_country:
                  product.origin_country,

                abrasion_resistance:
                  product.abrasion_resistance,

                stain_resistance:
                  product.stain_resistance,

                etching_resistance:
                  product.etching_resistance,

                heat_resistance:
                  product.heat_resistance,

                uv_resistance:
                  product.uv_resistance,

                color_range:
                  product.color_range,

                movement_index:
                  product.movement_index,

                color_enhancing:
                  product.color_enhancing,

                countertops_vanities:
                  product.countertops_vanities,

                interior_floor:
                  product.interior_floor,

                fireplace:
                  product.fireplace,

                shower_wall:
                  product.shower_wall,

                shower_floor:
                  product.shower_floor,

                exterior_floor:
                  product.exterior_floor,

                exterior_wall:
                  product.exterior_wall,

                pool_fountain:
                  product.pool_fountain,

                furniture_top:
                  product.furniture_top,

                translucent:
                  product.translucent,

                cut_to_size:
                  product.cut_to_size,

                pattern:
                  product.pattern,

                sealer:
                  product.sealer,

                thicknesses_cm:
                  product.thicknesses_cm,

                finishes_available:
                  product.finishes_available,

                average_sizes_inches:
                  product.average_sizes_inches,

                is_active: true,

                stone_product_seo: {
                  create: {
                    meta_title:
                      product.name,

                    meta_description:
                      product.name,

                    robots_index: true,

                    robots_follow: true,
                  },
                },
              },
            })
          )
        );

      return serialize({
        count:
          createdProducts.length,

        products:
          createdProducts,
      });

    },
  });

};

const bulkDeactivateProducts = async (
  ids,
  audit = {}
) => {

  return await auditService.track({

    audit,

    action: "BULK_DEACTIVATE",

    resourceType: "PRODUCT",

    moduleName:
      "Stone Management",

    oldValues:
      await prisma.stone_products.findMany({
        where: {
          id: {
            in: ids.map(Number),
          },
        },
        include: {
          stone_product_seo: true,
        },
      }),

    operation: async () => {

      const products =
        await prisma.stone_products.findMany({
          where: {
            id: {
              in: ids.map(Number),
            },
          },
          select: {
            id: true,
            name: true,
            slug: true,
            is_active: true,
          },
        });

      await prisma.stone_products.updateMany({
        where: {
          id: {
            in: ids.map(Number),
          },
        },
        data: {
          is_active: false,
        },
      });

      return serialize({
        count: products.length,
        products,
      });

    },
  });

};

const updateProductStatus = async (
  id,
  is_active
) => {

  const product =
    await prisma.stone_products.update({
      where: {
        id: Number(id),
      },
      data: {
        is_active: Boolean(is_active),

        ...(Boolean(is_active) === false && {
          is_published: false,
        }),
      },
    });

  return serialize(product);
};

const updatePublishStatus = async (
  id,
  is_published,
  audit = {}
) => {

  return await auditService.track({

    audit,

    action: "UPDATE",

    resourceType: "PRODUCT_PUBLISH",

    resourceId: BigInt(id),

    moduleName: "Stone Management",

    oldValues:
      await prisma.stone_products.findUnique({
        where: {
          id: BigInt(id),
        },
        select: {
          id: true,
          name: true,
          is_published: true,
        },
      }),

    operation: async () => {

      return await prisma.stone_products.update({

        where: {
          id: BigInt(id),
        },

        data: {
          is_published,
        },

        select: {
          id: true,
          name: true,
          is_published: true,
        },

      });

    },

  });

};

const bulkPublishProducts = async (
  ids,
  is_published,
  audit = {}
) => {

  return await auditService.track({

    audit,

    action: "BULK_UPDATE",

    resourceType: "PRODUCT_PUBLISH",

    moduleName: "Stone Management",

    oldValues:
      await prisma.stone_products.findMany({

        where: {
          id: {
            in: ids.map(Number),
          },
        },

        select: {
          id: true,
          name: true,
          is_published: true,
        },

      }),

    operation: async () => {

      await prisma.stone_products.updateMany({

        where: {
          id: {
            in: ids.map(Number),
          },
        },

        data: {
          is_published,
        },

      });

      return {
        count: ids.length,
        is_published,
      };

    },

  });

};

const deleteStoneProductMedia = async (mediaId) => {

    // 1. Find media
    const media =
        await prisma.stone_product_media.findUnique({
            where: {
                id: BigInt(mediaId),
            },
        });

    if (!media) {
        throw new Error("Media not found.");
    }

    // 2. Delete from R2
    if (media.public_id) {
        await deleteFileFromR2(media.public_id);
    }

    // 3. Delete DB record
    await prisma.stone_product_media.delete({
        where: {
            id: BigInt(mediaId),
        },
    });

    return media;
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
  bulkCreateProducts,
  bulkDeactivateProducts,
  updateProductStatus,
  updatePublishStatus,
  bulkPublishProducts,
  deleteStoneProductMedia,
};
