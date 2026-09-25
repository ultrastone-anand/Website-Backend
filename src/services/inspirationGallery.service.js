const prisma = require("../config/prisma");
const {
  deleteFileFromR2,
} = require("../utils/uploadToR2");
const {
  createR2UploadUrl,
} = require("../utils/r2Presigned");

/* =========================================================
   HELPERS
========================================================= */

const slugify = (text) =>
  text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "")
    .replace(/--+/g, "-");

/* =========================================================
   SERIALIZATION HELPERS
========================================================= */

const serializeGalleryImage = (image) => ({
  ...image,

  product_id:
    image.product_id !== null &&
    image.product_id !== undefined
      ? image.product_id.toString()
      : null,
});

const serializeProduct = (product) => ({
  ...product,

  id:
    product.id !== null &&
    product.id !== undefined
      ? product.id.toString()
      : null,
});

/* =========================================================
   CATEGORIES
========================================================= */

const getCategories = async () => {
  return prisma.inspiration_gallery_categories.findMany({
    where: {
      is_active: true,
    },

    select: {
      id: true,
      name: true,
      slug: true,
      sort_order: true,
    },

    orderBy: {
      sort_order: "asc",
    },
  });
};

const createCategory = async (body) => {
  const { name } = body;

  if (!name) {
    throw new Error(
      "Category name is required"
    );
  }

  const cleanName =
    String(name).trim();

  if (!cleanName) {
    throw new Error(
      "Category name is required"
    );
  }

  const slug =
    slugify(cleanName);

  const existing =
    await prisma.inspiration_gallery_categories.findUnique({
      where: {
        slug,
      },
    });

  if (existing) {
    throw new Error(
      "Category already exists"
    );
  }

  const lastCategory =
    await prisma.inspiration_gallery_categories.findFirst({
      orderBy: {
        sort_order: "desc",
      },
    });

  return prisma.inspiration_gallery_categories.create({
    data: {
      name: cleanName,
      slug,

      sort_order:
        (lastCategory?.sort_order || 0) +
        1,
    },
  });
};

const updateCategory = async (
  id,
  body
) => {
  const {
    name,
    sort_order,
    is_active,
  } = body;

  const category =
    await prisma.inspiration_gallery_categories.findUnique({
      where: {
        id,
      },
    });

  if (!category) {
    throw new Error(
      "Category not found"
    );
  }

  const data = {};

  if (name !== undefined) {
    const cleanName =
      String(name).trim();

    if (!cleanName) {
      throw new Error(
        "Category name is required"
      );
    }

    const slug =
      slugify(cleanName);

    const existing =
      await prisma.inspiration_gallery_categories.findFirst({
        where: {
          slug,

          NOT: {
            id,
          },
        },
      });

    if (existing) {
      throw new Error(
        "Category already exists"
      );
    }

    data.name =
      cleanName;

    data.slug =
      slug;
  }

  if (
    sort_order !== undefined
  ) {
    data.sort_order =
      Number(sort_order);
  }

  if (
    is_active !== undefined
  ) {
    data.is_active =
      Boolean(is_active);
  }

  return prisma.inspiration_gallery_categories.update({
    where: {
      id,
    },

    data,
  });
};

const deleteCategory = async (
  id
) => {
  const category =
    await prisma.inspiration_gallery_categories.findUnique({
      where: {
        id,
      },

      include: {
        inspiration_gallery_images:
          true,
      },
    });

  if (!category) {
    throw new Error(
      "Category not found"
    );
  }

  const publicUrl =
    process.env.R2_PUBLIC_URL;

  /*
   * Delete physical files from R2 first.
   *
   * PostgreSQL cascade will remove:
   *
   * category
   *   -> gallery images
   *      -> image/product junction rows
   */
  for (
    const image of
    category.inspiration_gallery_images
  ) {
    let objectKey = "";

    if (
      image.image_url &&
      publicUrl
    ) {
      objectKey =
        image.image_url.replace(
          `${publicUrl}/`,
          ""
        );
    }

    if (objectKey) {
      await deleteFileFromR2(
        objectKey
      );
    }
  }

  return prisma.inspiration_gallery_categories.delete({
    where: {
      id,
    },
  });
};

