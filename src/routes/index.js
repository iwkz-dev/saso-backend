"use strict";

const router = require("express").Router();
const eventRouter = require("@routes/admin/event");
const menuRouter = require("@routes/admin/menu");

router.get("/", (req, res) => {
  res.send("You are connected to this app");
});

router.use("/admin/event", eventRouter);
router.use("/admin/menu", menuRouter);

module.exports = router;
