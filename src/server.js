
"use strict";

// src/server.js

const express = require("express");
const cors = require("cors");
const path = require("path");

const { getBlogById } = require("./services/blog.service");
const companyService = require("./services/company.service");

const {
  buildProductSeo,
  buildBlogSeo,
  buildLocationSeo,
  buildCategorySeo,
  buildStaticPageSeo,
  injectSeo,
  injectStaticCanonical,
} = require("./utils/seoHtml");

const {
  getPageBySlug,
} = require("./services/page.service");

const errorHandler = require("./middlewares/error.middleware");

const {
  getProductDetails,
} = require("./services/stone.service");

// ============================================================
// ROUTES
// ============================================================

const pageRoutes = require("./routes/page.routes");
const blogRoutes = require("./routes/blog.routes");
const userRoutes = require("./routes/user.routes");
const stoneRoutes = require("./routes/stone.routes");
const careerRoutes = require("./routes/career.routes");
const reportRoutes = require("./routes/report.routes");
const lookupRoutes = require("./routes/lookup.routes");
const companyRoutes = require("./routes/company.routes");
const sitemapRoutes = require("./routes/sitemap.routes");
const activityRoutes = require("./routes/activity.routes");
const homeHeroRoutes = require("./routes/homeHero.routes");
const dasboardRoutes = require("./routes/dashboard.routes");
const lotImagesRoutes = require("./routes/lotImages.routes");
const instagramRoutes = require("./routes/instagram.routes");
const newsLetterRoutes = require("./routes/newsletter.routes");
const ceuRequestRoutes = require("./routes/ceuRequest.routes");
const contactRoutes = require("./routes/contactEnquiry.routes");
const categorySeoRoutes = require("./routes/categorySeo.routes");
const GlobalSerchRoutes = require("./routes/globalsearch.route");
const ProductRemarkRoutes = require("./routes/productRemark.routes");
const sampleRequestRoutes = require("./routes/sampleRequest.routes");
const displayRequestRoutes = require("./routes/displayRequest.routes");
const contactRequestRoutes = require("./routes/contactRequest.routes");
const bulkDescriptionRoutes = require("./routes/bulkDescription.routes");
const categoryResourceRoutes = require("./routes/categoryResource.routes");
const inspirationGalleryRoutes = require("./routes/inspirationGallery.routes");
const productRegistrationRoutes = require("./routes/ProductRegistration.routes");

// ============================================================
// EXPRESS APPLICATION
// ============================================================

const app = express();

app.disable("x-powered-by");

app.use(cors());

app.use(
  express.json({
    limit: "50mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "50mb",
  })
);

// ============================================================
// UPLOADS
// ============================================================

app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "../uploads")
  )
);

// ============================================================
// API HEALTH
// ============================================================

app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Ultrastone API Running",
  });
});

// ============================================================
// API ROUTES
// ============================================================

app.use("/api/blog", blogRoutes);
app.use("/api/pages", pageRoutes);
app.use("/api/users", userRoutes);
app.use("/api/stones", stoneRoutes);
app.use("/api/careers", careerRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/lookups", lookupRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/home-hero", homeHeroRoutes);
app.use("/api/dashboard", dasboardRoutes);
app.use("/api/activitie", activityRoutes);
app.use("/api/search", GlobalSerchRoutes);
app.use("/api/instagram", instagramRoutes);
app.use("/api/lot-images", lotImagesRoutes);
app.use("/api/newsletter", newsLetterRoutes);
app.use("/api/products", ProductRemarkRoutes);
app.use("/api/ceu-request", ceuRequestRoutes);
app.use("/api/category-seo", categorySeoRoutes);
app.use("/api/sample-requests", sampleRequestRoutes);
app.use("/api/display-request", displayRequestRoutes);
app.use("/api/contact-request", contactRequestRoutes);
app.use("/api/bulk-descriptions", bulkDescriptionRoutes);
app.use("/api/category-resources", categoryResourceRoutes);
app.use("/api/inspiration-gallery", inspirationGalleryRoutes);
app.use("/api/product-registrations", productRegistrationRoutes);