/* =========================================================
   GALLERY IMAGE SELECT
========================================================= */

const imageSelect = {
  id: true,
  category_id: true,

  /*
   * Legacy field.
   *
   * Keep temporarily for compatibility
   * with existing data/frontend.
   */
  product_id: true,

  image_url: true,
  image_alt: true,
  title: true,
  sort_order: true,
  created_at: true,

  inspiration_gallery_categories: {
    select: {
      id: true,
      name: true,
      slug: true,
    },
  },
};

/* =========================================================
   GET GALLERY IMAGES
========================================================= */

const getImages = async ({
  categoryId,
  page = 1,
  limit = 20,
}) => {
  const parsedCategoryId =
    Number(categoryId);

  const safePage =
    Math.max(
      Number(page) || 1,
      1
    );

  const safeLimit =
    Math.min(
      Math.max(
        Number(limit) || 20,
        1
      ),
      50
    );

  const skip =
    (safePage - 1) *
    safeLimit;

  const endIndex =
    skip + safeLimit;

  /* ---------------------------------------------------------
     CATEGORY FILTER
  --------------------------------------------------------- */

  if (parsedCategoryId) {
    const where = {
      is_active: true,

      category_id:
        parsedCategoryId,

      inspiration_gallery_categories:
        {
          is: {
            is_active: true,
          },
        },
    };

    const [
      images,
      total,
    ] = await Promise.all([
      prisma.inspiration_gallery_images.findMany({
        where,

        select:
          imageSelect,

        orderBy: [
          {
            sort_order: "asc",
          },
          {
            created_at: "desc",
          },
          {
            id: "desc",
          },
        ],

        skip,
        take: safeLimit,
      }),

      prisma.inspiration_gallery_images.count({
        where,
      }),
    ]);

    const totalPages =
      Math.ceil(
        total /
          safeLimit
      );

    return {
      images:
        images.map(
          serializeGalleryImage
        ),

      pagination: {
        page: safePage,
        limit: safeLimit,
        total,
        totalPages,

        hasMore:
          safePage <
          totalPages,
      },
    };
  }

  /* ---------------------------------------------------------
     ALL CATEGORIES
  --------------------------------------------------------- */

  const categories =
    await prisma.inspiration_gallery_categories.findMany({
      where: {
        is_active: true,
      },

      select: {
        id: true,
      },

      orderBy: [
        {
          sort_order: "asc",
        },
        {
          id: "asc",
        },
      ],
    });

  if (!categories.length) {
    return {
      images: [],

      pagination: {
        page: safePage,
        limit: safeLimit,
        total: 0,
        totalPages: 0,
        hasMore: false,
      },
    };
  }

  const categoryIds =
    categories.map(
      (category) =>
        category.id
    );

  const total =
    await prisma.inspiration_gallery_images.count({
      where: {
        is_active: true,

        category_id: {
          in: categoryIds,
        },
      },
    });

  /*
   * Preserve your existing round-robin
   * category mixing behavior.
   */
  const categoryImageGroups =
    await Promise.all(
      categories.map(
        (category) =>
          prisma.inspiration_gallery_images.findMany({
            where: {
              is_active:
                true,

              category_id:
                category.id,
            },

            select:
              imageSelect,

            orderBy: [
              {
                sort_order:
                  "asc",
              },
              {
                created_at:
                  "desc",
              },
              {
                id:
                  "desc",
              },
            ],

            take:
              endIndex,
          })
      )
    );

  const mixedImages = [];

  let imageIndex = 0;

  while (
    mixedImages.length <
    endIndex
  ) {
    let imageAdded =
      false;

    for (
      const categoryImages of
      categoryImageGroups
    ) {
      const image =
        categoryImages[
          imageIndex
        ];

      if (image) {
        mixedImages.push(
          image
        );

        imageAdded =
          true;
      }

      if (
        mixedImages.length >=
        endIndex
      ) {
        break;
      }
    }

    if (!imageAdded) {
      break;
    }

    imageIndex += 1;
  }

  const paginatedImages =
    mixedImages.slice(
      skip,
      endIndex
    );

  const totalPages =
    Math.ceil(
      total /
        safeLimit
    );

  return {
    images:
      paginatedImages.map(
        serializeGalleryImage
      ),

    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      totalPages,

      hasMore:
        safePage <
        totalPages,
    },
  };
};

