"use strict";
const router = require("express").Router();
const AuthController = require("@controllers/admin/AuthController");

router.post("/login", AuthController.login);

module.exports = router;