// ============================================================
// PUBLIC SITEMAP
// ============================================================

app.use("/", sitemapRoutes);

// ============================================================
// FRONTEND CONFIGURATION
// ============================================================

const FRONTEND_INTERNAL_URL = String(
  process.env.FRONTEND_INTERNAL_URL ||
  "http://frontend"
).replace(/\/+$/, "");

const FRONTEND_REQUEST_TIMEOUT_MS = 5000;

// ============================================================
// CATEGORY SEO CONFIGURATION
// ============================================================

const CATEGORY_SEO_INTERNAL_URL = String(
  process.env.CATEGORY_SEO_INTERNAL_URL ||
  `http://127.0.0.1:${process.env.PORT || 5001}`
).replace(/\/+$/, "");

const CATEGORY_SEO_REQUEST_TIMEOUT_MS = 5000;

// ============================================================
// COMMON HELPERS
// ============================================================

const normalizeSlug = (value) => {
  return String(value || "").trim();
};

const encodeSlug = (value) => {
  return encodeURIComponent(normalizeSlug(value));
};

const getProductCategorySlug = (product) => {
  return normalizeSlug(
    product?.stone_categories?.slug ||
    product?.category_slug
  );
};

const isPublishedProduct = (product) => {
  if (!product) return false;

  if (product.is_active === false) {
    return false;
  }

  if (product.is_published === false) {
    return false;
  }

  return true;
};

const escapeHtml = (value) => {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
};

// ============================================================
// FRONTEND HTML FETCHER
// ============================================================

const getFrontendHtml = async () => {
  const url = `${FRONTEND_INTERNAL_URL}/`;

  let response;

  try {
    response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "text/html",
        "Cache-Control": "no-cache",
      },
      signal: AbortSignal.timeout(
        FRONTEND_REQUEST_TIMEOUT_MS
      ),
    });
  } catch (error) {
    console.error(
      "[SEO] Frontend HTML request failed:",
      error
    );

    throw new Error(
      "Current frontend HTML is unavailable"
    );
  }

  if (!response.ok) {
    throw new Error(
      `Frontend HTML returned HTTP ${response.status}`
    );
  }

  const contentType = String(
    response.headers.get("content-type") || ""
  ).toLowerCase();

  if (!contentType.includes("text/html")) {
    throw new Error(
      `Unexpected frontend content type: ${contentType}`
    );
  }

  const html = await response.text();

  if (
    !/<html[\s>]/i.test(html) ||
    !/<head[\s>]/i.test(html) ||
    !/<\/head\s*>/i.test(html) ||
    !/<body[\s>]/i.test(html)
  ) {
    throw new Error(
      "Invalid frontend HTML template received"
    );
  }

  const hasModuleScript =
    /<script\b(?=[^>]*\btype\s*=\s*["']module["'])(?=[^>]*\bsrc\s*=\s*["'][^"']+\.(?:js|jsx|ts|tsx)(?:\?[^"']*)?["'])[^>]*>/i.test(
      html
    );

  if (!hasModuleScript) {
    throw new Error(
      "Frontend HTML does not contain a Vite module script"
    );
  }

  return html;
};

// ============================================================
// CATEGORY SEO DATA FETCHER
// ============================================================

const getCategorySeoData = async (slug) => {
  const normalizedSlug = normalizeSlug(slug);

  if (!normalizedSlug) {
    throw new Error(
      "Category slug is required."
    );
  }

  const url =
    `${CATEGORY_SEO_INTERNAL_URL}` +
    `/api/category-seo/public/` +
    encodeSlug(normalizedSlug);

  let response;

  try {
    response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(
        CATEGORY_SEO_REQUEST_TIMEOUT_MS
      ),
    });
  } catch (error) {
    console.error(
      "[SEO] Category SEO API request failed:",
      error
    );

    throw new Error(
      "Category SEO API is unavailable"
    );
  }

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(
      `Category SEO API returned HTTP ${response.status}`
    );
  }

  const contentType = String(
    response.headers.get("content-type") || ""
  ).toLowerCase();

  if (!contentType.includes("application/json")) {
    throw new Error(
      `Unexpected Category SEO content type: ${contentType}`
    );
  }

  const result = await response.json();

  if (
    !result ||
    result.success !== true ||
    !result.data ||
    typeof result.data !== "object" ||
    Array.isArray(result.data)
  ) {
    throw new Error(
      "Invalid Category SEO API response"
    );
  }

  if (
    normalizeSlug(result.data.category_slug) !==
    normalizedSlug
  ) {
    throw new Error(
      "Category SEO slug mismatch"
    );
  }

  return result.data;
};

