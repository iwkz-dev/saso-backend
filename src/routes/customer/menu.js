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
 *      parameters:
 *         - in: query
 *           name: event
 *           schema:
 *             type: string
 *         - in: query
 *           name: category
 *           schema:
 *             type: string
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *             application/json:
 *               schema:
 *                  $ref: '#/components/schemas/ResultMenus'
 *        "500":
 *           description: Error 500
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Error'
 */
router.get("/", MenuController.getAllMenus);

module.exports = router;
