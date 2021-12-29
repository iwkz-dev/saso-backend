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
 * /Customer/order:
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
router.post("/", OrderController.order);

module.exports = router;
