const express = require('express');
const router = express.Router();

const lookupController = require('../controller/lookup.controller');
const authenticate = require('../middlewares/auth.middleware');

// Lookup Master
router.get('/', lookupController.getAllLookups);
router.get('/:id', lookupController.getLookupById);
router.post('/', authenticate , lookupController.createLookup);
router.put('/:id', authenticate ,lookupController.updateLookup);
router.delete('/:id', authenticate ,lookupController.deleteLookup);

// Lookup Details
router.get('/:lookupId/details', lookupController.getLookupDetails);
router.post('/:lookupId/details', authenticate ,lookupController.createLookupDetail);
router.put('/details/:id', authenticate ,lookupController.updateLookupDetail);
router.delete('/details/:id', authenticate ,lookupController.deleteLookupDetail);

module.exports = router;