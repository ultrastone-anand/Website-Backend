const prisma = require(
  "../config/prisma"
);

const {
  deleteFileFromR2,
} = require("../utils/uploadToR2");

const {
  createR2UploadUrl,
} = require("../utils/r2Presigned");

// ----------------------------------------------------------------------

const slugify = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "")
    .replace(/--+/g, "-");

// ----------------------------------------------------------------------

const parseBigIntId = (
  value,
  fieldName
) => {
  try {
    if (
      value === undefined ||
      value === null ||
      String(value).trim() === ""
    ) {
      throw new Error();
    }

    const parsedValue = BigInt(value);

    if (parsedValue <= 0n) {
      throw new Error();
    }

    return parsedValue;
  } catch {
    throw new Error(
      `Valid ${fieldName} is required`
    );
  }
};

// ----------------------------------------------------------------------

const getR2ObjectKey = (url) => {
  const publicUrl = String(
    process.env.R2_PUBLIC_URL || ""
  ).replace(/\/$/, "");

  if (!url || !publicUrl) {
    return "";
  }

  const normalizedUrl =
    String(url).trim();

  const prefix = `${publicUrl}/`;

  if (
    !normalizedUrl.startsWith(prefix)
  ) {
    return "";
  }

  return normalizedUrl.slice(
    prefix.length
  );
};

// ----------------------------------------------------------------------

const validateImages = (images) => {
  if (!Array.isArray(images)) {
    throw new Error(
      "Images must be an array"
    );
  }

  images.forEach((image, index) => {
    if (!image?.secure_url) {
      throw new Error(
        `Image URL is required for image ${
          index + 1
        }`
      );
    }
  });
};

// ----------------------------------------------------------------------
// GET PRODUCT LOTS
// ----------------------------------------------------------------------

const getProductLots = async (
  productId
) => {
  const parsedProductId =
    parseBigIntId(
      productId,
      "product ID"
    );

  const product =
    await prisma.stone_products.findUnique(
      {
        where: {
          id: parsedProductId,
        },
        select: {
          id: true,
          name: true,
          slug: true,
        },
      }
    );

  if (!product) {
    throw new Error(
      "Product not found"
    );
  }

  /*
   * Separate queries are used so this code does not depend
   * on whatever relation field names Prisma generated
   * after running prisma db pull.
   */
  const lots =
    await prisma.stone_product_lots.findMany(
      {
        where: {
          product_id: parsedProductId,
          is_active: true,
        },
        orderBy: [
          {
            display_order: "asc",
          },
          {
            id: "asc",
          },
        ],
      }
    );

  if (!lots.length) {
    return {
      product,
      lots: [],
      count: 0,
    };
  }

  const lotIds = lots.map(
    (lot) => lot.id
  );

  const images =
    await prisma.stone_product_lot_images.findMany(
      {
        where: {
          lot_id: {
            in: lotIds,
          },
          is_active: true,
        },
        orderBy: [
          {
            display_order: "asc",
          },
          {
            id: "asc",
          },
        ],
      }
    );

  const imagesByLot = new Map();

  images.forEach((image) => {
    const key =
      image.lot_id.toString();

    if (!imagesByLot.has(key)) {
      imagesByLot.set(key, []);
    }

    imagesByLot
      .get(key)
      .push(image);
  });

  const formattedLots = lots.map(
    (lot) => ({
      ...lot,
      images:
        imagesByLot.get(
          lot.id.toString()
        ) || [],
    })
  );

  return {
    product,
    lots: formattedLots,
    count: formattedLots.length,
  };
};

// ----------------------------------------------------------------------
// CREATE PRESIGNED R2 URLS
// ----------------------------------------------------------------------