/* =========================================================
   GET IMAGES BY PRODUCT SLUG
========================================================= */

/*
 * IMPORTANT:
 *
 * This now uses:
 *
 * inspiration_gallery_image_products
 *
 * instead of relying only on:
 *
 * inspiration_gallery_images.product_id
 */
const getImagesBySlug = async (
  slug
) => {
  const cleanSlug =
    String(
      slug || ""
    ).trim();

  if (!cleanSlug) {
    throw new Error(
      "Product slug is required"
    );
  }

  const product =
    await prisma.stone_products.findUnique({
      where: {
        slug:
          cleanSlug,
      },

      select: {
        id: true,
        name: true,
        slug: true,
      },
    });

  if (!product) {
    throw new Error(
      "Product not found"
    );
  }

  /*
   * Search through the junction table.
   *
   * During migration we ALSO check the
   * old product_id column.
   *
   * This prevents old gallery records
   * from disappearing if they haven't
   * been migrated yet.
   */
  const images =
    await prisma.inspiration_gallery_images.findMany({
      where: {
        is_active: true,

        inspiration_gallery_categories:
          {
            is: {
              is_active:
                true,
            },
          },

        OR: [
          {
            inspiration_gallery_image_products:
              {
                some: {
                  product_id:
                    product.id,
                },
              },
          },

          /*
           * Legacy fallback.
           */
          {
            product_id:
              product.id,
          },
        ],
      },

      select:
        imageSelect,

      orderBy: [
        {
          sort_order:
            "asc",
        },
        {
          created_at:
            "desc",
        },
        {
          id:
            "desc",
        },
      ],
    });

  return images.map(
    serializeGalleryImage
  );
};

/* =========================================================
   CREATE R2 UPLOAD URLS
========================================================= */

const createImageUploadUrls = async (
  body
) => {
  const {
    category_id,
    files = [],
  } = body;

  const categoryId =
    Number(
      category_id
    );

  if (!categoryId) {
    throw new Error(
      "Category is required"
    );
  }

  if (
    !Array.isArray(files) ||
    !files.length
  ) {
    throw new Error(
      "Files are required"
    );
  }

  const category =
    await prisma.inspiration_gallery_categories.findUnique({
      where: {
        id:
          categoryId,
      },
    });

  if (!category) {
    throw new Error(
      "Category not found"
    );
  }

  const folder =
    `Home Page/inspiration galleries/${category.slug}`;

  return Promise.all(
    files.map(
      (file) =>
        createR2UploadUrl(
          file.fileName,
          folder
        )
    )
  );
};

/* =========================================================
   SAVE UPLOADED IMAGES
========================================================= */

/*
 * We keep product_id support here temporarily
 * because your existing upload UI may still send it.
 *
 * New multi-product linking should be done through:
 *
 * PUT /images/:id/products
 */
/* =========================================================
   SAVE UPLOADED IMAGES
   + AUTO LINK PRODUCT
========================================================= */