// ============================================================
// SEO RESPONSE HEADERS
// ============================================================

const setSeoHeaders = (res, source) => {
  res.setHeader(
    "Content-Type",
    "text/html; charset=utf-8"
  );

  res.setHeader(
    "X-SEO-Source",
    source
  );

  res.setHeader(
    "Cache-Control",
    "no-cache, must-revalidate"
  );

  res.setHeader(
    "Vary",
    "Accept-Encoding"
  );
};

// ============================================================
// SEO ERROR RESPONSE
// ============================================================

const sendSeoError = (
  res,
  label,
  error
) => {
  console.error(
    `[SEO] ${label} generation failed:`,
    error
  );

  res.setHeader(
    "Cache-Control",
    "no-store"
  );

  return res.status(503).send(
    "This page is temporarily unavailable. Please try again shortly."
  );
};

// ============================================================
// SEO NOT FOUND RESPONSE
// ============================================================

const sendSeoNotFound = async (
  res,
  source,
  description = "The requested page could not be found on Ultra Stones."
) => {
  const html = await getFrontendHtml();

  const notFoundSeo = `
<!-- ULTRA STONES - NOT FOUND SEO -->

<title data-ultra-ssr-seo="true">404 - Page Not Found | Ultra Stones</title>

<meta
  name="description"
  content="${escapeHtml(description)}"
  data-ultra-ssr-seo="true"
/>

<meta
  name="robots"
  content="noindex, follow"
  data-ultra-ssr-seo="true"
/>

<meta
  name="googlebot"
  content="noindex, follow"
  data-ultra-ssr-seo="true"
/>

<!-- END NOT FOUND SEO -->
`;

  const finalHtml = injectSeo(
    html,
    notFoundSeo
  );

  setSeoHeaders(res, source);

  res.setHeader(
    "X-Robots-Tag",
    "noindex, follow"
  );

  res.setHeader(
    "Cache-Control",
    "no-store"
  );

  return res.status(404).send(finalHtml);
};

// ============================================================
// PRODUCT SEO HTML
// ============================================================
//
// Route:
// /product/:categorySlug/:productSlug
//
// Product identity is determined by its unique slug.
//
// Different products with similar names remain separate.
//
// The category segment is validated against the product's
// actual category when that information is available.
//
// ============================================================

