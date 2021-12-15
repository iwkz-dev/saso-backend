"use strict";

const router = require("express").Router();
const MenuController = require("@controllers/admin/MenuController");

router.post("/", MenuController.create);
router.get("/", MenuController.getAllMenus);

module.exports = router;
