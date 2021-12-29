"use strict";

const router = require("express").Router();
const MenuController = require("@controllers/customer/MenuController");

/**
 * @swagger
 * tags:
 *   name: Customer-Menu
 *   description: CRUD operation Menu
 */

/**
 * @swagger
 * /customer/menu:
 *    get:
 *      summary: Return the list of all the menus
 *      tags: [Customer-Menu]
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
