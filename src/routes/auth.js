"use strict";
const router = require("express").Router();
const AuthController = require("@controllers/AuthController");

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

module.exports = router;