app.get(
  "/product/:categorySlug/:productSlug",
  async (req, res) => {
    try {
      const {
        categorySlug,
        productSlug,
      } = req.params;

      const requestedCategory =
        normalizeSlug(categorySlug);

      const requestedProduct =
        normalizeSlug(productSlug);

      if (
        !requestedCategory ||
        !requestedProduct
      ) {
        return await sendSeoNotFound(
          res,
          "express-product-not-found"
        );
      }

      console.log(
        "[SEO] Product page requested:",
        req.originalUrl
      );

      // ------------------------------------------------------
      // FETCH PRODUCT
      // ------------------------------------------------------

      const product = await getProductDetails(
        requestedProduct
      );

      if (!isPublishedProduct(product)) {
        return await sendSeoNotFound(
          res,
          "express-product-not-found"
        );
      }

      // ------------------------------------------------------
      // VALIDATE PRODUCT SLUG
      // ------------------------------------------------------

      const actualProductSlug =
        normalizeSlug(product.slug);

      if (
        actualProductSlug &&
        actualProductSlug !== requestedProduct
      ) {
        return await sendSeoNotFound(
          res,
          "express-product-slug-mismatch"
        );
      }

      // ------------------------------------------------------
      // VALIDATE CATEGORY
      // ------------------------------------------------------

      const actualCategorySlug =
        getProductCategorySlug(product);

      if (
        actualCategorySlug &&
        requestedCategory !== actualCategorySlug
      ) {
        const correctPath =
          `/product/${encodeSlug(actualCategorySlug)}/` +
          encodeSlug(actualProductSlug || requestedProduct);

        return res.redirect(
          301,
          correctPath
        );
      }

      // ------------------------------------------------------
      // FETCH CURRENT FRONTEND HTML
      // ------------------------------------------------------

      const html = await getFrontendHtml();

      // ------------------------------------------------------
      // GENERATE PRODUCT SEO
      // ------------------------------------------------------

      const seoTags = buildProductSeo(
        product,
        req.originalUrl
      );

      // ------------------------------------------------------
      // INJECT PRODUCT SEO
      // ------------------------------------------------------

      const finalHtml = injectSeo(
        html,
        seoTags
      );

      // ------------------------------------------------------
      // RESPONSE
      // ------------------------------------------------------

      setSeoHeaders(
        res,
        "express-product"
      );

      return res.status(200).send(
        finalHtml
      );
    } catch (error) {
      return sendSeoError(
        res,
        "Product SEO",
        error
      );
    }
  }
);

// ============================================================
// CATEGORY SEO HTML
// ============================================================
//
// Route:
// /product-category/:slug
//
// SEO source:
// GET /api/category-seo/public/:slug
//
// The category SEO record is required by this route.
// A missing SEO record is not automatically treated as
// a valid category.
//
// ============================================================

app.get(
  "/product-category/:slug",
  async (req, res) => {
    try {
      const { slug } = req.params;

      const normalizedSlug =
        normalizeSlug(slug);

      if (!normalizedSlug) {
        return await sendSeoNotFound(
          res,
          "express-category-not-found",
          "The requested category could not be found."
        );
      }

      console.log(
        "[SEO] Category page requested:",
        req.originalUrl
      );

      // ------------------------------------------------------
      // FETCH CATEGORY SEO
      // ------------------------------------------------------

      const category = await getCategorySeoData(
        normalizedSlug
      );

      if (!category) {
        return await sendSeoNotFound(
          res,
          "express-category-seo-not-found",
          "The requested category SEO record could not be found."
        );
      }

      // ------------------------------------------------------
      // FETCH CURRENT FRONTEND HTML
      // ------------------------------------------------------

      const html = await getFrontendHtml();

      // ------------------------------------------------------
      // BUILD CATEGORY SEO
      // ------------------------------------------------------

      const seoTags = buildCategorySeo(
        category
      );

      // ------------------------------------------------------
      // INJECT CATEGORY SEO
      // ------------------------------------------------------

      const finalHtml = injectSeo(
        html,
        seoTags
      );

      // ------------------------------------------------------
      // RESPONSE
      // ------------------------------------------------------

      setSeoHeaders(
        res,
        "express-category"
      );

      return res.status(200).send(
        finalHtml
      );
    } catch (error) {
      return sendSeoError(
        res,
        "Category SEO",
        error
      );
    }
  }
);

// ============================================================
// BLOG SEO HTML
// ============================================================
//
// Route:
// /blog/:identifier
//
// ============================================================

