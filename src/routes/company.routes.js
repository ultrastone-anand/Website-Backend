const express = require('express');
const router = express.Router();

const companyController = require('../controller/company.controller');
const authenticate = require('../middlewares/auth.middleware');

// company Master
router.get('/', companyController.getCompany);
router.get('/:id', companyController.getCompanyById);
router.post('/', authenticate , companyController.createCompany);
router.put('/:id', authenticate ,companyController.updateCompany);
router.delete('/:id', authenticate ,companyController.deleteCompany);



module.exports = router;