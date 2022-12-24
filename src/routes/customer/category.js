'use strict';

const router = require('express').Router();
const CategoryController = require('@controllers/customer/CategoryController');

/**
 * @swagger
 * tags:
 *   name: Customer-Category
 *   description: CRUD operation Category
 */

/**
 * @swagger
 * /customer/category:
 *    get:
 *      summary: Return the list of all the categories
 *      tags: [Customer-Category]
 *      description: <h1>You have to choose query between status and event, can not do both</h1><br>If you want to show all menus please delete all forms below
 *      parameters:
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
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *             application/json:
 *               schema:
 *                  $ref: '#/components/schemas/DataCategoryMenus'
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
router.get('/', CategoryController.getAllCategories);

module.exports = router;