const createLotImageUploadUrls =
  async (body) => {
    const {
      product_id,
      lot_name,
      files = [],
    } = body;

    const productId = parseBigIntId(
      product_id,
      "product ID"
    );

    const lotName = String(
      lot_name || ""
    ).trim();

    if (!lotName) {
      throw new Error(
        "Lot name is required"
      );
    }

    if (!Array.isArray(files)) {
      throw new Error(
        "Files must be an array"
      );
    }

    if (!files.length) {
      throw new Error(
        "Files are required"
      );
    }

    const product =
      await prisma.stone_products.findUnique(
        {
          where: {
            id: productId,
          },
          select: {
            id: true,
            name: true,
            slug: true,
          },
        }
      );

    if (!product) {
      throw new Error(
        "Product not found"
      );
    }

    const productFolder =
      slugify(product.slug || product.name);

    const lotFolder =
      slugify(lotName);

    const folder = [
      "Products",
      "Lot Images",
      productFolder,
      lotFolder,
    ].join("/");

    return Promise.all(
      files.map((file) => {
        if (!file?.fileName) {
          throw new Error(
            "Every file must include fileName"
          );
        }

        return createR2UploadUrl(
          file.fileName,
          folder,
          file.contentType
        );
      })
    );
  };

// ----------------------------------------------------------------------
// SAVE NEW LOT OR APPEND IMAGES
// ----------------------------------------------------------------------

const saveLotImages = async (
  body
) => {
  const {
    product_id,
    lot_id,
    lot_name,
    images = [],
  } = body;

  const productId = parseBigIntId(
    product_id,
    "product ID"
  );

  const lotName = String(
    lot_name || ""
  ).trim();

  if (!lotName) {
    throw new Error(
      "Lot name is required"
    );
  }

  validateImages(images);

  const product =
    await prisma.stone_products.findUnique(
      {
        where: {
          id: productId,
        },
        select: {
          id: true,
        },
      }
    );

  if (!product) {
    throw new Error(
      "Product not found"
    );
  }

  let existingLot = null;

  /*
   * When lot_id is provided, add images to that specific lot.
   */
  if (lot_id) {
    const lotId = parseBigIntId(
      lot_id,
      "lot ID"
    );

    existingLot =
      await prisma.stone_product_lots.findFirst(
        {
          where: {
            id: lotId,
            product_id: productId,
          },
        }
      );

    if (!existingLot) {
      throw new Error(
        "Lot not found"
      );
    }
  } else {
    /*
     * This supports the product_id + lot_name unique
     * constraint and avoids creating duplicate lots.
     */
    existingLot =
      await prisma.stone_product_lots.findFirst(
        {
          where: {
            product_id:
              productId,
            lot_name: lotName,
          },
        }
      );
  }

  const result =
    await prisma.$transaction(
      async (tx) => {
        let lot = existingLot;

        if (!lot) {
          const lastLot =
            await tx.stone_product_lots.findFirst(
              {
                where: {
                  product_id:
                    productId,
                },
                orderBy: {
                  display_order:
                    "desc",
                },
                select: {
                  display_order:
                    true,
                },
              }
            );

          lot =
            await tx.stone_product_lots.create(
              {
                data: {
                  product_id:
                    productId,
                  lot_name:
                    lotName,
                  display_order:
                    (lastLot?.display_order ||
                      0) + 1,
                  is_active: true,
                },
              }
            );
        } else if (
          lot.lot_name !== lotName
        ) {
          const duplicateLot =
            await tx.stone_product_lots.findFirst(
              {
                where: {
                  product_id:
                    productId,
                  lot_name:
                    lotName,
                  NOT: {
                    id: lot.id,
                  },
                },
              }
            );

          if (duplicateLot) {
            throw new Error(
              "A lot with this name already exists for this product"
            );
          }

          lot =
            await tx.stone_product_lots.update(
              {
                where: {
                  id: lot.id,
                },
                data: {
                  lot_name:
                    lotName,
                  updated_at:
                    new Date(),
                },
              }
            );
        }

        const lastImage =
          await tx.stone_product_lot_images.findFirst(
            {
              where: {
                lot_id: lot.id,
              },
              orderBy: {
                display_order:
                  "desc",
              },
              select: {
                display_order:
                  true,
              },
            }
          );

        const startOrder =
          (lastImage?.display_order ||
            0) +
          (lastImage ? 1 : 0);

        if (images.length) {
          await tx.stone_product_lot_images.createMany(
            {
              data: images.map(
                (
                  image,
                  index
                ) => ({
                  lot_id: lot.id,
                  image_url:
                    image.secure_url,
                  public_id:
                    image.public_id ||
                    image.object_key ||
                    null,
                  alt_text:
                    image.alt_text ||
                    null,
                  file_name:
                    image.file_name ||
                    image.fileName ||
                    null,
                  mime_type:
                    image.mime_type ||
                    image.contentType ||
                    null,
                  file_size:
                    image.file_size ||
                    image.size
                      ? BigInt(
                          image.file_size ||
                            image.size
                        )
                      : null,
                  display_order:
                    startOrder +
                    index,
                  is_primary:
                    image.is_primary ===
                    true,
                  is_active: true,
                })
              ),
            }
          );
        }

        const savedImages =
          await tx.stone_product_lot_images.findMany(
            {
              where: {
                lot_id: lot.id,
                is_active: true,
              },
              orderBy: [
                {
                  display_order:
                    "asc",
                },
                {
                  id: "asc",
                },
              ],
            }
          );

        return {
          ...lot,
          images: savedImages,
        };
      }
    );

  return result;
};

