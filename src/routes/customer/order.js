"use strict";

const router = require("express").Router();
const OrderController = require("@controllers/customer/OrderController");

/**
 * @swagger
 * tags:
 *   name: Customer-Order
 *   description: CRUD operation Order
 */

router.post("/", OrderController.order);

module.exports = router;
