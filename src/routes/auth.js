"use strict";
const router = require("express").Router();
const AuthController = require("@controllers/AuthController");
const { authChangePassword } = require("@middlewares/auth");

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       description: >-
 *          TEST FOR CUSTOMER: <br>
 *          {<br>
 *              "email": "customer.iwkz@test.com",<br>
 *              "password": "test1234" <br>
 *          }<br>
 *
 *          TEST FOR ADMIN: <br>
 *          {<br>
 *              "email": "admin@test.com",<br>
 *              "password": "test1234"<br>
 *          }
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *             example:
 *               email: superadmin@test.com
 *               password: test1234
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/AuthTokens'
 *       "401":
 *         description: Invalid email or password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               status: failed
 *               message: Email / Password is wrong
 *               error: Invalid Auth
 */
router.post("/login", AuthController.login);

/**
 * @swagger
 * /auth/forget-password:
 *   patch:
 *     summary: generate token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       description: Token will be generated for changing password
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *             example:
 *               email: test@test.com
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/GenerateToken'
 *       "404":
 *         description: Invalid email or password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               status: failed
 *               message: User not found
 *               error: Not Found
 */
router.patch("/forget-password", AuthController.forgetPassword);

/**
 * @swagger
 * /auth/change-password:
 *   patch:
 *     summary: change password from token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       description: Password will be change after token generated
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *               - token
 *             properties:
 *               password:
 *                 type: string
 *               token:
 *                 type: string
 *             example:
 *               password: newpassword
 *               token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFzcmFAYWRtaW4uY29tIiwiaWF0IjoxNjUwNTMwMDExLCJleHAiOjE2NTA1MzM2MTF9.ltgRiKHofK4Fwn8zNfibX5mqCqScbrNQHgq30Ro2kX4
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/AuthTokens'
 *       "404":
 *         description: Invalid email or password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               status: failed
 *               message: User not found
 *               error: Not Found
 *       "401":
 *         description: Invalid email or password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               status: failed
 *               message: Invalid Token
 *               error: Invalid Auth
 */
router.patch(
  "/change-password",
  authChangePassword,
  AuthController.changePassword
);

module.exports = router;