// ----------------------------------------------------------------------
// UPDATE LOT NAME
// ----------------------------------------------------------------------

const updateLot = async (
  lotId,
  body
) => {
  const parsedLotId =
    parseBigIntId(
      lotId,
      "lot ID"
    );

  const existingLot =
    await prisma.stone_product_lots.findUnique(
      {
        where: {
          id: parsedLotId,
        },
      }
    );

  if (!existingLot) {
    throw new Error(
      "Lot not found"
    );
  }

  const data = {};

  if (
    body.lot_name !== undefined
  ) {
    const lotName = String(
      body.lot_name || ""
    ).trim();

    if (!lotName) {
      throw new Error(
        "Lot name is required"
      );
    }

    if (lotName.length > 150) {
      throw new Error(
        "Lot name cannot exceed 150 characters"
      );
    }

    const duplicateLot =
      await prisma.stone_product_lots.findFirst(
        {
          where: {
            product_id:
              existingLot.product_id,
            lot_name: lotName,
            NOT: {
              id: parsedLotId,
            },
          },
        }
      );

    if (duplicateLot) {
      throw new Error(
        "A lot with this name already exists for this product"
      );
    }

    data.lot_name = lotName;
  }

  if (
    body.display_order !== undefined
  ) {
    const displayOrder = Number(
      body.display_order
    );

    if (
      !Number.isInteger(
        displayOrder
      ) ||
      displayOrder < 0
    ) {
      throw new Error(
        "Display order must be a non-negative integer"
      );
    }

    data.display_order =
      displayOrder;
  }

  if (
    body.is_active !== undefined
  ) {
    data.is_active =
      Boolean(body.is_active);
  }

  if (!Object.keys(data).length) {
    throw new Error(
      "No valid lot fields were provided"
    );
  }

  data.updated_at = new Date();

  return prisma.stone_product_lots.update(
    {
      where: {
        id: parsedLotId,
      },
      data,
    }
  );
};

// ----------------------------------------------------------------------
// UPDATE LOT IMAGE
// ----------------------------------------------------------------------

