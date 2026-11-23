
"use strict";

// src/utils/seoHtml.js

const SITE_URL = "https://www.ultrastones.com";

// ============================================================
// COMMON HELPERS
// ============================================================

function escapeHtml(value = "") {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

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

function safeUrl(value) {
  if (!valid(value)) return "";

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

function cleanCanonical(value) {
  const url = safeUrl(value);

  if (!url) return "";

  const parsed = new URL(url);

  parsed.search = "";
  parsed.hash = "";

  return parsed.href;
}

function serializeJsonLd(data) {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

function getValidSchemaMarkup(schemaMarkup) {
  if (!valid(schemaMarkup)) return "";

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

// ============================================================
// SERVER SEO MARKERS
// ============================================================

const SSR_ATTRIBUTE = 'data-ultra-ssr-seo="true"';

const PAGE_SCHEMA_ATTRIBUTE =
  'data-ultra-page-schema="true"';

function schemaScript(schema) {
  return schema
    ? `<script type="application/ld+json" ${SSR_ATTRIBUTE} ${PAGE_SCHEMA_ATTRIBUTE}>${schema}</script>`
    : "";
}

function metaName(name, content) {
  return (
    `<meta name="${escapeHtml(name)}" ` +
    `content="${escapeHtml(content)}" ` +
    `${SSR_ATTRIBUTE} />`
  );
}

function metaProperty(property, content) {
  return (
    `<meta property="${escapeHtml(property)}" ` +
    `content="${escapeHtml(content)}" ` +
    `${SSR_ATTRIBUTE} />`
  );
}

function canonicalTag(url) {
  return (
    `<link rel="canonical" ` +
    `href="${escapeHtml(url)}" ` +
    `${SSR_ATTRIBUTE} />`
  );
}

function titleTag(title) {
  return (
    `<title ${SSR_ATTRIBUTE}>` +
    `${escapeHtml(title)}` +
    `</title>`
  );
}

// ============================================================
// PRODUCT HELPERS
// ============================================================

function getCanonicalUrl(product, reqPath = "") {
  const databaseCanonical = cleanCanonical(
    product?.seo?.canonical_url
  );

  if (databaseCanonical) {
    return databaseCanonical;
  }

  const categorySlug =
    product?.stone_categories?.slug ||
    product?.category_slug;

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
      name: "Ultra Stones",
    },
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

function containsProductSchema(schemaMarkup) {
  if (!schemaMarkup) return false;

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

// ============================================================
// PRODUCT SEO GENERATION
// ============================================================

function buildProductSeo(product, reqPath = "") {
  if (!product) {
    throw new Error(
      "Product data is required for SEO generation."
    );
  }

  const seo = product.seo || {};

  const title = valid(seo.meta_title)
    ? seo.meta_title
    : `${product.name} | Ultra Stones`;

  const description = valid(seo.meta_description)
    ? seo.meta_description
    : valid(product.small_description)
      ? product.small_description
      : valid(product.long_description)
        ? product.long_description.slice(0, 160)
        : "Explore premium natural and engineered stone surfaces by Ultra Stones.";

  const canonical = getCanonicalUrl(
    product,
    reqPath
  );

  const ogTitle = valid(seo.og_title)
    ? seo.og_title
    : title;

  const ogDescription = valid(seo.og_description)
    ? seo.og_description
    : description;

  const image =
    safeUrl(seo.og_image) ||
    getImage(product);

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

  const customSchema = getValidSchemaMarkup(
    seo.schema_markup
  );

  const automaticProductSchema =
    containsProductSchema(customSchema)
      ? ""
      : buildProductSchema(
          product,
          canonical,
          description,
          image
        );

  return `
<!-- ULTRA STONES - PRODUCT SEO -->

${titleTag(title)}

${metaName("description", description)}
${metaName("robots", robots)}

${canonicalTag(canonical)}

${metaProperty("og:type", "product")}
${metaProperty("og:title", ogTitle)}
${metaProperty("og:description", ogDescription)}
${metaProperty("og:url", canonical)}

${image ? metaProperty("og:image", image) : ""}

${metaName("twitter:card", "summary_large_image")}
${metaName("twitter:title", ogTitle)}
${metaName("twitter:description", ogDescription)}

${image ? metaName("twitter:image", image) : ""}

${schemaScript(customSchema)}
${schemaScript(automaticProductSchema)}

<!-- END PRODUCT SEO -->
`;
}

// ============================================================
// BLOG HELPERS
// ============================================================

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

function getBlogImage(blog) {
  const coverUrl = safeUrl(blog?.cover?.url);

  if (coverUrl) return coverUrl;

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
      "@id": canonical,
    },
    publisher: {
      "@type": "Organization",
      name: "Ultra Stones",
      url: SITE_URL,
    },
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

  const authorName =
    blog.author?.name ||
    blog.author_name ||
    "";

  if (valid(authorName)) {
    schema.author = {
      "@type": "Person",
      name: String(authorName).trim(),
    };
  }

  return serializeJsonLd(schema);
}

// ============================================================
// BLOG SEO GENERATION
// ============================================================

function buildBlogSeo(blog, reqPath = "") {
  if (!blog) {
    throw new Error(
      "Blog data is required for SEO generation."
    );
  }

  const title = valid(blog.meta_title)
    ? blog.meta_title
    : `${blog.title} | Ultra Stones`;

  const description = valid(blog.meta_description)
    ? blog.meta_description
    : valid(blog.description)
      ? blog.description
      : "Explore design inspiration, stone applications, and expert insights from Ultra Stones.";

  const canonical = getBlogCanonicalUrl(blog);

  const image = getBlogImage(blog);

  const imageAlt =
    blog.cover?.alt_text ||
    blog.title ||
    "Ultra Stones Blog";

  const schemaMarkup = buildBlogSchema(
    blog,
    canonical,
    description,
    image
  );

  const publishedTime = blog.published_at
    ? metaProperty(
        "article:published_time",
        blog.published_at
      )
    : "";

  const modifiedTime = blog.updated_at
    ? metaProperty(
        "article:modified_time",
        blog.updated_at
      )
    : "";

  return `
<!-- ULTRA STONES - BLOG SEO -->

${titleTag(title)}

${metaName("description", description)}
${metaName("robots", "index, follow, max-image-preview:large")}

${canonicalTag(canonical)}

${metaProperty("og:type", "article")}
${metaProperty("og:locale", "en_US")}
${metaProperty("og:site_name", "Ultra Stones")}
${metaProperty("og:title", title)}
${metaProperty("og:description", description)}
${metaProperty("og:url", canonical)}

${image ? metaProperty("og:image", image) : ""}
${image ? metaProperty("og:image:alt", imageAlt) : ""}

${publishedTime}
${modifiedTime}

${metaName("twitter:card", "summary_large_image")}
${metaName("twitter:title", title)}
${metaName("twitter:description", description)}

${image ? metaName("twitter:image", image) : ""}
${image ? metaName("twitter:image:alt", imageAlt) : ""}

${schemaScript(schemaMarkup)}

<!-- END BLOG SEO -->
`;
}

// ============================================================
// LOCATION HELPERS
// ============================================================

function getLocationCanonicalUrl(location) {
  if (!valid(location?.slug)) {
    throw new Error(
      "Location slug is required for SEO generation."
    );
  }

  return (
    `${SITE_URL}/locations/` +
    encodeURIComponent(String(location.slug).trim())
  );
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
    location.state,
  ].filter(Boolean).join(", ");

  return (
    `Explore premium natural and engineered stone ` +
    `surfaces at Ultra Stones in ${place || "the USA"}. ` +
    `Discover marble, quartzite, quartz and more.`
  );
}

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

    return (
      `${String(hour).padStart(2, "0")}:` +
      `${String(minute).padStart(2, "0")}`
    );
  };

  const opens = to24Hour(match[1]);
  const closes = to24Hour(match[2]);

  if (!opens || !closes) return null;

  return { opens, closes };
}

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
      url: SITE_URL,
    },
  };

  if (valid(location.primary_phone)) {
    schema.telephone =
      String(location.primary_phone).trim();
  }

  if (valid(location.email)) {
    schema.email =
      String(location.email).trim();
  }

  if (image) {
    schema.image = image;
  }

  const address = {
    "@type": "PostalAddress",
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
      longitude,
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
      closes: parsed.closes,
    });
  };

  addHours(
    location.business_hours_mon_fri,
    [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
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

// ============================================================
// LOCATION SEO GENERATION
// ============================================================

function buildLocationSeo(location) {
  if (!location || !valid(location.slug)) {
    throw new Error(
      "Valid location data is required."
    );
  }

  const place = [
    location.city,
    location.state,
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
<!-- ULTRA STONES - LOCATION SEO -->

${titleTag(title)}

${metaName("description", description)}
${metaName("robots", "index, follow, max-image-preview:large")}

${canonicalTag(canonical)}

${metaProperty("og:type", "website")}
${metaProperty("og:locale", "en_US")}
${metaProperty("og:site_name", "Ultra Stones")}
${metaProperty("og:title", title)}
${metaProperty("og:description", description)}
${metaProperty("og:url", canonical)}

${image ? metaProperty("og:image", image) : ""}

${metaName(
    "twitter:card",
    image ? "summary_large_image" : "summary"
  )}
${metaName("twitter:title", title)}
${metaName("twitter:description", description)}

${image ? metaName("twitter:image", image) : ""}

${schemaScript(schemaMarkup)}

<!-- END LOCATION SEO -->
`;
}

// ============================================================
// CATEGORY SEO GENERATION
// ============================================================

function buildCategorySeo(category) {
  if (
    !category ||
    !valid(category.category_slug)
  ) {
    throw new Error(
      "Valid category data and slug are required."
    );
  }

  const categorySlug =
    String(category.category_slug).trim();

  const categoryName = valid(
    category.category_name
  )
    ? String(category.category_name).trim()
    : categorySlug.replace(/-/g, " ");

  const title = valid(category.title)
    ? String(category.title).trim()
    : `${categoryName} | Ultra Stones`;

  const description = valid(
    category.description
  )
    ? String(category.description).trim()
    : (
        `Explore ${categoryName} at Ultra Stones. ` +
        `Discover premium natural and engineered ` +
        `stone surfaces for residential and ` +
        `commercial projects.`
      );

  const defaultCanonical =
    `${SITE_URL}/product-category/` +
    encodeURIComponent(categorySlug);

  const canonical =
    cleanCanonical(category.canonical_url) ||
    defaultCanonical;

  const ogTitle = valid(category.og_title)
    ? String(category.og_title).trim()
    : title;

  const ogDescription = valid(
    category.og_description
  )
    ? String(category.og_description).trim()
    : description;

  const ogImage = safeUrl(
    category.og_image
  );

  const robotsIndex =
    category.robots_index === false
      ? "noindex"
      : "index";

  const robotsFollow =
    category.robots_follow === false
      ? "nofollow"
      : "follow";

  const robots =
    `${robotsIndex}, ${robotsFollow}, ` +
    "max-image-preview:large";

  const customSchema = getValidSchemaMarkup(
    category.schema_markup
  );

  return `
<!-- ULTRA STONES - CATEGORY SEO -->

${titleTag(title)}

${metaName("description", description)}
${metaName("robots", robots)}
${metaName("googlebot", robots)}

${canonicalTag(canonical)}

${metaProperty("og:type", "website")}
${metaProperty("og:locale", "en_US")}
${metaProperty("og:site_name", "Ultra Stones")}

${metaProperty("og:title", ogTitle)}
${metaProperty("og:description", ogDescription)}
${metaProperty("og:url", canonical)}

${ogImage ? metaProperty("og:image", ogImage) : ""}
${ogImage ? metaProperty("og:image:alt", categoryName) : ""}

${metaName(
    "twitter:card",
    ogImage ? "summary_large_image" : "summary"
  )}
${metaName("twitter:title", ogTitle)}
${metaName("twitter:description", ogDescription)}

${ogImage ? metaName("twitter:image", ogImage) : ""}

${schemaScript(customSchema)}

<!-- END CATEGORY SEO -->
`;
}

// ============================================================
// STATIC PAGE SEO GENERATION
// ============================================================
//
// Used for CMS-managed pages:
//
// /aboutus
// /ourprocess
// /ceu
// /privacy-policy
// /merchandising-displays
// /safety-first
//
// The frontend route is the source of truth for
// canonical URLs, regardless of old database values.
//
// ============================================================

function normalizeStaticPath(pathname) {
  const rawPath = String(pathname || "")
    .split("?")[0]
    .split("#")[0]
    .trim();

  const normalizedPath =
    "/" + rawPath.replace(/^\/+|\/+$/g, "");

  if (
    normalizedPath === "/" ||
    normalizedPath.includes("\\") ||
    normalizedPath.includes("//")
  ) {
    throw new Error(
      "Valid static page path is required."
    );
  }

  return normalizedPath;
}

function normalizeStaticSchema(schemaMarkup, canonical) {
  if (!valid(schemaMarkup)) return "";

  try {
    const parsed =
      typeof schemaMarkup === "string"
        ? JSON.parse(schemaMarkup)
        : structuredClone(schemaMarkup);

    // Update only page-specific URL fields.
    // Do not modify Organization, publisher,
    // image, or other unrelated URLs.

    const normalizeNode = (node) => {
      if (!node || typeof node !== "object") {
        return node;
      }

      if (Array.isArray(node)) {
        node.forEach(normalizeNode);
        return node;
      }

      const types = Array.isArray(node["@type"])
        ? node["@type"]
        : [node["@type"]];

      const pageTypes = new Set([
        "WebPage",
        "AboutPage",
        "ContactPage",
        "CollectionPage",
        "FAQPage",
        "ProfilePage",
        "ItemPage",
      ]);

      const isPageSchema = types.some((type) => {
        const shortType = String(type || "")
          .split("/")
          .pop();

        return pageTypes.has(shortType);
      });

      if (isPageSchema) {
        node.url = canonical;

        if (node["@id"]) {
          node["@id"] = `${canonical}#webpage`;
        }
      }

      if (node["@graph"]) {
        normalizeNode(node["@graph"]);
      }

      return node;
    };

    normalizeNode(parsed);

    return getValidSchemaMarkup(parsed);
  } catch (error) {
    console.warn(
      "[SEO] Invalid static page schema:",
      error.message
    );

    return "";
  }
}

