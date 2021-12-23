"use strict";
const router = require("express").Router();
const UserController = require("@controllers/customer/UserController");
const { authSuperAdmin } = require("@middlewares/auth");

/**
 * @swagger
 * tags:
 *   name: Customer-User
 *   description: CRUD operation User
 */

/**
 * @swagger
 * /customer/user/register:
 *    post:
 *      summary: Create user
 *      tags: [Customer-User]
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
router.post("/register", UserController.register);

module.exports = router;
