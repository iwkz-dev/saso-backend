'use strict';

const router = require('express').Router();
const {
  createOrder,
  capturePayment,
} = require('@controllers/customer/PaymentPaypalController');

router.post('/paypal/order', createOrder);

router.post('/paypal/:orderId/capture', capturePayment);

module.exports = router;
