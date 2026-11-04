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
   CANONICAL URL GENERATION - PRODUCT
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
   CANONICAL URL GENERATION - BLOG
========================================================= */

function getBlogCanonicalUrl(blog) {
  if (!valid(blog?.slug)) {
    throw new Error(
      "Blog slug is required for SEO generation."
    );
  }

  return (
    `${SITE_URL}/blog/` +
    encodeURIComponent(String(blog.slug).trim())
  );
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
   BLOG IMAGE SELECTION
========================================================= */

function getBlogImage(blog) {
  const coverUrl = safeUrl(
    blog?.cover?.url
  );

  if (coverUrl) {
    return coverUrl;
  }

  const contentMedia = Array.isArray(
    blog?.content_media
  )
    ? blog.content_media
    : [];

  const firstImage = contentMedia.find(
    (item) =>
      safeUrl(item?.url) &&
      (
        !item.mime_type ||
        String(item.mime_type).startsWith("image/")
      )
  );

  return safeUrl(firstImage?.url) || "";
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
   CHECK WHETHER CUSTOM SCHEMA CONTAINS PRODUCT
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
   AUTOMATIC BLOGPOSTING STRUCTURED DATA
========================================================= */

function buildBlogSchema(
  blog,
  canonical,
  description,
  image
) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",

    "@id": `${canonical}#article`,

    headline: String(blog.title || "").trim(),

    description: String(description || "").trim(),

    url: canonical,

    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonical
    },

    publisher: {
      "@type": "Organization",
      name: "Ultra Stones",
      url: SITE_URL
    }
  };

  if (image) {
    schema.image = [image];
  }

  if (blog.published_at) {
    schema.datePublished =
      new Date(blog.published_at).toISOString();
  }

  if (blog.updated_at) {
    schema.dateModified =
      new Date(blog.updated_at).toISOString();
  }

  // Include author only when a real name is available.
  // The existing blog API currently returns author_id,
  // not an author name.

  const authorName =
    blog.author?.name ||
    blog.author_name ||
    "";

  if (valid(authorName)) {
    schema.author = {
      "@type": "Person",
      name: String(authorName).trim()
    };
  }

  return serializeJsonLd(schema);
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
   BLOG SEO GENERATION
========================================================= */

function buildBlogSeo(blog, reqPath = "") {
  if (!blog) {
    throw new Error(
      "Blog data is required for SEO generation."
    );
  }

  /* -------------------------------------------------------
     TITLE
  ------------------------------------------------------- */

  const title = valid(blog.meta_title)
    ? blog.meta_title
    : `${blog.title} | Ultra Stones`;

  /* -------------------------------------------------------
     DESCRIPTION
  ------------------------------------------------------- */

  const description = valid(blog.meta_description)
    ? blog.meta_description
    : valid(blog.description)
      ? blog.description
      : "Explore design inspiration, stone applications, and expert insights from Ultra Stones.";

  /* -------------------------------------------------------
     CANONICAL
  ------------------------------------------------------- */

  const canonical = getBlogCanonicalUrl(blog);

  /* -------------------------------------------------------
     IMAGE
  ------------------------------------------------------- */

  const image = getBlogImage(blog);

  const imageAlt =
    blog.cover?.alt_text ||
    blog.title ||
    "Ultra Stones Blog";

  /* -------------------------------------------------------
     BLOG STRUCTURED DATA
  ------------------------------------------------------- */

  const schemaMarkup = buildBlogSchema(
    blog,
    canonical,
    description,
    image
  );

  /* -------------------------------------------------------
     GENERATE SEO HTML
  ------------------------------------------------------- */

  return `
<!-- =====================================================
     ULTRA STONES - BLOG SEO
===================================================== -->

<title>${escapeHtml(title)}</title>

<meta
  name="description"
  content="${escapeHtml(description)}"
/>

<meta
  name="robots"
  content="index, follow, max-image-preview:large"
/>

<link
  rel="canonical"
  href="${escapeHtml(canonical)}"
/>

<!-- =====================================================
     OPEN GRAPH - ARTICLE
===================================================== -->

<meta
  property="og:type"
  content="article"
/>

<meta
  property="og:locale"
  content="en_US"
/>

<meta
  property="og:site_name"
  content="Ultra Stones"
/>

<meta
  property="og:title"
  content="${escapeHtml(title)}"
/>

<meta
  property="og:description"
  content="${escapeHtml(description)}"
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
/>

<meta
  property="og:image:alt"
  content="${escapeHtml(imageAlt)}"
/>`
    : ""
}

