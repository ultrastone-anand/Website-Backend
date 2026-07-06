const express = require('express');
const router = express.Router();

const companyController = require('../controller/company.controller');
const authenticate = require('../middlewares/auth.middleware');

// Social Media
router.get('/socialmedia', companyController.getAllSocialMedia);
router.get('/socialmedia/:id', companyController.getSocialMedia);
router.post('/socialmedia', authenticate, companyController.createSocialMedia);
router.put('/socialmedia/:id', authenticate, companyController.updateSocialMedia);
router.delete('/socialmedia/:id', authenticate, companyController.deleteSocialMedia);


// company Master
router.get('/', companyController.getCompany);
router.get('/:id', companyController.getCompanyById);
router.get('/slug/:slug', companyController.getCompanyBySlug);
router.post('/', authenticate , companyController.createCompany);
router.put('/:id', authenticate ,companyController.updateCompany);
router.delete('/:id', authenticate ,companyController.deleteCompany);


module.exports = router;