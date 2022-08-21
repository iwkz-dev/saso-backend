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
 *      description: <h1>You have to choose query between status and event, can not do both</h1><br>If you want to show all items please delete all forms below
 *      parameters:
 *         - in: query
 *           name: status
 *           schema:
 *             type: string
 *           description: Filter for filtering event depends on status of the event. approved / done / draft.
 *           example: approved
 *         - in: query
 *           name: event
 *           schema:
 *             type: string
 *           description: Event id in bson object, if not defined it will show all menus
 *         - in: query
 *           name: category
 *           schema:
 *             type: string
 *           description: Category id in bson object, if not defined it will show all menus
 *           example: 61dbb879a59f547c07e1ce21
 *         - in: query
 *           name: page
 *           schema:
 *             type: number
 *           description: Number of current page
 *           example: 1
 *         - in: query
 *           name: limit
 *           schema:
 *             type: number
 *           description: Number of items will shown in one page
 *           example: 2
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
