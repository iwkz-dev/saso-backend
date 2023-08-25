'use strict';

const router = require('express').Router();
const OrderGuestController = require('@controllers/customer/OrderGuestController');

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
 *                event:
 *                  type: string
 *                  format: uuid
 *                note:
 *                  type: string
 *                arrivedAt:
 *                  type: string
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
router.post('/', OrderGuestController.order);

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
router.get('/search-order', OrderGuestController.getOrderByInvoiceNumber);

router.post('/approve-guest', OrderGuestController.approveOrder);

/**
 * @swagger
 * /customer/order/{id}/generatePdf:
 *    post:
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
router.post('/:id/generatePdf', OrderGuestController.generatePdf);

// router.get("/:id/refund", OrderController.orderRefund);

module.exports = router;