app.get(
  "/blog/:identifier",
  async (req, res) => {
    try {
      const { identifier } = req.params;

      const normalizedIdentifier =
        normalizeSlug(identifier);

      if (!normalizedIdentifier) {
        return await sendSeoNotFound(
          res,
          "express-blog-not-found"
        );
      }

      // ------------------------------------------------------
      // FETCH BLOG
      // ------------------------------------------------------

      const blog = await getBlogById(
        normalizedIdentifier
      );

      if (
        !blog ||
        blog.status !== "PUBLISHED" ||
        blog.deleted_at
      ) {
        return await sendSeoNotFound(
          res,
          "express-blog-not-found"
        );
      }

      // ------------------------------------------------------
      // FETCH CURRENT FRONTEND HTML
      // ------------------------------------------------------

      const html = await getFrontendHtml();

      // ------------------------------------------------------
      // BUILD BLOG SEO
      // ------------------------------------------------------

      const seoTags = buildBlogSeo(
        blog,
        `/blog/${blog.slug}`
      );

      // ------------------------------------------------------
      // INJECT BLOG SEO
      // ------------------------------------------------------

      const finalHtml = injectSeo(
        html,
        seoTags
      );

      // ------------------------------------------------------
      // RESPONSE
      // ------------------------------------------------------

      setSeoHeaders(
        res,
        "express-blog"
      );

      return res.status(200).send(
        finalHtml
      );
    } catch (error) {
      if (
        error.message ===
        "Blog post not found"
      ) {
        try {
          return await sendSeoNotFound(
            res,
            "express-blog-not-found"
          );
        } catch (notFoundError) {
          return sendSeoError(
            res,
            "Blog Not Found SEO",
            notFoundError
          );
        }
      }

      return sendSeoError(
        res,
        "Blog SEO",
        error
      );
    }
  }
);

// ============================================================
// LOCATION SEO HTML
// ============================================================
//
// Route:
// /locations/:slug
//
// ============================================================

app.get(
  "/locations/:slug",
  async (req, res) => {
    try {
      const { slug } = req.params;

      const normalizedSlug =
        normalizeSlug(slug);

      if (!normalizedSlug) {
        return await sendSeoNotFound(
          res,
          "express-location-not-found"
        );
      }

      console.log(
        "[SEO] Location page requested:",
        req.originalUrl
      );

      // ------------------------------------------------------
      // FETCH LOCATION
      // ------------------------------------------------------

      const location =
        await companyService.getCompanyBySlug(
          normalizedSlug
        );

      if (
        !location ||
        location.is_active !== true
      ) {
        return await sendSeoNotFound(
          res,
          "express-location-not-found"
        );
      }

      // ------------------------------------------------------
      // CANONICAL LOCATION PATH
      // ------------------------------------------------------

      const canonicalPath =
        `/locations/${encodeSlug(location.slug)}`;

      if (req.path !== canonicalPath) {
        return res.redirect(
          301,
          canonicalPath
        );
      }

      // ------------------------------------------------------
      // FETCH CURRENT FRONTEND HTML
      // ------------------------------------------------------

      const html = await getFrontendHtml();

      // ------------------------------------------------------
      // BUILD LOCATION SEO
      // ------------------------------------------------------

      const seoTags = buildLocationSeo(
        location
      );

      // ------------------------------------------------------
      // INJECT LOCATION SEO
      // ------------------------------------------------------

      const finalHtml = injectSeo(
        html,
        seoTags
      );

      // ------------------------------------------------------
      // RESPONSE
      // ------------------------------------------------------

      setSeoHeaders(
        res,
        "express-location"
      );

      return res.status(200).send(
        finalHtml
      );
    } catch (error) {
      if (
        error.message ===
        "Showroom not found"
      ) {
        try {
          return await sendSeoNotFound(
            res,
            "express-location-not-found"
          );
        } catch (notFoundError) {
          return sendSeoError(
            res,
            "Location Not Found SEO",
            notFoundError
          );
        }
      }

      return sendSeoError(
        res,
        "Location SEO",
        error
      );
    }
  }
);

// ============================================================
// STATIC PAGE SEO
// ============================================================
//
// CMS-managed pages use their published database SEO.
//
// Frontend route          Database slug
// ------------------------------------------------------------
// /aboutus                about-us
// /ourprocess             our-process
// /merchandising-displays merchandising-displays
// /safety-first           silica-first
// /ceu                    ceu
// /privacy-policy         privacy-policy
//
// All other static routes retain canonical fallback.
//
// ============================================================

const STATIC_CANONICAL_PATHS = [
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
];