function buildStaticPageSeo(page, pathname) {
  if (!page || !page.page_seo) {
    throw new Error(
      "Valid page SEO data is required."
    );
  }

  const seo = page.page_seo;

  const normalizedPath =
    normalizeStaticPath(pathname);

  const canonical =
    `${SITE_URL}${normalizedPath}`;

  const pageTitle = valid(page.title)
    ? String(page.title).trim()
    : "Ultra Stones";

  const title = valid(seo.meta_title)
    ? String(seo.meta_title).trim()
    : `${pageTitle} | Ultra Stones`;

  const description = valid(seo.meta_description)
    ? String(seo.meta_description).trim()
    : `Discover ${pageTitle} at Ultra Stones.`;

  const ogTitle = valid(seo.og_title)
    ? String(seo.og_title).trim()
    : title;

  const ogDescription = valid(seo.og_description)
    ? String(seo.og_description).trim()
    : description;

  const ogImage = safeUrl(
    seo.og_image_url
  );

  const robotsIndex =
    seo.robots_index === "noindex" ||
    seo.robots_index === false
      ? "noindex"
      : "index";

  const robotsFollow =
    seo.robots_follow === "nofollow" ||
    seo.robots_follow === false
      ? "nofollow"
      : "follow";

  const robots =
    `${robotsIndex}, ${robotsFollow}, ` +
    "max-image-preview:large";

  const customSchema = normalizeStaticSchema(
    seo.schema_markup,
    canonical
  );

  return `
<!-- ULTRA STONES - STATIC PAGE SEO -->

${titleTag(title)}

${metaName("description", description)}
${metaName("robots", robots)}
${metaName("googlebot", robots)}

${canonicalTag(canonical)}

${metaProperty("og:type", "website")}
${metaProperty("og:locale", "en_US")}
${metaProperty("og:site_name", "Ultra Stones")}

${metaProperty("og:title", ogTitle)}
${metaProperty("og:description", ogDescription)}
${metaProperty("og:url", canonical)}

${ogImage ? metaProperty("og:image", ogImage) : ""}
${ogImage ? metaProperty("og:image:alt", pageTitle) : ""}

${metaName(
    "twitter:card",
    ogImage ? "summary_large_image" : "summary"
  )}
${metaName("twitter:title", ogTitle)}
${metaName("twitter:description", ogDescription)}

${ogImage ? metaName("twitter:image", ogImage) : ""}

${schemaScript(customSchema)}

<!-- END STATIC PAGE SEO -->
`;
}

