const express =
  require("express");

const {
  getSitemap,
} =
  require("../controller/sitemap.controller");

const router =
  express.Router();

/* =========================================================
   SITEMAP
========================================================= */

router.get(
  "/sitemap.xml",
  getSitemap
);

module.exports =
  router;