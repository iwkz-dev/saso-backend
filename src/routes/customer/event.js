"use strict";

const router = require("express").Router();
const EventController = require("@controllers/customer/EventController");

/**
 * @swagger
 * tags:
 *   name: Customer-Event
 *   description: CRUD operation Event-Customer.
 */

/**
 * @swagger
 * /customer/event:
 *    get:
 *      summary: Return the list of all the events
 *      tags: [Customer-Event]
 *      description: If you want to show all items please delete all forms below
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
 *           description: Filter for filtering event depends on status of the event. approved / done / draft
 *           example: approved
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *             application/json:
 *               schema:
 *                  $ref: '#/components/schemas/ResultEvents'
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
router.get("/", EventController.getAllEvents);

module.exports = router;