const saveUploadedImages = async (body) => {
  const {
    category_id,
    product_id,
    images = [],
  } = body;

  const categoryId =
    Number(category_id);

  /* =========================================================
     VALIDATE CATEGORY
  ========================================================= */

  if (!categoryId) {
    throw new Error(
      "Category is required"
    );
  }

  if (
    !Array.isArray(images) ||
    !images.length
  ) {
    throw new Error(
      "Images are required"
    );
  }

  const category =
    await prisma.inspiration_gallery_categories.findUnique({
      where: {
        id: categoryId,
      },

      select: {
        id: true,
      },
    });

  if (!category) {
    throw new Error(
      "Category not found"
    );
  }

  /* =========================================================
     PARSE PRODUCT
  ========================================================= */

  let productId = null;

  if (
    product_id !== undefined &&
    product_id !== null &&
    product_id !== ""
  ) {
    try {
      productId =
        BigInt(product_id);
    } catch {
      throw new Error(
        "Invalid product ID"
      );
    }
  }

  /* =========================================================
     VERIFY PRODUCT
  ========================================================= */

  if (productId !== null) {
    const product =
      await prisma.stone_products.findUnique({
        where: {
          id: productId,
        },

        select: {
          id: true,
        },
      });

    if (!product) {
      throw new Error(
        "Product not found"
      );
    }
  }

  /* =========================================================
     CREATE IMAGES + AUTO LINK PRODUCT
  ========================================================= */

  const createdImages =
    await prisma.$transaction(
      async (tx) => {
        const results = [];

        for (const image of images) {
          /* -----------------------------------------------
             Create gallery image
          ------------------------------------------------ */

          const createdImage =
            await tx.inspiration_gallery_images.create({
              data: {
                category_id:
                  categoryId,

                /*
                 * Keep legacy field synchronized
                 * for now.
                 */
                product_id:
                  productId,

                image_url:
                  image.secure_url,

                image_alt:
                  image.image_alt ||
                  null,

                title:
                  image.title ||
                  null,

                sort_order:
                  0,
              },

              select: {
                id: true,
                category_id:
                  true,
                product_id:
                  true,
                image_url:
                  true,
                image_alt:
                  true,
                title:
                  true,
                sort_order:
                  true,
                created_at:
                  true,
              },
            });

          /* -----------------------------------------------
             AUTO LINK PRODUCT
          ------------------------------------------------ */

          if (productId !== null) {
            await tx.inspiration_gallery_image_products.create({
              data: {
                image_id:
                  createdImage.id,

                product_id:
                  productId,
              },
            });
          }

          results.push(
            createdImage
          );
        }

        return results;
      }
    );

  /* =========================================================
     SERIALIZE BIGINT
  ========================================================= */

  return {
    count:
      createdImages.length,

    images:
      createdImages.map(
        serializeGalleryImage
      ),
  };
};

/* =========================================================
   SEARCH PRODUCTS
========================================================= */

/*
 * Used by:
 *
 * GET /inspiration-gallery/products
 * GET /inspiration-gallery/products?search=calacatta
 *
 * Only active + published products are returned.
 */
const searchProducts = async (
  search = ""
) => {
  const cleanSearch =
    String(
      search || ""
    ).trim();

  const where = {
    is_active: true,
    is_published: true,
  };

  if (cleanSearch) {
    where.OR = [
      {
        name: {
          contains:
            cleanSearch,

          mode:
            "insensitive",
        },
      },

      {
        slug: {
          contains:
            cleanSearch,

          mode:
            "insensitive",
        },
      },
    ];
  }

  const products =
    await prisma.stone_products.findMany({
      where,

      select: {
        id: true,
        name: true,
        slug: true,

        stone_categories: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },

        /*
         * Useful for displaying a thumbnail
         * inside the CMS selector.
         */
        media: {
          where: {
            media_type: {
              in: [
                "CLOSEUP_IMAGE",
                "SLAB_IMAGE",
              ],
            },
          },

          select: {
            id: true,
            media_type: true,
            media_url: true,
            alt_text: true,
            display_order: true,
          },

          orderBy: {
            display_order:
              "asc",
          },

          take: 1,
        },
      },

      orderBy: {
        name: "asc",
      },

      /*
       * Prevent accidentally returning
       * hundreds of products at once.
       */
      take: cleanSearch
        ? 50
        : 50,
    });

  /*
   * Prisma BigInt cannot be JSON.stringify'd.
   * Convert product/media IDs to strings.
   */
  return products.map(
    (product) => ({
      id:
        product.id.toString(),

      name:
        product.name,

      slug:
        product.slug,

      category:
        product.stone_categories
          ? {
              id:
                product
                  .stone_categories
                  .id,

              name:
                product
                  .stone_categories
                  .name,

              slug:
                product
                  .stone_categories
                  .slug,
            }
          : null,

      thumbnail:
        product.media?.[0]
          ? {
              id:
                product.media[
                  0
                ].id.toString(),

              media_type:
                product.media[
                  0
                ].media_type,

              media_url:
                product.media[
                  0
                ].media_url,

              alt_text:
                product.media[
                  0
                ].alt_text,
            }
          : null,
    })
  );
};

