"use strict";

const router = require("express").Router();
const eventRouter = require("@routes/backoffice/event");
const userRouter = require("@routes/backoffice/user");
const { errorHandler } = require("../middlewares/errorHandlers");

router.get("/", (req, res) => {
  res.send("You are connected to this app");
});

router.use("/backoffice/event", eventRouter);
router.use("/backoffice/user", userRouter);

router.use(errorHandler);

module.exports = router;
