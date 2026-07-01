const prisma = require("../config/prisma");
const { uploadToR2 } = require("../utils/uploadToR2");

// ================== CREATE PAGE ==================

const createPage = async (data) => {

  const existingPage = await prisma.pages.findUnique({
    where: {
      slug: data.slug
    }
  });

  if (existingPage) {
    throw new Error("Page slug already exists");
  }

  return await prisma.pages.create({

    data: {

      slug: data.slug,

      title: data.title,

      content: data.content,

      status: data.status || "draft",

      page_seo: {

        create: {

          meta_title: data.seo?.meta_title,

          meta_description: data.seo?.meta_description,

          canonical_url: data.seo?.canonical_url,

          og_title: data.seo?.og_title,

          og_image_url: data.seo?.og_image_url,

          og_description: data.seo?.og_description,

          robots_index: data.seo?.robots_index || "index",

          robots_follow: data.seo?.robots_follow || "follow",

          schema_markup: data.seo?.schema_markup || {},

          seo_content: data.seo?.seo_content

        }

      }

    },

    include: {

      page_seo: true

    }

  });

};

// ================== UPDATE PAGE ==================

const updatePage = async (id, data) => {

  return await prisma.pages.update({

    where: {
      id: Number(id)
    },

    data: {

      slug: data.slug,

      title: data.title,

      content: data.content,

      status: data.status,

      page_seo: {

        upsert: {

          create: {

            meta_title: data.seo?.meta_title,

            meta_description: data.seo?.meta_description,

            canonical_url: data.seo?.canonical_url,

            og_title: data.seo?.og_title,

            og_image_url: data.seo?.og_image_url,

            og_description: data.seo?.og_description,

            robots_index: data.seo?.robots_index || "index",

            robots_follow: data.seo?.robots_follow || "follow",

            schema_markup: data.seo?.schema_markup || {},

            seo_content: data.seo?.seo_content

          },

          update: {

            meta_title: data.seo?.meta_title,

            meta_description: data.seo?.meta_description,

            canonical_url: data.seo?.canonical_url,

            og_title: data.seo?.og_title,

            og_image_url: data.seo?.og_image_url,

            og_description: data.seo?.og_description,

            robots_index: data.seo?.robots_index,

            robots_follow: data.seo?.robots_follow,

            schema_markup: data.seo?.schema_markup,

            seo_content: data.seo?.seo_content

          }

        }

      }

    },

    include: {

      page_seo: true

    }

  });

};

// ================== GET PAGE BY SLUG ==================

const getPageBySlug = async (slug) => {

  return await prisma.pages.findFirst({

    where: {

      slug,

      status: "published"

    },

    include: {

      page_seo: true

    }

  });

};

// ================== DELETE PAGE ==================

const deletePage = async (id) => {

  return await prisma.pages.delete({

    where: {

      id: Number(id)

    }

  });

};

const uploadPageImage = async (file) => {

  if (!file) {
    throw new Error("Image is required");
  }

  const uploadedImage = await uploadToR2(
    file,
    "cms-pages",
    "image"
  );

  return uploadedImage;

};

module.exports = {

  createPage,

  updatePage,

  getPageBySlug,

  deletePage,

  uploadPageImage,

};