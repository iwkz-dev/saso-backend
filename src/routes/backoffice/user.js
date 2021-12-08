"use strict";
const router = require("express").Router();
const UserController = require("@controllers/UserController");

router.post("/", UserController.register);

router.get("/", UserController.getAllUsers);

router.get("/:id/detail", UserController.getUserById);

router.delete("/:id", UserController.delete);

router.patch("/:id/change-active", UserController.changeActive);

router.patch("/:id/change-role", UserController.changeRole);

module.exports = router;
