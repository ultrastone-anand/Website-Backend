const router = require("express").Router();

const upload = require("../middlewares/upload");
const authenticate = require("../middlewares/auth.middleware");

const controller = require("../controller/categoryResource.controller");

// ==============================
// PUBLIC
// ==============================

// All active public resources
router.get(
  "/public",
  controller.getPublicResources
);

// Active resources by category slug
router.get(
  "/category/:slug",
  controller.getResourcesByCategory
);

// ==============================
// ADMIN
// ==============================

router.get(
  "/",
  authenticate,
  controller.getResources
);

router.get(
  "/:id",
  authenticate,
  controller.getResourceById
);

router.post(
  "/",
  authenticate,
  upload.fields([
    {
      name: "pdf",
      maxCount: 1,
    },
  ]),
  controller.createResource
);

router.put(
  "/:id",
  authenticate,
  upload.fields([
    {
      name: "pdf",
      maxCount: 1,
    },
  ]),
  controller.updateResource
);

router.patch(
  "/:id/status",
  authenticate,
  controller.updateResourceStatus
);

router.delete(
  "/:id",
  authenticate,
  controller.deleteResource
);

module.exports = router;