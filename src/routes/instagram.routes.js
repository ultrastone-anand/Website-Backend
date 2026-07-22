// routes/instagram.routes.js

const express = require('express');

const instagramController = require(
  '../controller/instagram.controller'
);

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Public route
|--------------------------------------------------------------------------
| Used by the Ultra Stones homepage.
| Never returns the Instagram access token.
*/

router.get(
  '/posts',
  instagramController.getInstagramPosts
);

/*
|--------------------------------------------------------------------------
| CMS routes
|--------------------------------------------------------------------------
| Add your existing authentication middleware before enabling these routes.
|
| Example:
| const authenticateToken = require('../middleware/auth.middleware');
|
| router.get(
|   '/admin/status',
|   authenticateToken,
|   instagramController.getInstagramStatus
| );
*/

router.get(
  '/admin/status',
  instagramController.getInstagramStatus
);

router.post(
  '/admin/refresh',
  instagramController.refreshInstagramToken
);

router.post(
  '/admin/test',
  instagramController.testInstagramConnection
);

module.exports = router;