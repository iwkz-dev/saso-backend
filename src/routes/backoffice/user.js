"use strict";
const router = require("express").Router();
const UserController = require("@controllers/UserController");

router.post("/", UserController.register);

router.get("/", UserController.getAllUsers);

router.get("/:id/detail", UserController.getUserById);

module.exports = router;
