'use strict';

const router = require('express').Router();
const PaymentTypeController = require('@controllers/admin/PaymentTypeController');

router.post('/', PaymentTypeController.create);
router.get('/', PaymentTypeController.getAllPaymentTypes);
router.get('/:id/detail', PaymentTypeController.getPaymentTypeById);
router.put('/:id', PaymentTypeController.update);
router.delete('/:id', PaymentTypeController.delete);

module.exports = router;
