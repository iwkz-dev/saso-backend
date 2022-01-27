"use strict";

const router = require("express").Router();
const OrderController = require("@controllers/admin/OrderController");

router.get("/", OrderController.getAllOrders);

router.patch("/:id/:status", OrderController.changeStatus);

module.exports = router;
