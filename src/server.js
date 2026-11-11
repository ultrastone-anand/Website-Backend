
const express = require("express");
const cors = require("cors");
const path = require("path");

const { getBlogById } = require("./services/blog.service");
const companyService = require("./services/company.service");

const {
  buildProductSeo,
  buildBlogSeo,
  injectSeo,
  buildLocationSeo,
} = require("./utils/seoHtml");

const {
  getProductDetails,
} = require("./services/stone.service");

/* =========================================================
   ROUTES
========================================================= */

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
const GlobalSerchRoutes = require("./routes/globalsearch.route");
const ProductRemarkRoutes = require("./routes/productRemark.routes");
const sampleRequestRoutes = require("./routes/sampleRequest.routes");
const displayRequestRoutes = require("./routes/displayRequest.routes");
const contactRequestRoutes = require("./routes/contactRequest.routes");
const bulkDescriptionRoutes = require("./routes/bulkDescription.routes");
const categoryResourceRoutes = require("./routes/categoryResource.routes");
const inspirationGalleryRoutes = require("./routes/inspirationGallery.routes");
const productRegistrationRoutes = require("./routes/ProductRegistration.routes");

/* =========================================================
   EXPRESS APPLICATION
========================================================= */

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

/* =========================================================
   UPLOADS
========================================================= */

app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "../uploads")
  )
);

/* =========================================================
   API HEALTH
========================================================= */

app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Ultrastone API Running",
  });
});

/* =========================================================
   API ROUTES
========================================================= */

app.use("/api/blog", blogRoutes);
app.use("/api/pages", pageRoutes);
app.use("/api/users", userRoutes);
app.use("/api/stones", stoneRoutes);
app.use("/api/home-hero", homeHeroRoutes);
app.use("/api/careers", careerRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/lookups", lookupRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/dashboard", dasboardRoutes);
app.use("/api/activitie", activityRoutes);
app.use("/api/search", GlobalSerchRoutes);
app.use("/api/instagram", instagramRoutes);
app.use("/api/lot-images", lotImagesRoutes);
app.use("/api/newsletter", newsLetterRoutes);
app.use("/api/products", ProductRemarkRoutes);
app.use("/api/ceu-request", ceuRequestRoutes);
app.use("/api/sample-requests", sampleRequestRoutes);
app.use("/api/display-request", displayRequestRoutes);
app.use("/api/contact-request", contactRequestRoutes);
app.use("/api/bulk-descriptions", bulkDescriptionRoutes);
app.use("/api/category-resources", categoryResourceRoutes);
app.use("/api/inspiration-gallery", inspirationGalleryRoutes);
app.use("/api/product-registrations", productRegistrationRoutes);

/* =========================================================
   PUBLIC SITEMAP
========================================================= */

app.use("/", sitemapRoutes);

/* =========================================================
   FRONTEND CONFIGURATION

   IMPORTANT:
   Express must use the current frontend HTML.

   Previously:
   Backend read its own dist/index.html.

   Problem:
   That file contained old Vite asset hashes.

   Solution:
   Fetch the current index.html directly from
   the frontend Nginx container.

   This works over the existing Docker network.
========================================================= */

const FRONTEND_INTERNAL_URL = String(
  process.env.FRONTEND_INTERNAL_URL ||
    "http://frontend"
).replace(/\/+$/, "");

const FRONTEND_REQUEST_TIMEOUT_MS = 5000;

/* =========================================================
   FRONTEND HTML FETCHER
========================================================= */

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

  /*
   * Check for a Vite JavaScript entry.
   *
   * This helps detect an unexpected response
   * before generating SEO HTML.
   */

  const hasModuleScript =
    /<script\b[^>]*type=["']module["'][^>]*src=["'][^"']+\.js(?:\?[^"']*)?["']/i.test(
      html
    ) ||
    /<script\b[^>]*src=["'][^"']+\.js(?:\?[^"']*)?["'][^>]*type=["']module["']/i.test(
      html
    );

  if (!hasModuleScript) {
    throw new Error(
      "Frontend HTML does not contain a Vite module script"
    );
  }

  return html;
};

/* =========================================================
   SEO RESPONSE HEADERS
========================================================= */

const setSeoHeaders = (res, source) => {
  res.setHeader(
    "Content-Type",
    "text/html; charset=utf-8"
  );

  res.setHeader(
    "X-SEO-Source",
    source
  );

  /*
   * HTML should be revalidated after deployments.
   * Versioned Vite assets can still be cached
   * independently by Nginx.
   */

  res.setHeader(
    "Cache-Control",
    "no-cache, must-revalidate"
  );
};

/* =========================================================
   SEO ERROR RESPONSE
========================================================= */

const sendSeoError = (
  res,
  label,
  error
) => {
  console.error(
    `[SEO] ${label} generation failed:`,
    error
  );

  /*
   * Do not return stale local index.html.
   * It may reference JavaScript files that
   * no longer exist.
   */

  res.setHeader(
    "Cache-Control",
    "no-store"
  );

  return res.status(503).send(
    "This page is temporarily unavailable. Please try again shortly."
  );
};

