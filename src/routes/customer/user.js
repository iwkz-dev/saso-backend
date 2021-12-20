"use strict";
const router = require("express").Router();
const UserController = require("@controllers/customer/UserController");
const { authSuperAdmin } = require("@middlewares/auth");

router.post("/register", UserController.register);

module.exports = router;
