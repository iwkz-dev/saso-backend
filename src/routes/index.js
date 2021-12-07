"use strict";

const router = require("express").Router();
const eventRouter = require("@routes/admin/event");
const { errorHandler } = require("../middlewares/errorHandlers");

router.get("/", (req, res) => {
  res.send("You are connected to this app");
});

router.use("/admin/event", eventRouter);

router.use(errorHandler);

module.exports = router;
