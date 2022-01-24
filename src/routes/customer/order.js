"use strict";

const router = require("express").Router();
const OrderController = require("@controllers/customer/OrderController");

/**
 * @swagger
 * tags:
 *   name: Customer-Order
 *   description: Function order for customer
 */

/**
 * @swagger
 * /customer/order:
 *    post:
 *      summary: Create Order
 *      tags: [Customer-Order]
 *      security:
 *         - ApiKeyAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                menus:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                       _id:
 *                         type: string
 *                       totalPortion:
 *                         type: number
 *      responses:
 *        "201":
 *          description: CREATED
 *          content:
 *             application/json:
 *               schema:
 *                  $ref: '#/components/schemas/Order'
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
 *           description: Validations Error / Portion out of stock
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Error'
 *               example:
 *                status: failed
 *                message: Validation Error
 *                error: Validation Error
 */
router.post("/", OrderController.order);

/**
 * @swagger
 * /customer/order:
 *    get:
 *      summary: Return the list of all the orders
 *      tags: [Customer-Order]
 *      description: If you want to show all items please delete all forms below
 *      security:
 *         - ApiKeyAuth: []
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
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *             application/json:
 *               schema:
 *                  $ref: '#/components/schemas/ResultOrders'
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
router.get("/", OrderController.getAllOrders);

/**
 * @swagger
 * /customer/order/{id}/detail:
 *    get:
 *      summary: Return detail order
 *      tags: [Customer-Order]
 *      security:
 *         - ApiKeyAuth: []
 *      parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order id
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *             application/json:
 *               schema:
 *                  $ref: '#/components/schemas/Order'
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
 *        "404":
 *           description: Order not found
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Error'
 *               example:
 *                status: failed
 *                message: Order not found
 *                error: Not Found
 *        "403":
 *           description: No authorization for the order
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Error'
 *               example:
 *                status: failed
 *                message: Order not found
 *                error: Not Found
 */
router.get("/:id/detail", OrderController.getOrderById);

// router.get("/:id/refund", OrderController.orderRefund);

module.exports = router;
