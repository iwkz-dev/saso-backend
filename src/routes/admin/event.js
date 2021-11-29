"use strict";

const router = require("express").Router();
const EventController = require("@controllers/EventController");

router.post("/", EventController.create);
router.get("/", EventController.getAllEvents);

module.exports = router;
