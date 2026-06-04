const express = require('express');
const router = express.Router();

const lookupController = require('../controller/lookup.controller');

// Lookup Master
router.get('/', lookupController.getAllLookups);
router.get('/:id', lookupController.getLookupById);
router.post('/', lookupController.createLookup);
router.put('/:id', lookupController.updateLookup);
router.delete('/:id', lookupController.deleteLookup);

// Lookup Details
router.get('/:lookupId/details', lookupController.getLookupDetails);
router.post('/:lookupId/details', lookupController.createLookupDetail);
router.put('/details/:id', lookupController.updateLookupDetail);
router.delete('/details/:id', lookupController.deleteLookupDetail);

module.exports = router;