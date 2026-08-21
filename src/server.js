const express = require('express');
const cors = require('cors');
const path = require("path");

const fs = require("fs");
const { buildProductSeo, injectSeo } = require("./utils/seoHtml");
const { getProductDetails } = require("./services/stone.service");

const pageRoutes = require('./routes/page.routes');
const blogRoutes = require('./routes/blog.routes');
const userRoutes = require('./routes/user.routes');
const stoneRoutes = require('./routes/stone.routes');
const careerRoutes = require('./routes/career.routes');
const reportRoutes = require('./routes/report.routes');
const lookupRoutes = require('./routes/lookup.routes');
const companyRoutes = require('./routes/company.routes');
const activityRoutes = require('./routes/activity.routes');
const dasboardRoutes = require('./routes/dashboard.routes');
const lotImagesRoutes = require("./routes/lotImages.routes");
const instagramRoutes = require('./routes/instagram.routes');
const newsLetterRoutes = require('./routes/newsletter.routes');
const contactRoutes = require('./routes/contactEnquiry.routes');
const GlobalSerchRoutes = require('./routes/globalsearch.route');
const ProductRemarkRoutes =require('./routes/productRemark.routes');
const sampleRequestRoutes = require("./routes/sampleRequest.routes");
const bulkDescriptionRoutes = require("./routes/bulkDescription.routes");
const inspirationGalleryRoutes = require("./routes/inspirationGallery.routes");


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
app.use("/api/sample-requests",sampleRequestRoutes);
app.use("/api/bulk-descriptions",bulkDescriptionRoutes);
app.use("/api/inspiration-gallery", inspirationGalleryRoutes);

const frontendDistPath = path.join(__dirname, "../dist");
const frontendIndexPath = path.join(frontendDistPath, "index.html");

app.use(express.static(frontendDistPath));

app.get("/product/:categorySlug/:productSlug", async (req, res, next) => {
  try {
    const html = fs.readFileSync(frontendIndexPath, "utf8");
    const { productSlug } = req.params;

    const product = await getProductDetails(productSlug);

    const seoTags = buildProductSeo(product, req.originalUrl);
    const finalHtml = injectSeo(html, seoTags);

    res.setHeader("Content-Type", "text/html");
    return res.send(finalHtml);
  } catch (error) {
    console.error("SEO HTML error:", error);
    return res.sendFile(frontendIndexPath);
  }
});

app.use((req, res) => {
  res.sendFile(frontendIndexPath);
});

module.exports = app;