"use strict";

const router = require("express").Router();
const ContactPersonController = require("@controllers/admin/ContactPersonController");

router.post("/", ContactPersonController.create);
router.get("/", ContactPersonController.getAllContactPersons);
router.delete("/:id", ContactPersonController.destroy);
router.put("/:id", ContactPersonController.update);

module.exports = router;
