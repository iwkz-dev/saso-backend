"use strict";

const router = require("express").Router();
const eventRouter = require("@routes/admin/event");
const userRouter = require("@routes/admin/user");
const authRouter = require("@routes/admin/auth");
const { errorHandler } = require("../middlewares/errorHandlers");

router.get("/", (req, res) => {
  res.send("You are connected to this app");
});

router.use("/admin/event", eventRouter);
router.use("/admin/user", userRouter);
router.use("/admin/auth", authRouter);

router.use(errorHandler);

module.exports = router;
