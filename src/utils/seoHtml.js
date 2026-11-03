// src/utils/seoHtml.js

const SITE_URL = "https://www.ultrastones.com";

/* =========================================================
   HTML ESCAPING
========================================================= */

function escapeHtml(value = "") {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

/* =========================================================
   VALUE VALIDATION
========================================================= */

function valid(value) {
  if (value === null || value === undefined) {
    return false;
  }

  if (typeof value !== "string") {
    return Boolean(value);
  }

  const normalized = value.trim().toLowerCase();

  return (
    normalized !== "" &&
    normalized !== "test" &&
    normalized !== "{}" &&
    normalized !== "null" &&
    normalized !== "undefined"
  );
}

/* =========================================================
   URL VALIDATION
========================================================= */

function safeUrl(value) {
  if (!valid(value)) {
    return "";
  }

  try {
    const url = new URL(String(value).trim());

    if (
      url.protocol !== "https:" &&
      url.protocol !== "http:"
    ) {
      return "";
    }

    return url.href;
  } catch {
    return "";
  }
}

/* =========================================================
   CANONICAL URL GENERATION
========================================================= */

function getCanonicalUrl(product, reqPath = "") {
  const databaseCanonical = safeUrl(
    product?.seo?.canonical_url
  );

  if (databaseCanonical) {
    const url = new URL(databaseCanonical);

    url.search = "";
    url.hash = "";

    return url.href;
  }

  const categorySlug =
    product?.stone_categories?.slug;

  const productSlug = product?.slug;

  if (categorySlug && productSlug) {
    return (
      `${SITE_URL}/product/` +
      `${encodeURIComponent(categorySlug)}/` +
      `${encodeURIComponent(productSlug)}`
    );
  }

  const pathname = String(reqPath)
    .split("?")[0]
    .split("#")[0];

  const normalizedPath = pathname.startsWith("/")
    ? pathname
    : `/${pathname}`;

  return `${SITE_URL}${normalizedPath}`;
}

/* =========================================================
   PRODUCT IMAGE SELECTION
========================================================= */

function getImage(product) {
  const media = Array.isArray(product?.media)
    ? product.media
    : [];

  const closeup = media.find(
    (item) =>
      item.media_type === "CLOSEUP_IMAGE" &&
      safeUrl(item.media_url)
  );

  const slab = media.find(
    (item) =>
      item.media_type === "SLAB_IMAGE" &&
      safeUrl(item.media_url)
  );

  const fallback = media.find(
    (item) => safeUrl(item.media_url)
  );

  return (
    safeUrl(closeup?.media_url) ||
    safeUrl(slab?.media_url) ||
    safeUrl(fallback?.media_url) ||
    ""
  );
}

/* =========================================================
   SAFE JSON-LD SERIALIZATION
========================================================= */

function serializeJsonLd(data) {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

/* =========================================================
   CUSTOM JSON-LD VALIDATION
========================================================= */

function getValidSchemaMarkup(schemaMarkup) {
  if (!valid(schemaMarkup)) {
    return "";
  }

  try {
    const parsed =
      typeof schemaMarkup === "string"
        ? JSON.parse(schemaMarkup)
        : schemaMarkup;

    if (
      parsed === null ||
      typeof parsed !== "object" ||
      Object.keys(parsed).length === 0
    ) {
      return "";
    }

    return serializeJsonLd(parsed);
  } catch (error) {
    console.warn(
      "[SEO] Invalid JSON-LD schema:",
      error.message
    );

    return "";
  }
}

/* =========================================================
   AUTOMATIC PRODUCT STRUCTURED DATA
========================================================= */

function buildProductSchema(
  product,
  canonical,
  description,
  image
) {
  const category =
    product.stone_categories?.name ||
    product.stone_categories?.category_name ||
    product.stone_categories?.slug ||
    product.stone_group ||
    "";

  const sku =
    product.product_code ||
    product.sku ||
    product.code ||
    "";

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",

    "@id": `${canonical}#product`,

    name: String(product.name || "").trim(),

    url: canonical,

    brand: {
      "@type": "Brand",
      name: "Ultra Stones"
    }
  };

  if (valid(description)) {
    schema.description = String(description).trim();
  }

  if (image) {
    schema.image = [image];
  }

  if (valid(category)) {
    schema.category = String(category).trim();
  }

  if (valid(sku)) {
    schema.sku = String(sku).trim();
  }

  return serializeJsonLd(schema);
}

/* =========================================================
   CHECK WHETHER CUSTOM SCHEMA ALREADY CONTAINS PRODUCT
========================================================= */

function containsProductSchema(schemaMarkup) {
  if (!schemaMarkup) {
    return false;
  }

  try {
    const parsed = JSON.parse(schemaMarkup);

    function check(node) {
      if (!node || typeof node !== "object") {
        return false;
      }

      if (Array.isArray(node)) {
        return node.some(check);
      }

      const types = Array.isArray(node["@type"])
        ? node["@type"]
        : [node["@type"]];

      if (
        types.some(
          (type) =>
            type === "Product" ||
            type === "https://schema.org/Product"
        )
      ) {
        return true;
      }

      return Object.values(node).some(check);
    }

    return check(parsed);
  } catch {
    return false;
  }
}

/* =========================================================
   PRODUCT SEO GENERATION
========================================================= */

function buildProductSeo(product, reqPath = "") {
  if (!product) {
    throw new Error(
      "Product data is required for SEO generation."
    );
  }

  const seo = product.seo || {};

  /* -------------------------------------------------------
     TITLE
  ------------------------------------------------------- */

  const title = valid(seo.meta_title)
    ? seo.meta_title
    : `${product.name} | Ultra Stones`;

  /* -------------------------------------------------------
     DESCRIPTION
  ------------------------------------------------------- */

  const description = valid(seo.meta_description)
    ? seo.meta_description
    : valid(product.small_description)
      ? product.small_description
      : valid(product.long_description)
        ? product.long_description.slice(0, 160)
        : "Explore premium natural and engineered stone surfaces by Ultra Stones.";

  /* -------------------------------------------------------
     CANONICAL
  ------------------------------------------------------- */

  const canonical = getCanonicalUrl(
    product,
    reqPath
  );

  /* -------------------------------------------------------
     OPEN GRAPH
  ------------------------------------------------------- */

  const ogTitle = valid(seo.og_title)
    ? seo.og_title
    : title;

  const ogDescription = valid(seo.og_description)
    ? seo.og_description
    : description;

  const image =
    safeUrl(seo.og_image) ||
    getImage(product);

  /* -------------------------------------------------------
     ROBOTS
  ------------------------------------------------------- */

  const robotsIndex =
    seo.robots_index === false
      ? "noindex"
      : "index";

  const robotsFollow =
    seo.robots_follow === false
      ? "nofollow"
      : "follow";

  const robots =
    `${robotsIndex}, ${robotsFollow}`;

  /* -------------------------------------------------------
     CUSTOM STRUCTURED DATA
  ------------------------------------------------------- */

  const customSchema = getValidSchemaMarkup(
    seo.schema_markup
  );

  /* -------------------------------------------------------
     AUTOMATIC PRODUCT STRUCTURED DATA
  ------------------------------------------------------- */

  const hasCustomProductSchema =
    containsProductSchema(customSchema);

  const automaticProductSchema =
    hasCustomProductSchema
      ? ""
      : buildProductSchema(
          product,
          canonical,
          description,
          image
        );

  /* -------------------------------------------------------
     COMBINE STRUCTURED DATA
  ------------------------------------------------------- */

  const schemaMarkup = [
    customSchema,
    automaticProductSchema
  ]
    .filter(Boolean)
    .map(
      (schema) =>
        `<script type="application/ld+json">${schema}</script>`
    )
    .join("\n");

  /* -------------------------------------------------------
     GENERATE SEO HTML
  ------------------------------------------------------- */

  return `
<!-- =====================================================
     ULTRA STONES - PRODUCT SEO
===================================================== -->

<title>${escapeHtml(title)}</title>

<meta
  name="description"
  content="${escapeHtml(description)}"
/>

<meta
  name="robots"
  content="${escapeHtml(robots)}"
/>

<link
  rel="canonical"
  href="${escapeHtml(canonical)}"
/>

<!-- =====================================================
     OPEN GRAPH
===================================================== -->

<meta
  property="og:type"
  content="product"
/>

<meta
  property="og:title"
  content="${escapeHtml(ogTitle)}"
/>

<meta
  property="og:description"
  content="${escapeHtml(ogDescription)}"
/>

<meta
  property="og:url"
  content="${escapeHtml(canonical)}"
/>

${
  image
    ? `<meta
  property="og:image"
  content="${escapeHtml(image)}"
/>`
    : ""
}

<!-- =====================================================
     TWITTER / X
===================================================== -->

<meta
  name="twitter:card"
  content="summary_large_image"
/>

<meta
  name="twitter:title"
  content="${escapeHtml(ogTitle)}"
/>

<meta
  name="twitter:description"
  content="${escapeHtml(ogDescription)}"
/>

${
  image
    ? `<meta
  name="twitter:image"
  content="${escapeHtml(image)}"
/>`
    : ""
}

<!-- =====================================================
     PRODUCT STRUCTURED DATA
===================================================== -->

${schemaMarkup}

<!-- =====================================================
     END PRODUCT SEO
===================================================== -->
`;
}

/* =========================================================
   REMOVE EXISTING SEO TAGS
========================================================= */

function removeExistingSeo(html) {
  let cleanHtml = html;

  /* -------------------------------------------------------
     REMOVE TITLE
  ------------------------------------------------------- */

  cleanHtml = cleanHtml.replace(
    /<title\b[^>]*>[\s\S]*?<\/title\s*>/gi,
    ""
  );

  /* -------------------------------------------------------
     REMOVE META DESCRIPTION
  ------------------------------------------------------- */

  cleanHtml = cleanHtml.replace(
    /<meta\b(?=[^>]*\bname\s*=\s*["']description["'])[^>]*>/gi,
    ""
  );

  /* -------------------------------------------------------
     REMOVE ROBOTS
  ------------------------------------------------------- */

  cleanHtml = cleanHtml.replace(
    /<meta\b(?=[^>]*\bname\s*=\s*["']robots["'])[^>]*>/gi,
    ""
  );

  /* -------------------------------------------------------
     REMOVE CANONICAL
  ------------------------------------------------------- */

  cleanHtml = cleanHtml.replace(
    /<link\b(?=[^>]*\brel\s*=\s*["']canonical["'])[^>]*>/gi,
    ""
  );

  /* -------------------------------------------------------
     REMOVE OPEN GRAPH
  ------------------------------------------------------- */

  cleanHtml = cleanHtml.replace(
    /<meta\b(?=[^>]*\bproperty\s*=\s*["']og:[^"']*["'])[^>]*>/gi,
    ""
  );

  /* -------------------------------------------------------
     REMOVE TWITTER META
  ------------------------------------------------------- */

  cleanHtml = cleanHtml.replace(
    /<meta\b(?=[^>]*\bname\s*=\s*["']twitter:[^"']*["'])[^>]*>/gi,
    ""
  );

  return cleanHtml;
}

/* =========================================================
   INJECT PRODUCT SEO INTO HTML
========================================================= */

function injectSeo(html, seoTags) {
  if (!html || typeof html !== "string") {
    throw new Error(
      "Valid HTML template is required."
    );
  }

  if (!seoTags || typeof seoTags !== "string") {
    throw new Error(
      "Valid SEO tags are required."
    );
  }

  const cleanHtml = removeExistingSeo(html);

  if (!/<\/head\s*>/i.test(cleanHtml)) {
    throw new Error(
      "HTML template is missing closing head tag."
    );
  }

  return cleanHtml.replace(
    /<\/head\s*>/i,
    `${seoTags}\n</head>`
  );
}

/* =========================================================
   EXPORTS
========================================================= */

module.exports = {
  buildProductSeo,
  injectSeo
};