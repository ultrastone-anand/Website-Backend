const express =
  require("express");

const router =
  express.Router();

const controller =
  require(
    "../controller/homeHero.controller"
  );

/* =========================================================
   NO CACHE
========================================================= */

router.use(
  (
    req,
    res,
    next
  ) => {
    res.setHeader(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    );

    res.setHeader(
      "Pragma",
      "no-cache"
    );

    res.setHeader(
      "Expires",
      "0"
    );

    res.setHeader(
      "Surrogate-Control",
      "no-store"
    );

    next();
  }
);

/* =========================================================
   ACTIVE HERO
========================================================= */

/*
 * Final homepage resolver.
 *
 * Priority:
 *
 * 1. Live custom campaign
 * 2. Live holiday
 * 3. Default homepage hero
 *
 * Campaign / holiday priority determines winner
 * when both are live.
 *
 * Equal priority:
 * campaign wins.
 */

router.get(
  "/active",
  controller.getActiveHero
);

/* =========================================================
   DEFAULT HERO
========================================================= */

router.get(
  "/default",
  controller.getDefaultHero
);

router.put(
  "/default",
  controller.updateDefaultHero
);

/* =========================================================
   CUSTOM CAMPAIGNS
========================================================= */

router.get(
  "/campaigns",
  controller.getCampaigns
);

router.get(
  "/campaigns/:id",
  controller.getCampaignById
);

router.post(
  "/campaigns",
  controller.createCampaign
);

router.put(
  "/campaigns/:id",
  controller.updateCampaign
);

router.patch(
  "/campaigns/:id/toggle",
  controller.toggleCampaign
);

router.delete(
  "/campaigns/:id",
  controller.deleteCampaign
);

/* =========================================================
   HOLIDAYS
========================================================= */

router.get(
  "/holidays",
  controller.getHolidays
);

router.get(
  "/holidays/:id",
  controller.getHolidayById
);

router.put(
  "/holidays/:id",
  controller.updateHoliday
);

router.patch(
  "/holidays/:id/toggle",
  controller.toggleHoliday
);

/* =========================================================
   MEDIA
========================================================= */

router.post(
  "/media/presign",
  controller.createMediaUploadUrls
);

router.delete(
  "/media",
  controller.deleteMedia
);

/* =========================================================
   EXPORT
========================================================= */

module.exports =
  router;