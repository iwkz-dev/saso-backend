'use strict';

const router = require('express').Router();
const VendorController = require('@controllers/admin/VendorController');

router.post('/', VendorController.create);
router.get('/', VendorController.getAllCategories);
router.get('/:id/detail', VendorController.getVendorById);
router.put('/:id', VendorController.update);
router.delete('/:id', VendorController.delete);

module.exports = router;
