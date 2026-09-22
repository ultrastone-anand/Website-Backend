const prisma = require("../config/prisma");

const SITE_URL = "https://www.ultrastones.com";

/* =========================================================
   HELPERS
========================================================= */

const escapeXml = (value = "") => {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
};

const formatDate = (date) => {
  if (!date) {
    return null;
  }

  try {
    return new Date(date)
      .toISOString()
      .split("T")[0];
  } catch {
    return null;
  }
};

const createUrlEntry = ({
  url,
  lastmod = null,
}) => {
  const lastmodTag = lastmod
    ? `\n    <lastmod>${escapeXml(formatDate(lastmod))}</lastmod>`
    : "";

  return `  <url>
    <loc>${escapeXml(url)}</loc>${lastmodTag}
  </url>`;
};

/* =========================================================
   STATIC PAGES
========================================================= */

const STATIC_PAGES = [
  "/",
  "/categories",
  "/contact",
  "/aboutus",
  "/ourprocess",
  "/blogs",
  "/ceu",
  "/privacy-policy",
  "/career",
  "/gallery",
  "/merchandising-displays",
  "/safety-first",
];

/* =========================================================
   GENERATE SITEMAP
========================================================= */

const generateSitemap = async () => {
  const [
    categories,
    products,
    showrooms,
    blogs,
    careers,
  ] = await Promise.all([
    /* -----------------------------------------------------
       CATEGORIES
    ----------------------------------------------------- */

    prisma.stone_categories.findMany({
      where: {
        is_active: true,
      },

      select: {
        slug: true,
        updated_at: true,
      },

      orderBy: {
        id: "asc",
      },
    }),

    /* -----------------------------------------------------
       PRODUCTS
    ----------------------------------------------------- */

    prisma.stone_products.findMany({
      where: {
        is_active: true,
        is_published: true,

        OR: [
          {
            stone_product_seo: null,
          },
          {
            stone_product_seo: {
              is: {
                robots_index: true,
              },
            },
          },
        ],
      },

      select: {
        slug: true,
        updated_at: true,

        stone_categories: {
          select: {
            slug: true,
          },
        },
      },

      orderBy: {
        id: "asc",
      },
    }),

    /* -----------------------------------------------------
       SHOWROOMS / LOCATIONS
    ----------------------------------------------------- */

    prisma.showrooms.findMany({
      where: {
        is_active: true,
      },

      select: {
        slug: true,
        updated_at: true,
      },

      orderBy: {
        id: "asc",
      },
    }),

    /* -----------------------------------------------------
       BLOGS
    ----------------------------------------------------- */

    prisma.blog_posts.findMany({
      where: {
        status: "PUBLISHED",
        deleted_at: null,
      },

      select: {
        slug: true,
        updated_at: true,
        published_at: true,
      },

      orderBy: {
        published_at: "desc",
      },
    }),

    /* -----------------------------------------------------
       CAREERS
    ----------------------------------------------------- */

    prisma.career_jobs.findMany({
      where: {
        status: "PUBLISHED",

        OR: [
          {
            robots_index: true,
          },
          {
            robots_index: null,
          },
        ],
      },

      select: {
        slug: true,
        updated_at: true,
        published_at: true,
      },

      orderBy: {
        published_at: "desc",
      },
    }),
  ]);

  /* =======================================================
     BUILD URL COLLECTION
  ======================================================= */

  const urls = [];

  /* -------------------------------------------------------
     STATIC
  ------------------------------------------------------- */

  STATIC_PAGES.forEach((path) => {
    urls.push({
      url:
        path === "/"
          ? `${SITE_URL}/`
          : `${SITE_URL}${path}`,
    });
  });

  /* -------------------------------------------------------
     CATEGORIES
  ------------------------------------------------------- */

  categories.forEach((category) => {
    urls.push({
      url:
        `${SITE_URL}/product-category/${category.slug}`,

      lastmod:
        category.updated_at,
    });
  });

  /* -------------------------------------------------------
     PRODUCTS
  ------------------------------------------------------- */

  products.forEach((product) => {
    const categorySlug =
      product.stone_categories?.slug;

    if (
      !categorySlug ||
      !product.slug
    ) {
      return;
    }

    urls.push({
      url:
        `${SITE_URL}/product/${categorySlug}/${product.slug}`,

      lastmod:
        product.updated_at,
    });
  });

  /* -------------------------------------------------------
     LOCATIONS
  ------------------------------------------------------- */

  showrooms.forEach((showroom) => {
    urls.push({
      url:
        `${SITE_URL}/locations/${showroom.slug}`,

      lastmod:
        showroom.updated_at,
    });
  });

  /* -------------------------------------------------------
     BLOGS
  ------------------------------------------------------- */

  blogs.forEach((blog) => {
    urls.push({
      url:
        `${SITE_URL}/blog/${blog.slug}`,

      lastmod:
        blog.updated_at ||
        blog.published_at,
    });
  });

  /* -------------------------------------------------------
     CAREERS
  ------------------------------------------------------- */

  careers.forEach((career) => {
    urls.push({
      url:
        `${SITE_URL}/careers/${career.slug}`,

      lastmod:
        career.updated_at ||
        career.published_at,
    });
  });

  /* =======================================================
     REMOVE DUPLICATES
  ======================================================= */

  const uniqueUrls = Array.from(
    new Map(
      urls.map((item) => [
        item.url,
        item,
      ])
    ).values()
  );

  /* =======================================================
     BUILD XML
  ======================================================= */

  const xmlEntries =
    uniqueUrls
      .map(createUrlEntry)
      .join("\n\n");

  const xml =
`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlEntries}
</urlset>`;

  return {
    xml,
    count: uniqueUrls.length,
  };
};

module.exports = {
  generateSitemap,
};