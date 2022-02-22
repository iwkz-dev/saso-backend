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
 *      security:
 *         - ApiKeyAuth: []
 *      parameters:
 *         - in: query
 *           name: flagDate
 *           schema:
 *             type: string
 *           description: Filter for filtering events depends on year now, if not defined it will show all events
 *           example: now
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
 *           name: isActive
 *           schema:
 *             type: boolean
 *           description: Status of the event
 *           example: true
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