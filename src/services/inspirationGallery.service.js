const prisma = require("../config/prisma");
const { deleteFileFromR2 } = require("../utils/uploadToR2");
const { createR2UploadUrl } = require("../utils/r2Presigned");

const slugify = (text) =>
  text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "")
    .replace(/--+/g, "-");

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
    throw new Error("Category name is required");
  }

  const slug = slugify(name);

  const existing = await prisma.inspiration_gallery_categories.findUnique({
    where: {
      slug,
    },
  });

  if (existing) {
    throw new Error("Category already exists");
  }

  const lastCategory = await prisma.inspiration_gallery_categories.findFirst({
    orderBy: {
      sort_order: "desc",
    },
  });

  return prisma.inspiration_gallery_categories.create({
    data: {
      name,
      slug,
      sort_order: (lastCategory?.sort_order || 0) + 1,
    },
  });
};

const updateCategory = async (id, body) => {
  const { name, sort_order, is_active } = body;

  const category = await prisma.inspiration_gallery_categories.findUnique({
    where: { id },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  const data = {};

  if (name) {
    const slug = slugify(name);

    const existing = await prisma.inspiration_gallery_categories.findFirst({
      where: {
        slug,
        NOT: {
          id,
        },
      },
    });

    if (existing) {
      throw new Error("Category already exists");
    }

    data.name = name;
    data.slug = slug;
  }

  if (sort_order !== undefined) {
    data.sort_order = Number(sort_order);
  }

  if (is_active !== undefined) {
    data.is_active = Boolean(is_active);
  }

  return prisma.inspiration_gallery_categories.update({
    where: { id },
    data,
  });
};

const deleteCategory = async (id) => {
  const category = await prisma.inspiration_gallery_categories.findUnique({
    where: { id },
    include: {
      inspiration_gallery_images: true,
    },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  const publicUrl = process.env.R2_PUBLIC_URL;

  for (const image of category.inspiration_gallery_images) {
    let objectKey = "";

    if (image.image_url && publicUrl) {
      objectKey = image.image_url.replace(`${publicUrl}/`, "");
    }

    if (objectKey) {
      await deleteFileFromR2(objectKey);
    }
  }

  return prisma.inspiration_gallery_categories.delete({
    where: { id },
  });
};

const getImages = async ({
  categoryId,
  page = 1,
  limit = 20,
}) => {
  const parsedCategoryId = Number(categoryId);

  const safePage = Math.max(
    Number(page) || 1,
    1
  );

  const safeLimit = Math.min(
    Math.max(Number(limit) || 20, 1),
    50
  );

  const skip =
    (safePage - 1) * safeLimit;

  const endIndex =
    skip + safeLimit;

  const imageSelect = {
    id: true,
    category_id: true,
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

  /*
   * A category was selected.
   * Return paginated images for only that category.
   */
  if (parsedCategoryId) {
    const where = {
      is_active: true,
      category_id: parsedCategoryId,
      inspiration_gallery_categories: {
        is: {
          is_active: true,
        },
      },
    };

    const [images, total] =
      await Promise.all([
        prisma.inspiration_gallery_images.findMany({
          where,
          select: imageSelect,
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

    const totalPages = Math.ceil(
      total / safeLimit
    );

    return {
      images,
      pagination: {
        page: safePage,
        limit: safeLimit,
        total,
        totalPages,
        hasMore:
          safePage < totalPages,
      },
    };
  }

  /*
   * No category was selected.
   * Retrieve all active categories.
   */
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

  const categoryIds = categories.map(
    (category) => category.id
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
   * Fetch enough images from every category to construct
   * all round-robin results through the requested page.
   *
   * Example:
   * Page 2, limit 50:
   * skip = 50
   * endIndex = 100
   *
   * The round-robin list is built through item 100,
   * then sliced from 50 to 100.
   */
  const categoryImageGroups =
    await Promise.all(
      categories.map((category) =>
        prisma.inspiration_gallery_images.findMany({
          where: {
            is_active: true,
            category_id: category.id,
          },
          select: imageSelect,
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
          take: endIndex,
        })
      )
    );

  const mixedImages = [];
  let imageIndex = 0;

  while (
    mixedImages.length < endIndex
  ) {
    let imageAdded = false;

    for (
      const categoryImages of
      categoryImageGroups
    ) {
      const image =
        categoryImages[imageIndex];

      if (image) {
        mixedImages.push(image);
        imageAdded = true;
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

  const totalPages = Math.ceil(
    total / safeLimit
  );

  return {
    images: paginatedImages,
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      totalPages,
      hasMore:
        safePage < totalPages,
    },
  };
};

const getImagesBySlug = async (slug) => {
  const normalizedSlug = String(slug || "")
    .trim()
    .toLowerCase();

  if (!normalizedSlug) {
    throw new Error("Product slug is required");
  }

  const images = await prisma.inspiration_gallery_images.findMany({
    where: {
      is_active: true,
      image_url: {
        contains: normalizedSlug,
        mode: "insensitive",
      },
    },
    select: {
      id: true,
      category_id: true,
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
    },
    orderBy: [
      { sort_order: "asc" },
      { created_at: "desc" },
      { id: "desc" },
    ],
  });

  return images.filter((image) => {
    try {
      const pathname = decodeURIComponent(new URL(image.image_url).pathname);
      const filename = pathname.split("/").pop()?.toLowerCase() || "";

      // Removes the upload timestamp and UUID prefix:
      // 1784829523172-3099b783-dafd-4756-be68-adf9bd8feb56-
      const cleanFilename = filename.replace(
        /^\d+-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}-/i,
        ""
      );

      return (
        cleanFilename === normalizedSlug ||
        cleanFilename.startsWith(`${normalizedSlug}-`) ||
        cleanFilename.startsWith(`${normalizedSlug}.`)
      );
    } catch {
      return false;
    }
  });
};

const createImageUploadUrls = async (body) => {
  const { category_id, files = [] } = body;

  const categoryId = Number(category_id);

  if (!categoryId) {
    throw new Error("Category is required");
  }

  if (!files.length) {
    throw new Error("Files are required");
  }

  const category = await prisma.inspiration_gallery_categories.findUnique({
    where: {
      id: categoryId,
    },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  const folder = `Home Page/inspiration galleries/${category.slug}`;

  return Promise.all(
    files.map((file) => createR2UploadUrl(file.fileName, folder))
  );
};

const saveUploadedImages = async (body) => {
  const { category_id, images = [] } = body;

  const categoryId = Number(category_id);

  if (!categoryId) {
    throw new Error("Category is required");
  }

  if (!images.length) {
    throw new Error("Images are required");
  }

  return prisma.inspiration_gallery_images.createMany({
    data: images.map((image) => ({
      category_id: categoryId,
      image_url: image.secure_url,
      image_alt: image.image_alt || null,
      title: image.title || null,
      sort_order: 0,
    })),
  });
};

const deleteImage = async (id) => {
  const image = await prisma.inspiration_gallery_images.findUnique({
    where: {
      id,
    },
  });

  if (!image) {
    throw new Error("Image not found");
  }

  const publicUrl = process.env.R2_PUBLIC_URL;

  let objectKey = "";

  if (image.image_url && publicUrl) {
    objectKey = image.image_url.replace(`${publicUrl}/`, "");
  }

  if (objectKey) {
    await deleteFileFromR2(objectKey);
  }

  return prisma.inspiration_gallery_images.delete({
    where: {
      id,
    },
  });
};

const updateImageAlt = async (id, body) => {
  const imageId = Number(id);
  const imageAlt = body.image_alt?.trim();

  if (!imageId) {
    throw new Error("Valid image ID is required");
  }

  if (!imageAlt) {
    throw new Error("Image alt text is required");
  }

  if (imageAlt.length > 250) {
    throw new Error("Image alt text cannot exceed 250 characters");
  }

  const existingImage =
    await prisma.inspiration_gallery_images.findUnique({
      where: {
        id: imageId,
      },
    });

  if (!existingImage) {
    throw new Error("Gallery media not found");
  }

  return prisma.inspiration_gallery_images.update({
    where: {
      id: imageId,
    },
    data: {
      image_alt: imageAlt,
    },
    select: {
      id: true,
      category_id: true,
      image_url: true,
      image_alt: true,
      title: true,
      sort_order: true,
    },
  });
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,

  getImages,
  getImagesBySlug,
  createImageUploadUrls,
  saveUploadedImages,
  deleteImage,
  updateImageAlt,
};