${
  blog.published_at
    ? `<meta
  property="article:published_time"
  content="${escapeHtml(blog.published_at)}"
/>`
    : ""
}

${
  blog.updated_at
    ? `<meta
  property="article:modified_time"
  content="${escapeHtml(blog.updated_at)}"
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
  content="${escapeHtml(title)}"
/>

<meta
  name="twitter:description"
  content="${escapeHtml(description)}"
/>

${
  image
    ? `<meta
  name="twitter:image"
  content="${escapeHtml(image)}"
/>

<meta
  name="twitter:image:alt"
  content="${escapeHtml(imageAlt)}"
/>`
    : ""
}

<!-- =====================================================
     BLOGPOSTING STRUCTURED DATA
===================================================== -->

<script type="application/ld+json">${schemaMarkup}</script>

<!-- =====================================================
     END BLOG SEO
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
   INJECT SEO INTO HTML
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
   LOCATION SEO HELPERS
========================================================= */

function getLocationCanonicalUrl(location) {
  if (!valid(location?.slug)) {
    throw new Error(
      "Location slug is required for SEO generation."
    );
  }

  return `${SITE_URL}/locations/${encodeURIComponent(
    String(location.slug).trim()
  )}`;
}

function getLocationImage(location) {
  return (
    safeUrl(location.banner_image_url) ||
    safeUrl(location.image_url) ||
    ""
  );
}

function getLocationDescription(location) {
  if (valid(location.meta_description)) {
    return String(location.meta_description).trim();
  }

  if (valid(location.short_description)) {
    return String(location.short_description).trim();
  }

  const place = [
    location.city,
    location.state
  ].filter(Boolean).join(", ");

  return (
    `Explore premium natural and engineered stone ` +
    `surfaces at Ultra Stones in ${place || "the USA"}. ` +
    `Discover marble, quartzite, quartz and more.`
  );
}

/* =========================================================
   BUSINESS HOURS PARSER
========================================================= */

function parseLocationHours(value) {
  if (!valid(value)) return null;

  const normalized = String(value).trim();

  if (/closed/i.test(normalized)) {
    return null;
  }

  const match = normalized.match(
    /^(\d{1,2}:\d{2}\s*[AP]M)\s*(?:to|-)\s*(\d{1,2}:\d{2}\s*[AP]M)$/i
  );

  if (!match) return null;

  const to24Hour = (time) => {
    const parts = time.match(
      /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i
    );

    if (!parts) return null;

    let hour = Number(parts[1]);
    const minute = Number(parts[2]);
    const period = parts[3].toUpperCase();

    if (
      hour < 1 ||
      hour > 12 ||
      minute > 59
    ) {
      return null;
    }

    if (period === "AM") {
      hour = hour === 12 ? 0 : hour;
    } else {
      hour = hour === 12 ? 12 : hour + 12;
    }

    return `${String(hour).padStart(2, "0")}:${String(
      minute
    ).padStart(2, "0")}`;
  };

  const opens = to24Hour(match[1]);
  const closes = to24Hour(match[2]);

  if (!opens || !closes) return null;

  return { opens, closes };
}

/* =========================================================
   LOCATION STRUCTURED DATA
========================================================= */

function buildLocationSchema(
  location,
  canonical,
  description,
  image
) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Store",
    "@id": `${canonical}#store`,
    name: `Ultra Stones - ${location.name}`,
    url: canonical,
    description,
    branchOf: {
      "@type": "Organization",
      name: "Ultra Stones",
      url: SITE_URL
    }
  };

  if (valid(location.primary_phone)) {
    schema.telephone = String(
      location.primary_phone
    ).trim();
  }

  if (valid(location.email)) {
    schema.email = String(location.email).trim();
  }

  if (image) {
    schema.image = image;
  }

  const address = {
    "@type": "PostalAddress"
  };

  if (valid(location.address)) {
    address.streetAddress = location.address;
  }

  if (valid(location.city)) {
    address.addressLocality = location.city;
  }

  if (valid(location.state)) {
    address.addressRegion = location.state;
  }

  if (valid(location.zip_code)) {
    address.postalCode = location.zip_code;
  }

  if (valid(location.country)) {
    const country = String(location.country)
      .trim()
      .toUpperCase();

    address.addressCountry =
      country === "USA" ||
      country === "UNITED STATES"
        ? "US"
        : country;
  }

  if (Object.keys(address).length > 1) {
    schema.address = address;
  }

  const latitude = Number(location.latitude);
  const longitude = Number(location.longitude);

  if (
    location.latitude != null &&
    location.longitude != null &&
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180
  ) {
    schema.geo = {
      "@type": "GeoCoordinates",
      latitude,
      longitude
    };
  }

  const hours = [];

  const addHours = (value, days) => {
    const parsed = parseLocationHours(value);

    if (!parsed) return;

    hours.push({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: days,
      opens: parsed.opens,
      closes: parsed.closes
    });
  };

  addHours(
    location.business_hours_mon_fri,
    [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday"
    ]
  );

  addHours(
    location.business_hours_saturday,
    ["Saturday"]
  );

  addHours(
    location.business_hours_sunday,
    ["Sunday"]
  );

  if (hours.length) {
    schema.openingHoursSpecification = hours;
  }

  return serializeJsonLd(schema);
}

