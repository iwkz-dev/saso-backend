"use strict";

const router = require("express").Router();

const authRouter = require("@routes/admin/auth");
const { errorHandler } = require("@middlewares/errorHandlers");
const { authAdmin } = require("@middlewares/auth");

router.get("/", (req, res) => {
  res.send("You are connected to this app");
});

const routerListAdmin = {
  "/event": "admin/event",
  "/user": "admin/user",
  "/menu": "admin/menu",
};

for (let item in routerListAdmin) {
  router.use(
    "/admin" + item,
    authAdmin,
    require("@routes/" + routerListAdmin[item])
  );
}

router.use("/admin/auth", authRouter);

router.use(errorHandler);

module.exports = router;