const STATIC_PAGE_SLUG_MAP = {
  "/aboutus": "about-us",
  "/ourprocess": "our-process",
  "/merchandising-displays": "merchandising-displays",
  "/safety-first": "silica-first",
  "/ceu": "ceu",
  "/privacy-policy": "privacy-policy",
};

// ============================================================
// STATIC PAGE SEO HANDLER
// ============================================================

app.get(
  STATIC_CANONICAL_PATHS,
  async (req, res) => {
    try {
      const pathname = req.path;

      // ------------------------------------------------------
      // FETCH CURRENT FRONTEND HTML
      // ------------------------------------------------------

      const html = await getFrontendHtml();

      // ------------------------------------------------------
      // RESOLVE CMS PAGE SLUG
      // ------------------------------------------------------

      const dbSlug =
        STATIC_PAGE_SLUG_MAP[pathname];

      if (dbSlug) {
        // ----------------------------------------------------
        // FETCH PUBLISHED PAGE + SEO FROM DATABASE
        // ----------------------------------------------------

        const page = await getPageBySlug(
          dbSlug
        );

        if (
          page &&
          page.status === "published" &&
          page.page_seo
        ) {
          // --------------------------------------------------
          // GENERATE PAGE SEO
          // --------------------------------------------------

          const seoTags = buildStaticPageSeo(
            page,
            pathname
          );

          // --------------------------------------------------
          // INJECT PAGE SEO
          // --------------------------------------------------

          const finalHtml = injectSeo(
            html,
            seoTags
          );

          // --------------------------------------------------
          // RESPONSE
          // --------------------------------------------------

          setSeoHeaders(
            res,
            "express-static-page"
          );

          return res.status(200).send(
            finalHtml
          );
        }

        console.warn(
          "[SEO] Published CMS page SEO unavailable:",
          {
            pathname,
            dbSlug,
          }
        );
      }

      // ------------------------------------------------------
      // FALLBACK: CANONICAL-ONLY SEO
      // ------------------------------------------------------
      //
      // Preserve existing behavior for static pages
      // without a published CMS SEO record.
      //
      // ------------------------------------------------------

      const finalHtml = injectStaticCanonical(
        html,
        pathname
      );

      setSeoHeaders(
        res,
        "express-static-canonical"
      );

      return res.status(200).send(
        finalHtml
      );
    } catch (error) {
      return sendSeoError(
        res,
        "Static Page SEO",
        error
      );
    }
  }
);

// ============================================================
// REACT SPA FALLBACK
// ============================================================
//
// Must remain after:
// - Product SEO
// - Category SEO
// - Blog SEO
// - Location SEO
// - Static Page SEO
//
// ============================================================

app.use(async (req, res) => {
  // ----------------------------------------------------------
  // UNKNOWN API ENDPOINTS
  // ----------------------------------------------------------

  if (
    req.path === "/api" ||
    req.path.startsWith("/api/")
  ) {
    return res.status(404).json({
      success: false,
      message: "API endpoint not found",
    });
  }

  // ----------------------------------------------------------
  // REJECT UNSUPPORTED METHODS
  // ----------------------------------------------------------

  if (
    req.method !== "GET" &&
    req.method !== "HEAD"
  ) {
    return res.status(404).send(
      "Route not found"
    );
  }

  // ----------------------------------------------------------
  // SERVE CURRENT FRONTEND HTML
  // ----------------------------------------------------------

  try {
    const html = await getFrontendHtml();

    res.setHeader(
      "Content-Type",
      "text/html; charset=utf-8"
    );

    res.setHeader(
      "Cache-Control",
      "no-cache, must-revalidate"
    );

    res.setHeader(
      "X-SEO-Source",
      "express-spa-fallback"
    );

    return res.status(200).send(
      html
    );
  } catch (error) {
    console.error(
      "[Frontend] Fallback failed:",
      error
    );

    res.setHeader(
      "Cache-Control",
      "no-store"
    );

    return res.status(503).send(
      "Website temporarily unavailable"
    );
  }
});

// ============================================================
// GLOBAL ERROR HANDLER
// ============================================================

app.use(errorHandler);

// ============================================================
// EXPORTS
// ============================================================

module.exports = app;