/* =========================================================
   LOCATION SEO GENERATION
========================================================= */

function buildLocationSeo(location) {
  if (!location || !valid(location.slug)) {
    throw new Error(
      "Valid location data is required."
    );
  }

  const place = [
    location.city,
    location.state
  ].filter(Boolean).join(", ");

  const title = valid(location.meta_title)
    ? String(location.meta_title).trim()
    : `Natural Stone Showroom in ${place} | Ultra Stones`;

  const description =
    getLocationDescription(location);

  const canonical =
    getLocationCanonicalUrl(location);

  const image = getLocationImage(location);

  const schemaMarkup = buildLocationSchema(
    location,
    canonical,
    description,
    image
  );

  return `
<!-- =====================================================
     ULTRA STONES - LOCATION SEO
===================================================== -->

<title>${escapeHtml(title)}</title>

<meta
  name="description"
  content="${escapeHtml(description)}"
/>

<meta
  name="robots"
  content="index, follow, max-image-preview:large"
/>

<link
  rel="canonical"
  href="${escapeHtml(canonical)}"
/>

<!-- OPEN GRAPH -->

<meta property="og:type" content="website" />
<meta property="og:locale" content="en_US" />
<meta property="og:site_name" content="Ultra Stones" />

<meta
  property="og:title"
  content="${escapeHtml(title)}"
/>

<meta
  property="og:description"
  content="${escapeHtml(description)}"
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

<!-- TWITTER / X -->

<meta
  name="twitter:card"
  content="${image ? "summary_large_image" : "summary"}"
/>

<meta
  name="twitter:title"
  content="${escapeHtml(title)}"
/>

<meta
  name="twitter:description"
  content="${escapeHtml(description)}"
/>

${
  image
    ? `<meta
  name="twitter:image"
  content="${escapeHtml(image)}"
/>`
    : ""
}

<!-- LOCATION STRUCTURED DATA -->

<script type="application/ld+json">${schemaMarkup}</script>

<!-- END LOCATION SEO -->
`;
}


/* =========================================================
   EXPORTS
========================================================= */

module.exports = {
  buildProductSeo,
  buildBlogSeo,
  buildLocationSeo,
  injectSeo
};