"use strict";

const router = require("express").Router();
const OrderController = require("@controllers/admin/OrderController");

/**
 * @swagger
 * tags:
 *   name: Admin-Order
 *   description: Function order for Admin
 */

/**
 * @swagger
 * /admin/order:
 *    get:
 *      summary: Return the list of all the orders
 *      tags: [Admin-Order]
 *      description: If you want to show all items please delete all forms below, status 1 = menu/s has/have been paid / done paid, status 2 = refund/cancel, status 3 = done
 *      security:
 *         - ApiKeyAuth: []
 *      parameters:
 *         - in: query
 *           name: invoiceNumber
 *           schema:
 *             type: string
 *           description: Invoice number
 *           example: SS2
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
 * /admin/order/{id}/{status}:
 *    patch:
 *      summary: Return detail order
 *      tags: [Admin-Order]
 *      security:
 *         - ApiKeyAuth: []
 *      parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order id
 *         example: 61f116232924ffa77f2bb98b
 *       - in: path
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *         description: status to send, ex => "paid", "refund", "cancel", "done"
 *         example: paid
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
router.patch("/:id/:status", OrderController.changeStatus);

module.exports = router;