// ============================================================
// REMOVE EXISTING SEO TAGS
// ============================================================
//
// Clean only the document head.
//
// Preserve:
// - CSS and JavaScript resources
// - preload/preconnect links
// - favicon and manifest
// - global Organization/WebSite JSON-LD
//
// Remove:
// - existing page-specific metadata
// - existing canonical links
// - existing page-specific JSON-LD marked by Express
//
// ============================================================

function removeExistingSeo(html) {
  return html.replace(
    /<head\b[^>]*>[\s\S]*?<\/head\s*>/i,
    (head) => {
      let cleanHead = head;

      // Remove existing titles.
      cleanHead = cleanHead.replace(
        /<title\b[^>]*>[\s\S]*?<\/title\s*>/gi,
        ""
      );

      // Remove standard SEO metadata.
      cleanHead = cleanHead.replace(
        /<meta\b(?=[^>]*\bname\s*=\s*["'](?:description|robots|googlebot|twitter:[^"']+)["'])[^>]*>/gi,
        ""
      );

      // Remove Open Graph metadata.
      cleanHead = cleanHead.replace(
        /<meta\b(?=[^>]*\bproperty\s*=\s*["'](?:og:[^"']+|article:[^"']+)["'])[^>]*>/gi,
        ""
      );

      // Remove canonical links.
      cleanHead = cleanHead.replace(
        /<link\b(?=[^>]*\brel\s*=\s*(?:"[^"]*\bcanonical\b[^"]*"|'[^']*\bcanonical\b[^']*'|canonical(?=[\s/>])))[^>]*>/gi,
        ""
      );

      // Remove previously injected page schemas.
      // Preserve unmarked global JSON-LD.
      cleanHead = cleanHead.replace(
        /<script\b(?=[^>]*\bdata-ultra-page-schema\s*=\s*["']true["'])[^>]*>[\s\S]*?<\/script\s*>/gi,
        ""
      );

      return cleanHead;
    }
  );
}

// ============================================================
// INJECT SEO INTO FRONTEND HTML
// ============================================================

function injectSeo(html, seoTags) {
  if (
    !html ||
    typeof html !== "string"
  ) {
    throw new Error(
      "Valid HTML template is required."
    );
  }

  if (
    !seoTags ||
    typeof seoTags !== "string"
  ) {
    throw new Error(
      "Valid SEO tags are required."
    );
  }

  if (!/<\/head\s*>/i.test(html)) {
    throw new Error(
      "HTML template is missing closing head tag."
    );
  }

  const cleanHtml = removeExistingSeo(html);

  return cleanHtml.replace(
    /<\/head\s*>/i,
    `${seoTags}\n</head>`
  );
}

// ============================================================
// STATIC PAGE CANONICAL INJECTION
// ============================================================
//
// Fallback for static pages without CMS SEO records.
//
// Only canonical tags are replaced.
// Existing title, description and other metadata
// are preserved for compatibility.
//
// ============================================================

function injectStaticCanonical(html, pathname) {
  if (
    typeof html !== "string" ||
    !/<\/head\s*>/i.test(html)
  ) {
    throw new Error(
      "Valid frontend HTML is required."
    );
  }

  const staticPaths = new Set([
    "/aboutus",
    "/ourprocess",
    "/categories",
    "/resources",
    "/merchandising-displays",
    "/gallery",
    "/safety-first",
    "/ceu",
    "/blogs",
    "/career",
    "/product_registration",
    "/contact",
    "/privacy-policy",
  ]);

  const normalizedPath =
    normalizeStaticPath(pathname);

  if (!staticPaths.has(normalizedPath)) {
    throw new Error(
      "Unsupported static canonical path."
    );
  }

  const canonical =
    `${SITE_URL}${normalizedPath}`;

  return html.replace(
    /<head\b[^>]*>[\s\S]*?<\/head\s*>/i,
    (head) => {
      const cleanHead = head.replace(
        /<link\b(?=[^>]*\brel\s*=\s*(?:"[^"]*\bcanonical\b[^"]*"|'[^']*\bcanonical\b[^']*'|canonical(?=[\s/>])))[^>]*>/gi,
        ""
      );

      return cleanHead.replace(
        /<\/head\s*>/i,
        `${canonicalTag(canonical)}\n</head>`
      );
    }
  );
}

// ============================================================
// EXPORTS
// ============================================================

module.exports = {
  buildProductSeo,
  buildBlogSeo,
  buildLocationSeo,
  buildCategorySeo,
  buildStaticPageSeo,
  injectSeo,
  injectStaticCanonical,
};
