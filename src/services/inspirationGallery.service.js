const prisma = require("../config/prisma");
const { uploadToR2, deleteFileFromR2 } = require("../utils/uploadToR2");

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
    orderBy: {
      sort_order: "asc",
    },
    include: {
      inspiration_gallery_images: {
        where: {
          is_active: true,
        },
        orderBy: {
          sort_order: "asc",
        },
      },
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

const getImages = async (categoryId) => {
  const where = {
    is_active: true,
  };

  if (categoryId) {
    where.category_id = Number(categoryId);
  }

  return prisma.inspiration_gallery_images.findMany({
    where,
    include: {
      inspiration_gallery_categories: true,
    },
    orderBy: {
      sort_order: "asc",
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

const uploadImages = async (body, files = []) => {
  const categoryId = Number(body.category_id);

  if (!categoryId) {
    throw new Error("Category is required");
  }

  if (!files.length) {
    throw new Error("Please select image(s)");
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

  const uploadedImages = [];

  for (const file of files) {
    const uploaded = await uploadToR2(file, folder);

    const savedImage = await prisma.inspiration_gallery_images.create({
      data: {
        category_id: categoryId,
        image_url: uploaded.secure_url,
        image_alt: body.image_alt || category.name,
        title: body.title || null,
        sort_order: 0,
      },
    });

    uploadedImages.push(savedImage);
  }

  return uploadedImages;
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
  uploadImages,
  deleteImage,
};