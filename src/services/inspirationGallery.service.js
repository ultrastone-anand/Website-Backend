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

const serializeGalleryImage = (image) => {
  const {
    inspiration_gallery_image_products = [],
    ...galleryImage
  } = image;

  return {
    ...galleryImage,

    product_id:
      galleryImage.product_id !== null &&
      galleryImage.product_id !== undefined
        ? galleryImage.product_id.toString()
        : null,

    /*
     * Products linked through the
     * image ↔ product junction table.
     */
    linked_products:
      inspiration_gallery_image_products
        .filter(
          (link) =>
            link.stone_products
        )
        .map((link) => ({
          id:
            link.stone_products.id.toString(),

          name:
            link.stone_products.name,

          slug:
            link.stone_products.slug,
        })),
  };
};

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

  /*
   * Products linked to this gallery image.
   */
  inspiration_gallery_image_products: {
    select: {
      stone_products: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
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
   + AUTO LINK PRODUCT
========================================================= */

/*
 * Supports BOTH formats:
 *
 * 1. One product for the complete upload:
 *
 * {
 *   category_id: 1,
 *   product_id: "891",
 *   images: [...]
 * }
 *
 * 2. Different product for each image:
 *
 * {
 *   category_id: 1,
 *   images: [
 *     {
 *       secure_url: "...",
 *       product_id: "891"
 *     },
 *     {
 *       secure_url: "...",
 *       product_id: "889"
 *     }
 *   ]
 * }
 *
 * Product resolution priority:
 *
 * image.product_id
 *        ↓
 * body.product_id
 *        ↓
 * null
 *
 * When a product is resolved:
 *
 * 1. inspiration_gallery_images.product_id
 *    is populated for legacy compatibility.
 *
 * 2. inspiration_gallery_image_products
 *    automatically receives the relationship.
 *
 * Later the CMS can replace/correct the links through:
 *
 * PUT /images/:id/products
 */

/* =========================================================
   AUTO PRODUCT MATCHING HELPERS
========================================================= */

/*
 * Words that are too generic to help identify
 * a stone product.
 */
const PRODUCT_MATCH_STOP_WORDS =
  new Set([
    "image",
    "img",
    "photo",
    "picture",
    "render",
    "application",
    "inspiration",
    "gallery",
    "kitchen",
    "bathroom",
    "living",
    "room",
    "interior",
    "exterior",
    "countertop",
    "counter",
    "island",
    "wall",
    "floor",
    "fireplace",
    "vanity",
    "table",
    "desk",
    "home",
    "design",
    "final",
    "new",
    "copy",
    "edited",
    "edit",
    "jpg",
    "jpeg",
    "png",
    "webp",
    "avif",
  ]);

/*
 * Normalize text so:
 *
 * Calacatta-Viola Kitchen.jpg
 *
 * becomes:
 *
 * calacatta viola kitchen
 */
const normalizeMatchText = (
  value = ""
) =>
  String(value)
    .toLowerCase()
    .replace(/\.[^/.]+$/, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/*
 * Split normalized text into meaningful
 * matching words.
 */
const getMatchTokens = (
  value = ""
) => {
  const normalized =
    normalizeMatchText(value);

  if (!normalized) {
    return [];
  }

  return [
    ...new Set(
      normalized
        .split(" ")
        .filter(
          (word) =>
            word.length >= 2 &&
            !PRODUCT_MATCH_STOP_WORDS.has(
              word
            )
        )
    ),
  ];
};

/*
 * Calculate similarity between uploaded
 * image information and a stone product.
 *
 * Returns a score between 0 and 100.
 */
const calculateProductMatchScore = ({
  searchText,
  productName,
  productSlug,
}) => {
  const normalizedSearch =
    normalizeMatchText(
      searchText
    );

  const normalizedName =
    normalizeMatchText(
      productName
    );

  const normalizedSlug =
    normalizeMatchText(
      productSlug
    );

  if (
    !normalizedSearch ||
    !normalizedName
  ) {
    return 0;
  }

  /* ---------------------------------------------------------
     EXACT PRODUCT NAME
  --------------------------------------------------------- */

  if (
    normalizedSearch ===
    normalizedName
  ) {
    return 100;
  }

  /* ---------------------------------------------------------
     PRODUCT NAME APPEARS INSIDE IMAGE TEXT
  --------------------------------------------------------- */

  if (
    normalizedName.length >= 4 &&
    normalizedSearch.includes(
      normalizedName
    )
  ) {
    return 98;
  }

  /* ---------------------------------------------------------
     PRODUCT SLUG APPEARS INSIDE IMAGE TEXT
  --------------------------------------------------------- */

  if (
    normalizedSlug.length >= 4 &&
    normalizedSearch.includes(
      normalizedSlug
    )
  ) {
    return 98;
  }

  const searchTokens =
    getMatchTokens(
      normalizedSearch
    );

  const productTokens =
    getMatchTokens(
      `${normalizedName} ${normalizedSlug}`
    );

  if (
    !searchTokens.length ||
    !productTokens.length
  ) {
    return 0;
  }

  const searchSet =
    new Set(
      searchTokens
    );

  const productSet =
    new Set(
      productTokens
    );

  const matchingTokens =
    [
      ...productSet,
    ].filter(
      (token) =>
        searchSet.has(token)
    );

  if (
    !matchingTokens.length
  ) {
    return 0;
  }

  /*
   * How much of the PRODUCT NAME
   * was found in the uploaded image?
   *
   * Example:
   *
   * Product:
   * Calacatta Viola
   *
   * Image:
   * calacatta viola kitchen
   *
   * 2 / 2 = 100%
   */
  const productCoverage =
    matchingTokens.length /
    productSet.size;

  /*
   * Prevent one generic matching word
   * from producing a strong result.
   */
  let score =
    productCoverage * 90;

  /*
   * All product words matched.
   */
  if (
    productCoverage === 1
  ) {
    score = 95;
  }

  /*
   * Multiple matching words give
   * additional confidence.
   */
  if (
    matchingTokens.length >= 2
  ) {
    score += 3;
  }

  return Math.min(
    Math.round(score),
    100
  );
};

/* =========================================================
   FIND BEST PRODUCT FOR UPLOADED IMAGE
========================================================= */

const findBestProductMatch = (
  image,
  products
) => {
  /*
   * Combine everything we know about
   * the uploaded image.
   */
  const searchText = [
    image.originalFileName,
    image.title,
    image.imageAlt,
  ]
    .filter(Boolean)
    .join(" ");

  if (
    !searchText.trim()
  ) {
    return null;
  }

  let bestMatch = null;
  let secondBestScore = 0;

  for (
    const product of products
  ) {
    const score =
      calculateProductMatchScore({
        searchText,

        productName:
          product.name,

        productSlug:
          product.slug,
      });

    if (
      !bestMatch ||
      score >
        bestMatch.score
    ) {
      if (bestMatch) {
        secondBestScore =
          bestMatch.score;
      }

      bestMatch = {
        product,
        score,
      };
    } else if (
      score >
      secondBestScore
    ) {
      secondBestScore =
        score;
    }
  }

  if (!bestMatch) {
    return null;
  }

  /*
   * IMPORTANT:
   *
   * Don't auto-link weak guesses.
   */
  const MINIMUM_SCORE =
    75;

  /*
   * Avoid ambiguous matches such as:
   *
   * Calacatta Gold       90
   * Calacatta Gold Extra 88
   *
   * That's too close to safely guess.
   */
  const MINIMUM_LEAD =
    8;

  if (
    bestMatch.score <
    MINIMUM_SCORE
  ) {
    return null;
  }

  if (
    secondBestScore >
      0 &&
    bestMatch.score -
      secondBestScore <
      MINIMUM_LEAD
  ) {
    return null;
  }

  return {
    productId:
      bestMatch.product.id,

    productName:
      bestMatch.product.name,

    productSlug:
      bestMatch.product.slug,

    score:
      bestMatch.score,
  };
};

/* =========================================================
   SAVE UPLOADED IMAGES
   + AUTOMATIC PRODUCT ESTIMATION
========================================================= */

const saveUploadedImages =
  async (body) => {
    const {
      category_id,
      product_id:
        globalProductId,
      images = [],
    } = body;

    const categoryId =
      Number(
        category_id
      );

    if (
      !Number.isInteger(
        categoryId
      ) ||
      categoryId <= 0
    ) {
      throw new Error(
        "Category is required"
      );
    }

    if (
      !Array.isArray(
        images
      ) ||
      !images.length
    ) {
      throw new Error(
        "Images are required"
      );
    }

    /* =====================================================
       VERIFY CATEGORY
    ===================================================== */

    const category =
      await prisma.inspiration_gallery_categories.findUnique({
        where: {
          id:
            categoryId,
        },

        select: {
          id: true,
          name: true,
          slug: true,
        },
      });

    if (!category) {
      throw new Error(
        "Category not found"
      );
    }

    /* =====================================================
       PRODUCT ID PARSER
    ===================================================== */

    const parseProductId =
      (value) => {
        if (
          value ===
            undefined ||
          value === null ||
          value === ""
        ) {
          return null;
        }

        const cleanValue =
          String(
            value
          ).trim();

        if (
          !/^\d+$/.test(
            cleanValue
          )
        ) {
          throw new Error(
            `Invalid product ID: ${cleanValue}`
          );
        }

        return BigInt(
          cleanValue
        );
      };

    const parsedGlobalProductId =
      parseProductId(
        globalProductId
      );

    /* =====================================================
       LOAD PRODUCTS FOR AUTO MATCHING
    ===================================================== */

    /*
     * We only need to load products when
     * an explicit product wasn't supplied.
     */
    const needsAutoMatching =
      parsedGlobalProductId ===
        null ||
      images.some(
        (image) =>
          image.product_id ===
            undefined ||
          image.product_id ===
            null ||
          image.product_id ===
            ""
      );

    let availableProducts =
      [];

    if (
      needsAutoMatching
    ) {
      availableProducts =
        await prisma.stone_products.findMany({
          where: {
            is_active:
              true,

            is_published:
              true,
          },

          select: {
            id: true,
            name: true,
            slug: true,
          },
        });
    }

    /* =====================================================
       PREPARE EACH IMAGE
    ===================================================== */

    const preparedImages =
      images.map(
        (
          image,
          index
        ) => {
          if (
            !image ||
            typeof image !==
              "object"
          ) {
            throw new Error(
              `Invalid image at position ${
                index + 1
              }`
            );
          }

          const imageUrl =
            String(
              image.secure_url ||
                image.image_url ||
                ""
            ).trim();

          if (!imageUrl) {
            throw new Error(
              `Image URL is required at position ${
                index + 1
              }`
            );
          }

          const imageAlt =
            image.image_alt
              ? String(
                  image.image_alt
                ).trim()
              : null;

          const title =
            image.title
              ? String(
                  image.title
                ).trim()
              : null;

          /*
           * IMPORTANT:
           *
           * Frontend will send this.
           */
          const originalFileName =
            image.file_name ||
            image.original_file_name ||
            title ||
            "";

          /* -------------------------------------------------
             EXPLICIT PRODUCT
          ------------------------------------------------- */

          const explicitImageProductId =
            parseProductId(
              image.product_id
            );

          let resolvedProductId =
            explicitImageProductId ??
            parsedGlobalProductId ??
            null;

          let autoMatch =
            null;

          let linkSource =
            resolvedProductId
              ? "manual"
              : null;

          /* -------------------------------------------------
             AUTO ESTIMATE PRODUCT
          ------------------------------------------------- */

          if (
            resolvedProductId ===
            null
          ) {
            autoMatch =
              findBestProductMatch(
                {
                  originalFileName,
                  title,
                  imageAlt,
                },
                availableProducts
              );

            if (
              autoMatch
            ) {
              resolvedProductId =
                autoMatch.productId;

              linkSource =
                "automatic";
            }
          }

          return {
            imageUrl,
            imageAlt,
            title,
            originalFileName,

            productId:
              resolvedProductId,

            autoMatch,

            linkSource,
          };
        }
      );

    /* =====================================================
       VERIFY MANUALLY SUPPLIED PRODUCTS
    ===================================================== */

    const productIds =
      [
        ...new Map(
          preparedImages
            .filter(
              (image) =>
                image.productId !==
                null
            )
            .map(
              (image) => [
                image.productId.toString(),
                image.productId,
              ]
            )
        ).values(),
      ];

    if (
      productIds.length
    ) {
      const existingProducts =
        await prisma.stone_products.findMany({
          where: {
            id: {
              in:
                productIds,
            },
          },

          select: {
            id: true,
          },
        });

      if (
        existingProducts.length !==
        productIds.length
      ) {
        throw new Error(
          "One or more products were not found"
        );
      }
    }

    /* =====================================================
       CREATE IMAGES + LINKS
    ===================================================== */

    const createdImages =
      await prisma.$transaction(
        async (tx) => {
          const results =
            [];

          for (
            const image of
            preparedImages
          ) {
            const createdImage =
              await tx.inspiration_gallery_images.create({
                data: {
                  category_id:
                    categoryId,

                  /*
                   * Keep legacy field
                   * synchronized.
                   */
                  product_id:
                    image.productId,

                  image_url:
                    image.imageUrl,

                  image_alt:
                    image.imageAlt,

                  title:
                    image.title,

                  sort_order:
                    0,

                  is_active:
                    true,
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
                  is_active:
                    true,
                  created_at:
                    true,
                },
              });

            /* =============================================
               CREATE AUTO/MANUAL PRODUCT LINK
            ============================================= */

            if (
              image.productId !==
              null
            ) {
              await tx.inspiration_gallery_image_products.create({
                data: {
                  image_id:
                    createdImage.id,

                  product_id:
                    image.productId,
                },
              });
            }

            results.push({
              ...createdImage,

              autoMatch:
                image.autoMatch,

              linkSource:
                image.linkSource,
            });
          }

          return results;
        }
      );

  /* =====================================================
   RESPONSE
===================================================== */

return {
  count: createdImages.length,

  images: createdImages.map(
    (image) => {
      /*
       * Remove internal fields before serialization.
       *
       * autoMatch contains productId as BigInt,
       * so it must NOT be spread directly into
       * the API response.
       */
      const {
        autoMatch,
        linkSource,
        ...galleryImage
      } = image;

      return {
        ...serializeGalleryImage(
          galleryImage
        ),

        product_linked:
          galleryImage.product_id !==
            null &&
          galleryImage.product_id !==
            undefined,

        link_source:
          linkSource,

        auto_match:
          autoMatch
            ? {
                product_id:
                  autoMatch.productId.toString(),

                product_name:
                  autoMatch.productName,

                product_slug:
                  autoMatch.productSlug,

                score:
                  autoMatch.score,
              }
            : null,
      };
    }
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