/* =========================================================
   GET PRODUCTS LINKED TO ONE IMAGE
========================================================= */

/*
 * GET /images/:id/products
 */
const getImageProducts = async (
  imageId
) => {
  const image =
    await prisma.inspiration_gallery_images.findUnique({
      where: {
        id:
          imageId,
      },

      select: {
        id: true,
      },
    });

  if (!image) {
    throw new Error(
      "Gallery image not found"
    );
  }

  const links =
    await prisma.inspiration_gallery_image_products.findMany({
      where: {
        image_id:
          imageId,
      },

      select: {
        product_id: true,
        created_at: true,

        stone_products: {
          select: {
            id: true,
            name: true,
            slug: true,

            is_active:
              true,

            is_published:
              true,

            stone_categories:
              {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                },
              },

            media: {
              where: {
                media_type: {
                  in: [
                    "CLOSEUP_IMAGE",
                    "SLAB_IMAGE",
                  ],
                },
              },

              select: {
                id: true,
                media_type:
                  true,
                media_url:
                  true,
                alt_text:
                  true,
                display_order:
                  true,
              },

              orderBy: {
                display_order:
                  "asc",
              },

              take: 1,
            },
          },
        },
      },

      orderBy: {
        created_at:
          "asc",
      },
    });

  return links.map(
    (link) => {
      const product =
        link.stone_products;

      return {
        id:
          product.id.toString(),

        name:
          product.name,

        slug:
          product.slug,

        is_active:
          product.is_active,

        is_published:
          product.is_published,

        category:
          product.stone_categories
            ? {
                id:
                  product
                    .stone_categories
                    .id,

                name:
                  product
                    .stone_categories
                    .name,

                slug:
                  product
                    .stone_categories
                    .slug,
              }
            : null,

        thumbnail:
          product.media?.[0]
            ? {
                id:
                  product.media[
                    0
                  ].id.toString(),

                media_type:
                  product.media[
                    0
                  ].media_type,

                media_url:
                  product.media[
                    0
                  ].media_url,

                alt_text:
                  product.media[
                    0
                  ].alt_text,
              }
            : null,
      };
    }
  );
};

/* =========================================================
   UPDATE PRODUCTS LINKED TO ONE IMAGE
========================================================= */

/*
 * PUT /images/:id/products
 *
 * {
 *   "product_ids": [
 *      "891",
 *      "889",
 *      "887"
 *   ]
 * }
 *
 * This REPLACES the complete existing selection.
 *
 * [] means unlink everything.
 */
