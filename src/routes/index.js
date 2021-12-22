"use strict";

const router = require("express").Router();

const authRouter = require("@routes/auth");
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

const routerListCustomer = {
  "/user": "customer/user",
};

for (let item in routerListAdmin) {
  router.use(
    "/admin" + item,
    // authAdmin,
    require("@routes/" + routerListAdmin[item])
  );
}

for (let item in routerListCustomer) {
  router.use(
    "/customer" + item,
    require("@routes/" + routerListCustomer[item])
  );
}

router.use("/auth", authRouter);

router.use(errorHandler);

module.exports = router;
