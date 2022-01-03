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
/**
 * @swagger
 * tags:
 *   name: Admin-User
 *   description: CRUD operation User
 */

/**
 * @swagger
 * /admin/register:
 *    post:
 *      summary: Create user
 *      security:
 *         - ApiKeyAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                 - fullname
 *                 - email
 *                 - password
 *                 - phone
 *              properties:
 *                fullname:
 *                  type: string
 *                email:
 *                  type: string
 *                  format: email
 *                password:
 *                  type: string
 *                  format: password
 *                isActive:
 *                  type: boolean
 *                role:
 *                  type: number
 *                phone:
 *                  type: string
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *             application/json:
 *               schema:
 *                  $ref: '#/components/schemas/User'
 *        "401":
 *           description: Invalid Access token
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Error'
 *               example:
 *                status: failed
 *                message: Invalid Access Token
 *                error: Invalid Auth
 *        "400":
 *           description: Validations Error
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Error'
 *               example:
 *                status: failed
 *                message: Validation Error
 *                error: Validation Error
 */
router.post("/admin/register", UserController.register);

router.use("/auth", authRouter);

router.use(errorHandler);

module.exports = router;
