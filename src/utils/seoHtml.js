const SITE_URL = "https://www.ultrastones.com";

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function valid(value) {
  return value && value !== "test" && value !== "{}";
}

function getImage(product) {
  return (
    product.media?.find((i) => i.media_type === "CLOSEUP_IMAGE")?.media_url ||
    product.media?.find((i) => i.media_type === "SLAB_IMAGE")?.media_url ||
    product.media?.[0]?.media_url ||
    ""
  );
}

function buildProductSeo(product, reqPath) {
  const seo = product.seo || {};

  const title =
    seo.meta_title || `${product.name} ${product.stone_group || ""} | Ultra Stones`;

  const description =
    seo.meta_description ||
    product.small_description ||
    product.long_description?.slice(0, 160) ||
    "Explore premium stone surfaces by Ultra Stones.";

  const canonical = valid(seo.canonical_url)
    ? seo.canonical_url
    : `${SITE_URL}${reqPath}`;

  const image = valid(seo.og_image) ? seo.og_image : getImage(product);

  const robots = `${seo.robots_index === false ? "noindex" : "index"}, ${
    seo.robots_follow === false ? "nofollow" : "follow"
  }`;

  return `
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(description)}" />
<meta name="robots" content="${escapeHtml(robots)}" />
<link rel="canonical" href="${escapeHtml(canonical)}" />

<meta property="og:type" content="product" />
<meta property="og:title" content="${escapeHtml(seo.og_title || title)}" />
<meta property="og:description" content="${escapeHtml(seo.og_description || description)}" />
<meta property="og:url" content="${escapeHtml(canonical)}" />
${image ? `<meta property="og:image" content="${escapeHtml(image)}" />` : ""}

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${escapeHtml(seo.og_title || title)}" />
<meta name="twitter:description" content="${escapeHtml(seo.og_description || description)}" />
${image ? `<meta name="twitter:image" content="${escapeHtml(image)}" />` : ""}

${
  seo.schema_markup
    ? `<script type="application/ld+json">${seo.schema_markup}</script>`
    : ""
}
`;
}

function injectSeo(html, seoTags) {
  let cleanHtml = html;

  cleanHtml = cleanHtml.replace(/<title>.*?<\/title>/i, "");
  cleanHtml = cleanHtml.replace(/<meta name="description".*?>/i, "");
  cleanHtml = cleanHtml.replace(/<meta name="robots".*?>/i, "");
  cleanHtml = cleanHtml.replace(/<link rel="canonical".*?>/i, "");
  cleanHtml = cleanHtml.replace(/<meta property="og:.*?>/gi, "");
  cleanHtml = cleanHtml.replace(/<meta name="twitter:.*?>/gi, "");

  return cleanHtml.replace("</head>", `${seoTags}\n</head>`);
}

module.exports = {
  buildProductSeo,
  injectSeo,
};