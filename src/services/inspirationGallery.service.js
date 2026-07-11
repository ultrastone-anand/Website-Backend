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

const getImages = async ({ categoryId, limit = 20 }) => {
  const parsedCategoryId = Number(categoryId);
  const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 50);

  const imageSelect = {
    id: true,
    category_id: true,
    image_url: true,
    image_alt: true,
    title: true,
    sort_order: true,
    inspiration_gallery_categories: {
      select: {
        id: true,
        name: true,
        slug: true,
      },
    },
  };

  /*
   * Category selected:
   * Return up to 20 images belonging only to that category.
   */
  if (parsedCategoryId) {
    return prisma.inspiration_gallery_images.findMany({
      where: {
        is_active: true,
        category_id: parsedCategoryId,
        inspiration_gallery_categories: {
          is: {
            is_active: true,
          },
        },
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
      take: safeLimit,
    });
  }

  /*
   * No category selected:
   * Fetch active categories first.
   */
  const categories =
    await prisma.inspiration_gallery_categories.findMany({
      where: {
        is_active: true,
      },
      select: {
        id: true,
      },
      orderBy: {
        sort_order: "asc",
      },
    });

  if (!categories.length) {
    return [];
  }

  /*
   * Fetch images separately for every category.
   *
   * We fetch up to safeLimit per category so categories with fewer
   * images do not prevent the final response from reaching 20.
   */
  const categoryImageGroups = await Promise.all(
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
        take: safeLimit,
      })
    )
  );

  /*
   * Round-robin mixing:
   *
   * First image from every category,
   * then second image from every category,
   * then third image, and so on.
   */
  const mixedImages = [];
  let imageIndex = 0;

  while (mixedImages.length < safeLimit) {
    let imageAdded = false;

    for (const categoryImages of categoryImageGroups) {
      const image = categoryImages[imageIndex];

      if (image) {
        mixedImages.push(image);
        imageAdded = true;
      }

      if (mixedImages.length >= safeLimit) {
        break;
      }
    }

    if (!imageAdded) {
      break;
    }

    imageIndex += 1;
  }

  return mixedImages;
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

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getImages,
  createImageUploadUrls,
  saveUploadedImages,
  deleteImage,
};