/* =========================================================
   PRODUCT SEO HTML

   Route:
   /product/:categorySlug/:productSlug

   SEO logic remains unchanged.

   Only the frontend HTML source is updated.
========================================================= */

app.get(
  "/product/:categorySlug/:productSlug",
  async (req, res) => {
    try {
      const { productSlug } = req.params;

      console.log(
        "[SEO] Product page requested:",
        req.originalUrl
      );

      /* -----------------------------------------
         FETCH PRODUCT
      ----------------------------------------- */

      const product =
        await getProductDetails(productSlug);

      if (!product) {
        return res.status(404).send(
          "Product not found"
        );
      }

      /* -----------------------------------------
         FETCH CURRENT FRONTEND HTML
      ----------------------------------------- */

      const html = await getFrontendHtml();

      /* -----------------------------------------
         BUILD EXISTING PRODUCT SEO
      ----------------------------------------- */

      const seoTags = buildProductSeo(
        product,
        req.originalUrl
      );

      /* -----------------------------------------
         INJECT SEO INTO CURRENT HTML
      ----------------------------------------- */

      const finalHtml = injectSeo(
        html,
        seoTags
      );

      /* -----------------------------------------
         RESPONSE
      ----------------------------------------- */

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

/* =========================================================
   BLOG SEO HTML

   Route:
   /blog/:identifier

   Existing SEO logic preserved.
========================================================= */

app.get(
  "/blog/:identifier",
  async (req, res) => {
    try {
      const { identifier } = req.params;

      /* -----------------------------------------
         FETCH BLOG
      ----------------------------------------- */

      const blog =
        await getBlogById(identifier);

      if (
        !blog ||
        blog.status !== "PUBLISHED" ||
        blog.deleted_at
      ) {
        return res.status(404).send(
          "Blog not found"
        );
      }

      /* -----------------------------------------
         FETCH CURRENT FRONTEND HTML
      ----------------------------------------- */

      const html = await getFrontendHtml();

      /* -----------------------------------------
         EXISTING BLOG SEO
      ----------------------------------------- */

      const seoTags = buildBlogSeo(
        blog,
        `/blog/${blog.slug}`
      );

      const finalHtml = injectSeo(
        html,
        seoTags
      );

      /* -----------------------------------------
         RESPONSE
      ----------------------------------------- */

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
        return res.status(404).send(
          "Blog not found"
        );
      }

      return sendSeoError(
        res,
        "Blog SEO",
        error
      );
    }
  }
);

/* =========================================================
   LOCATION SEO HTML

   Route:
   /locations/:slug

   Existing location SEO and canonical
   redirect behavior preserved.
========================================================= */

app.get(
  "/locations/:slug",
  async (req, res) => {
    try {
      const { slug } = req.params;

      console.log(
        "[SEO] Location page requested:",
        req.originalUrl
      );

      /* -----------------------------------------
         FETCH LOCATION
      ----------------------------------------- */

      const location =
        await companyService.getCompanyBySlug(
          slug
        );

      if (
        !location ||
        location.is_active !== true
      ) {
        return res.status(404).send(
          "Location not found"
        );
      }

      /* -----------------------------------------
         CANONICAL LOCATION PATH
      ----------------------------------------- */

      const canonicalPath =
        `/locations/${encodeURIComponent(
          location.slug
        )}`;

      if (req.path !== canonicalPath) {
        return res.redirect(
          301,
          canonicalPath
        );
      }

      /* -----------------------------------------
         FETCH CURRENT FRONTEND HTML
      ----------------------------------------- */

      const html = await getFrontendHtml();

      /* -----------------------------------------
         EXISTING LOCATION SEO
      ----------------------------------------- */

      const seoTags =
        buildLocationSeo(location);

      const finalHtml = injectSeo(
        html,
        seoTags
      );

      /* -----------------------------------------
         RESPONSE
      ----------------------------------------- */

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
        return res.status(404).send(
          "Location not found"
        );
      }

      return sendSeoError(
        res,
        "Location SEO",
        error
      );
    }
  }
);

/* =========================================================
   REACT ROUTER FALLBACK

   For requests reaching the backend that are
   not API routes or SEO routes, serve the
   current frontend HTML.

   This avoids using outdated local dist files.
========================================================= */

app.use(async (req, res) => {
  /*
   * Do not serve React HTML for unknown API
   * endpoints.
   */

  if (
    req.path === "/api" ||
    req.path.startsWith("/api/")
  ) {
    return res.status(404).json({
      success: false,
      message: "API endpoint not found",
    });
  }

  /*
   * Unknown routes should not silently return
   * the SPA for POST/PUT/PATCH/DELETE requests.
   */

  if (
    req.method !== "GET" &&
    req.method !== "HEAD"
  ) {
    return res.status(404).send(
      "Route not found"
    );
  }

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

    return res.status(200).send(html);
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

/* =========================================================
   EXPORT
========================================================= */

module.exports = app;
