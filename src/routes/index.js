"use strict";

const router = require("express").Router();

const authRouter = require("@routes/auth");
const { errorHandler } = require("@middlewares/errorHandlers");
const { authAdmin, authCustomer } = require("@middlewares/auth");
const UserController = require("@controllers/admin/UserController");

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
  "/menu": "admin/menu",
};

const routerListCustomerAuth = {
  "/order": "customer/order",
};

// ADMIN AUTH
for (let item in routerListAdmin) {
  router.use(
    "/admin" + item,
    authAdmin,
    require("@routes/" + routerListAdmin[item])
  );
}

// USER NO AUTH
for (let item in routerListCustomer) {
  router.use(
    "/customer" + item,
    require("@routes/" + routerListCustomer[item])
  );
}

// USER AUTH
for (let item in routerListCustomerAuth) {
  router.use(
    "/customer" + item,
    authCustomer,
    require("@routes/" + routerListCustomerAuth[item])
  );
}

// ! LATER WILL BEHANDLED
router.post("/admin/register", UserController.register);

router.use("/auth", authRouter);

router.use(errorHandler);

module.exports = router;
