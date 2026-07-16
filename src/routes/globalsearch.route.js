const express = require('express');
const serchController = require('../controller/globalsearch.controller');
const router = express.Router();


router.get("/", serchController.searchWebsite);

module.exports = router;