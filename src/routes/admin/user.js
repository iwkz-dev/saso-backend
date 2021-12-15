"use strict";
const router = require("express").Router();
const UserController = require("@controllers/admin/UserController");
const { authSuperAdmin } = require("@middlewares/auth");

router.use(authSuperAdmin);

router.post("/create", UserController.register);

router.get("/", UserController.getAllUsers);

router.get("/:id/detail", UserController.getUserById);

router.delete("/:id", UserController.delete);

router.patch("/:id/change-active", UserController.changeActive);

router.patch("/:id/change-role", UserController.changeRole);

module.exports = router;
