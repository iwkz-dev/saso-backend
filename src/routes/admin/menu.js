"use strict";

const router = require("express").Router();
const MenuController = require("@controllers/admin/MenuController");

/**
 * @swagger
 * tags:
 *   name: Admin-Menu
 *   description: CRUD operation Menu
 */

/**
 * @swagger
 * /admin/menu:
 *    post:
 *      summary: Create Menu
 *      tags: [Admin-Menu]
 *      security:
 *         - ApiKeyAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                 - name
 *                 - description
 *                 - quantity
 *                 - price
 *                 - category
 *              properties:
 *                name:
 *                  type: string
 *                description:
 *                  type: string
 *                quantity:
 *                  type: number
 *                price:
 *                  type: number
 *                category:
 *                  type: number
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *             application/json:
 *               schema:
 *                  $ref: '#/components/schemas/Menu'
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
router.post("/", MenuController.create);

/**
 * @swagger
 * /admin/menu:
 *    get:
 *      summary: Return the list of all the menus
 *      tags: [Admin-Menu]
 *      security:
 *         - ApiKeyAuth: []
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *             application/json:
 *               schema:
 *                  $ref: '#/components/schemas/ResultMenus'
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
 *        "500":
 *           description: Error 500
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Error'
 */
router.get("/", MenuController.getAllMenus);

module.exports = router;
