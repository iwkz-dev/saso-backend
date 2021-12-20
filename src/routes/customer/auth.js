"use strict";
const router = require("express").Router();
const AuthController = require("@controllers/customer/AuthController");

router.post("/login", AuthController.login);

module.exports = router;
