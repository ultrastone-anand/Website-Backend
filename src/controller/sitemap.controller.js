const {
  generateSitemap,
} = require("../services/sitemap.service");

/* =========================================================
   GET SITEMAP
========================================================= */

const getSitemap = async (
  req,
  res
) => {
  try {
    const {
      xml,
      count,
    } =
      await generateSitemap();

    res.setHeader(
      "Content-Type",
      "application/xml; charset=utf-8"
    );

    res.setHeader(
      "Cache-Control",
      "public, max-age=3600"
    );

    res.setHeader(
      "X-Sitemap-URL-Count",
      String(count)
    );

    return res
      .status(200)
      .send(xml);

  } catch (error) {
    console.error(
      "Sitemap generation error:",
      error
    );

    return res
      .status(500)
      .type("text/plain")
      .send(
        "Unable to generate sitemap."
      );
  }
};

module.exports = {
  getSitemap,
};