const updateLotImage = async (
  imageId,
  body
) => {
  const parsedImageId =
    parseBigIntId(
      imageId,
      "image ID"
    );

  const existingImage =
    await prisma.stone_product_lot_images.findUnique(
      {
        where: {
          id: parsedImageId,
        },
      }
    );

  if (!existingImage) {
    throw new Error(
      "Lot image not found"
    );
  }

  const data = {};

  if (
    body.alt_text !== undefined
  ) {
    const altText = String(
      body.alt_text || ""
    ).trim();

    if (altText.length > 255) {
      throw new Error(
        "Alt text cannot exceed 255 characters"
      );
    }

    data.alt_text =
      altText || null;
  }

  if (
    body.display_order !== undefined
  ) {
    const displayOrder = Number(
      body.display_order
    );

    if (
      !Number.isInteger(
        displayOrder
      ) ||
      displayOrder < 0
    ) {
      throw new Error(
        "Display order must be a non-negative integer"
      );
    }

    data.display_order =
      displayOrder;
  }

  if (
    body.is_primary !== undefined
  ) {
    data.is_primary =
      Boolean(body.is_primary);
  }

  if (
    body.is_active !== undefined
  ) {
    data.is_active =
      Boolean(body.is_active);
  }

  if (!Object.keys(data).length) {
    throw new Error(
      "No valid image fields were provided"
    );
  }

  /*
   * Ensure only one image is primary for a lot.
   */
  if (data.is_primary === true) {
    await prisma.$transaction([
      prisma.stone_product_lot_images.updateMany(
        {
          where: {
            lot_id:
              existingImage.lot_id,
            is_primary: true,
          },
          data: {
            is_primary: false,
            updated_at:
              new Date(),
          },
        }
      ),

      prisma.stone_product_lot_images.update(
        {
          where: {
            id: parsedImageId,
          },
          data: {
            ...data,
            updated_at:
              new Date(),
          },
        }
      ),
    ]);

    return prisma.stone_product_lot_images.findUnique(
      {
        where: {
          id: parsedImageId,
        },
      }
    );
  }

  return prisma.stone_product_lot_images.update(
    {
      where: {
        id: parsedImageId,
      },
      data: {
        ...data,
        updated_at: new Date(),
      },
    }
  );
};

// ----------------------------------------------------------------------
// DELETE ONE IMAGE
// ----------------------------------------------------------------------

const deleteLotImage = async (
  imageId
) => {
  const parsedImageId =
    parseBigIntId(
      imageId,
      "image ID"
    );

  const image =
    await prisma.stone_product_lot_images.findUnique(
      {
        where: {
          id: parsedImageId,
        },
      }
    );

  if (!image) {
    throw new Error(
      "Lot image not found"
    );
  }

  const objectKey =
    image.public_id ||
    getR2ObjectKey(
      image.image_url
    );

  if (objectKey) {
    await deleteFileFromR2(
      objectKey
    );
  }

  return prisma.stone_product_lot_images.delete(
    {
      where: {
        id: parsedImageId,
      },
    }
  );
};

// ----------------------------------------------------------------------
// DELETE COMPLETE LOT
// ----------------------------------------------------------------------

const deleteLot = async (
  lotId
) => {
  const parsedLotId =
    parseBigIntId(
      lotId,
      "lot ID"
    );

  const lot =
    await prisma.stone_product_lots.findUnique(
      {
        where: {
          id: parsedLotId,
        },
      }
    );

  if (!lot) {
    throw new Error(
      "Lot not found"
    );
  }

  const images =
    await prisma.stone_product_lot_images.findMany(
      {
        where: {
          lot_id: parsedLotId,
        },
      }
    );

  /*
   * Delete actual files from R2 before deleting database rows.
   */
  const deletionResults =
    await Promise.allSettled(
      images.map((image) => {
        const objectKey =
          image.public_id ||
          getR2ObjectKey(
            image.image_url
          );

        if (!objectKey) {
          return Promise.resolve();
        }

        return deleteFileFromR2(
          objectKey
        );
      })
    );

  const failedDeletion =
    deletionResults.find(
      (result) =>
        result.status ===
        "rejected"
    );

  if (failedDeletion) {
    console.error(
      "Some R2 lot files could not be deleted:",
      failedDeletion.reason
    );

    throw new Error(
      "Unable to delete one or more lot images from storage"
    );
  }

  /*
   * stone_product_lot_images rows are deleted automatically
   * because the database foreign key uses ON DELETE CASCADE.
   */
  return prisma.stone_product_lots.delete(
    {
      where: {
        id: parsedLotId,
      },
    }
  );
};

// ----------------------------------------------------------------------

module.exports = {
  getProductLots,
  createLotImageUploadUrls,
  saveLotImages,
  updateLot,
  updateLotImage,
  deleteLotImage,
  deleteLot,
};