const updateImageProducts = async (
  imageId,
  productIds
) => {
  /* ---------------------------------------------------------
     Validate image
  --------------------------------------------------------- */

  const image =
    await prisma.inspiration_gallery_images.findUnique({
      where: {
        id:
          imageId,
      },

      select: {
        id: true,
      },
    });

  if (!image) {
    throw new Error(
      "Gallery image not found"
    );
  }

  /* ---------------------------------------------------------
     Convert product IDs to BigInt
  --------------------------------------------------------- */

  let parsedProductIds;

  try {
    parsedProductIds =
      productIds.map(
        (id) => {
          const cleanId =
            String(
              id
            ).trim();

          if (
            !/^\d+$/.test(
              cleanId
            )
          ) {
            throw new Error();
          }

          const parsed =
            BigInt(
              cleanId
            );

          if (
            parsed <= 0n
          ) {
            throw new Error();
          }

          return parsed;
        }
      );
  } catch {
    throw new Error(
      "Invalid product ID"
    );
  }

  /*
   * Remove duplicate IDs.
   */
  const uniqueProductIds =
    [
      ...new Map(
        parsedProductIds.map(
          (id) => [
            id.toString(),
            id,
          ]
        )
      ).values(),
    ];

  /* ---------------------------------------------------------
     Verify every product exists
  --------------------------------------------------------- */

  if (
    uniqueProductIds.length
  ) {
    const existingProducts =
      await prisma.stone_products.findMany({
        where: {
          id: {
            in:
              uniqueProductIds,
          },
        },

        select: {
          id: true,
        },
      });

    if (
      existingProducts.length !==
      uniqueProductIds.length
    ) {
      throw new Error(
        "One or more products were not found"
      );
    }
  }

  /* ---------------------------------------------------------
     Replace links transactionally
  --------------------------------------------------------- */

  await prisma.$transaction(
    async (tx) => {
      /*
       * Remove old relationships.
       */
      await tx.inspiration_gallery_image_products.deleteMany({
        where: {
          image_id:
            imageId,
        },
      });

      /*
       * Create new relationships.
       */
      if (
        uniqueProductIds.length
      ) {
        await tx.inspiration_gallery_image_products.createMany({
          data:
            uniqueProductIds.map(
              (productId) => ({
                image_id:
                  imageId,

                product_id:
                  productId,
              })
            ),

          skipDuplicates:
            true,
        });
      }

      /*
       * LEGACY COMPATIBILITY
       *
       * Keep inspiration_gallery_images.product_id
       * synchronized with the first selected product.
       *
       * This means any old frontend/backend code
       * still reading product_id will continue
       * working while we migrate everything.
       *
       * Later, once the whole application uses
       * the junction table, this can be removed.
       */
      await tx.inspiration_gallery_images.update({
        where: {
          id:
            imageId,
        },

        data: {
          product_id:
            uniqueProductIds[
              0
            ] || null,
        },
      });
    }
  );

  /*
   * Return the final linked products.
   */
  return getImageProducts(
    imageId
  );
};

/* =========================================================
   DELETE IMAGE
========================================================= */

const deleteImage = async (
  id
) => {
  const image =
    await prisma.inspiration_gallery_images.findUnique({
      where: {
        id,
      },
    });

  if (!image) {
    throw new Error(
      "Image not found"
    );
  }

  const publicUrl =
    process.env.R2_PUBLIC_URL;

  let objectKey = "";

  if (
    image.image_url &&
    publicUrl
  ) {
    objectKey =
      image.image_url.replace(
        `${publicUrl}/`,
        ""
      );
  }

  /*
   * Delete physical file.
   */
  if (objectKey) {
    await deleteFileFromR2(
      objectKey
    );
  }

  /*
   * Junction records are automatically deleted
   * because FK image_id uses ON DELETE CASCADE.
   */
  return prisma.inspiration_gallery_images.delete({
    where: {
      id,
    },
  });
};

/* =========================================================
   UPDATE IMAGE ALT
========================================================= */

const updateImageAlt = async (
  id,
  body
) => {
  const imageId =
    Number(id);

  const imageAlt =
    body.image_alt?.trim();

  if (!imageId) {
    throw new Error(
      "Valid image ID is required"
    );
  }

  if (!imageAlt) {
    throw new Error(
      "Image alt text is required"
    );
  }

  if (
    imageAlt.length >
    250
  ) {
    throw new Error(
      "Image alt text cannot exceed 250 characters"
    );
  }

  const existingImage =
    await prisma.inspiration_gallery_images.findUnique({
      where: {
        id:
          imageId,
      },
    });

  if (!existingImage) {
    throw new Error(
      "Gallery media not found"
    );
  }

  const updatedImage =
    await prisma.inspiration_gallery_images.update({
      where: {
        id:
          imageId,
      },

      data: {
        image_alt:
          imageAlt,
      },

      select: {
        id: true,
        category_id:
          true,

        /*
         * Legacy field.
         */
        product_id:
          true,

        image_url:
          true,

        image_alt:
          true,

        title:
          true,

        sort_order:
          true,
      },
    });

  return serializeGalleryImage(
    updatedImage
  );
};

/* =========================================================
   EXPORTS
========================================================= */

module.exports = {
  // Categories
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,

  // Images
  getImages,
  getImagesBySlug,
  createImageUploadUrls,
  saveUploadedImages,

  // Image ↔ Product
  searchProducts,
  getImageProducts,
  updateImageProducts,

  // Image update/delete
  deleteImage,
  updateImageAlt,
};