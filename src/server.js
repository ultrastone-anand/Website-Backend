const express = require('express');
const cors = require('cors');
const path = require("path");

const fs = require("fs");

const { getBlogById } = require("./services/blog.service");
const companyService = require("./services/company.service");
const { buildProductSeo,buildBlogSeo, injectSeo , buildLocationSeo } = require("./utils/seoHtml");
const { getProductDetails } = require("./services/stone.service");

const pageRoutes = require('./routes/page.routes');
const blogRoutes = require('./routes/blog.routes');
const userRoutes = require('./routes/user.routes');
const stoneRoutes = require('./routes/stone.routes');
const careerRoutes = require('./routes/career.routes');
const reportRoutes = require('./routes/report.routes');
const lookupRoutes = require('./routes/lookup.routes');
const companyRoutes = require('./routes/company.routes');
const sitemapRoutes = require("./routes/sitemap.routes");
const activityRoutes = require('./routes/activity.routes');
const homeHeroRoutes = require("./routes/homeHero.routes");
const dasboardRoutes = require('./routes/dashboard.routes');
const lotImagesRoutes = require("./routes/lotImages.routes");
const instagramRoutes = require('./routes/instagram.routes');
const newsLetterRoutes = require('./routes/newsletter.routes');
const ceuRequestRoutes = require("./routes/ceuRequest.routes");
const contactRoutes = require('./routes/contactEnquiry.routes');
const GlobalSerchRoutes = require('./routes/globalsearch.route');
const ProductRemarkRoutes =require('./routes/productRemark.routes');
const sampleRequestRoutes = require("./routes/sampleRequest.routes");
const displayRequestRoutes = require("./routes/displayRequest.routes");
const contactRequestRoutes = require("./routes/contactRequest.routes");
const bulkDescriptionRoutes = require("./routes/bulkDescription.routes");
const categoryResourceRoutes = require('./routes/categoryResource.routes');
const inspirationGalleryRoutes = require("./routes/inspirationGallery.routes");
const productRegistrationRoutes = require("./routes/ProductRegistration.routes");


const app = express();

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


app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "../uploads")
  )
);


app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Ultrastone API Running'
  });
});

app.use("/api/blog", blogRoutes);
app.use("/api/pages", pageRoutes);
app.use('/api/users', userRoutes);
app.use('/api/stones', stoneRoutes);
app.use("/api/home-hero",homeHeroRoutes);
app.use('/api/careers',careerRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/lookups', lookupRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/dashboard', dasboardRoutes);
app.use('/api/activitie', activityRoutes);
app.use('/api/search', GlobalSerchRoutes);
app.use('/api/instagram', instagramRoutes);
app.use("/api/lot-images",lotImagesRoutes);
app.use('/api/newsletter', newsLetterRoutes);
app.use('/api/products', ProductRemarkRoutes);
app.use('/api/ceu-request', ceuRequestRoutes);
app.use("/api/sample-requests",sampleRequestRoutes);
app.use("/api/display-request",displayRequestRoutes);
app.use("/api/contact-request",contactRequestRoutes);
app.use("/api/bulk-descriptions",bulkDescriptionRoutes);
app.use('/api/category-resources', categoryResourceRoutes);
app.use("/api/inspiration-gallery", inspirationGalleryRoutes);
app.use("/api/product-registrations", productRegistrationRoutes);

/* =========================================================
   PUBLIC SITEMAP
========================================================= */

app.use("/", sitemapRoutes);

/* =========================================================
   FRONTEND CONFIGURATION
========================================================= */

const frontendDistPath = path.join(
  __dirname,
  "../dist"
);

const frontendIndexPath = path.join(
  frontendDistPath,
  "index.html"
);

/* =========================================================
   PRODUCT SEO HTML
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

      const product = await getProductDetails(
        productSlug
      );

      if (!product) {
        return res.status(404).send(
          "Product not found"
        );
      }

      const html = await fs.promises.readFile(
        frontendIndexPath,
        "utf8"
      );

      const seoTags = buildProductSeo(
        product,
        req.originalUrl
      );

      const finalHtml = injectSeo(
        html,
        seoTags
      );

      res.setHeader(
        "Content-Type",
        "text/html; charset=utf-8"
      );

      res.setHeader(
        "X-SEO-Source",
        "express-product"
      );

      return res.status(200).send(
        finalHtml
      );

    } catch (error) {
      console.error(
        "[SEO] Product SEO generation failed:",
        error
      );

      return res.status(500).send(
        "Product SEO generation failed"
      );
    }
  }
);


/* =========================================================
   BLOG SEO HTML
========================================================= */

app.get(
  "/blog/:identifier",
  async (req, res) => {
    try {
      const { identifier } = req.params;

      const blog = await getBlogById(identifier);

      if (
        !blog ||
        blog.status !== "PUBLISHED" ||
        blog.deleted_at
      ) {
        return res.status(404).send(
          "Blog not found"
        );
      }

      const html = await fs.promises.readFile(
        frontendIndexPath,
        "utf8"
      );

      const seoTags = buildBlogSeo(
  blog,
  `/blog/${blog.slug}`
);

      const finalHtml = injectSeo(
        html,
        seoTags
      );

      res.setHeader(
        "Content-Type",
        "text/html; charset=utf-8"
      );

      res.setHeader(
        "X-SEO-Source",
        "express-blog"
      );

      return res.status(200).send(
        finalHtml
      );

    } catch (error) {
      if (
        error.message === "Blog post not found"
      ) {
        return res.status(404).send(
          "Blog not found"
        );
      }

      console.error(
        "[SEO] Blog SEO generation failed:",
        error
      );

      return res.status(500).send(
        "Blog SEO generation failed"
      );
    }
  }
);


/* =========================================================
   LOCATION SEO HTML
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

      const location =
        await companyService.getCompanyBySlug(slug);

      if (!location || location.is_active !== true) {
        return res.status(404).send(
          "Location not found"
        );
      }

      const canonicalPath =
        `/locations/${encodeURIComponent(location.slug)}`;

      // Redirect non-canonical slugs if necessary.
      if (req.path !== canonicalPath) {
        return res.redirect(301, canonicalPath);
      }

      const html =
        await fs.promises.readFile(
          frontendIndexPath,
          "utf8"
        );

      const seoTags =
        buildLocationSeo(location);

      const finalHtml =
        injectSeo(html, seoTags);

      res.setHeader(
        "Content-Type",
        "text/html; charset=utf-8"
      );

      res.setHeader(
        "X-SEO-Source",
        "express-location"
      );

      return res.status(200).send(finalHtml);

    } catch (error) {
      if (
        error.message === "Showroom not found"
      ) {
        return res.status(404).send(
          "Location not found"
        );
      }

      console.error(
        "[SEO] Location SEO generation failed:",
        error
      );

      return res.status(500).send(
        "Location SEO generation failed"
      );
    }
  }
);


/* =========================================================
   STATIC FRONTEND ASSETS
========================================================= */

app.use(
  express.static(frontendDistPath)
);

/* =========================================================
   REACT ROUTER FALLBACK
========================================================= */

app.use((req, res) => {
  return res.sendFile(
    frontendIndexPath
  );
});
module.exports = app;