"use strict";

const router = require("express").Router();
const eventRouter = require("@routes/admin/event");

router.get("/", (req, res) => {
  res.send("You are connected to this app");
});

router.use("/admin/event", eventRouter);

module.exports = router;
