"use strict";

const router = require("express").Router();
const EventController = require("@controllers/admin/EventController");
const imageKit = require("@middlewares/imageKit");
const { uploadArray } = require("@helpers/multer");

/**
 * @swagger
 * tags:
 *   name: Admin-Event
 *   description: CRUD operation Event
 */

/**
 * @swagger
 * /admin/event:
 *    post:
 *      summary: Create Event
 *      tags: [Admin-Event]
 *      security:
 *         - ApiKeyAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *          multipart/form-data:
 *            schema:
 *              type: object
 *              required:
 *                 - name
 *                 - description
 *              properties:
 *                name:
 *                  type: string
 *                description:
 *                  type: string
 *                started_at:
 *                  type: string
 *                  format: date-time
 *                imageUrls:
 *                  type: array
 *                  maxItems: 5
 *                  items:
 *                    type: string
 *                    format: binary
 *      responses:
 *        "201":
 *          description: CREATED
 *          content:
 *             application/json:
 *               schema:
 *                  $ref: '#/components/schemas/Event'
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
router.post(
  "/",
  uploadArray("imageUrls", 5),
  imageKit.imgKitUploadMulti,
  EventController.create
);

/**
 * @swagger
 * /admin/event:
 *    get:
 *      summary: Return the list of all the events
 *      tags: [Admin-Event]
 *      description: If you want to show all items please delete all forms below
 *      security:
 *         - ApiKeyAuth: []
 *      parameters:
 *         - in: query
 *           name: date
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

/**
 * @swagger
 * /admin/event/{id}/detail:
 *    get:
 *      summary: Return detail event
 *      tags: [Admin-Event]
 *      security:
 *         - ApiKeyAuth: []
 *      parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Event id
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *             application/json:
 *               schema:
 *                  $ref: '#/components/schemas/Event'
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
 *           description: Event not found
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Error'
 *               example:
 *                status: failed
 *                message: Event not found
 *                error: Not Found
 */
router.get("/:id/detail", EventController.getEventById);

/**
 * @swagger
 * /admin/event/{id}:
 *    delete:
 *      summary: Delete an Event
 *      tags: [Admin-Event]
 *      security:
 *         - ApiKeyAuth: []
 *      parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Event id
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *             application/json:
 *               schema:
 *                  $ref: '#/components/schemas/Event'
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
 *           description: Event not found
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Error'
 *               example:
 *                status: failed
 *                message: Event not found
 *                error: Not Found
 */
router.delete("/:id", EventController.destroy);

/**
 * @swagger
 * /admin/event/{id}:
 *    put:
 *      summary: Edit an Event
 *      tags: [Admin-Event]
 *      security:
 *         - ApiKeyAuth: []
 *      parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Event id
 *      requestBody:
 *        required: true
 *        content:
 *          multipart/form-data:
 *            schema:
 *              type: object
 *              required:
 *                 - name
 *                 - description
 *              properties:
 *                name:
 *                  type: string
 *                description:
 *                  type: string
 *                started_at:
 *                  type: string
 *                  format: date-time
 *                imageUrls:
 *                  type: array
 *                  maxItems: 5
 *                  items:
 *                    type: string
 *                    format: binary
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *             application/json:
 *               schema:
 *                  $ref: '#/components/schemas/Event'
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
 *           description: Event not found
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Error'
 *               example:
 *                status: failed
 *                message: Event not found
 *                error: Not Found
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
router.put("/:id", EventController.update);

/**
 * @swagger
 * /admin/event/{id}/upload-images:
 *    patch:
 *      summary: Update image of menu
 *      tags: [Admin-Event]
 *      security:
 *         - ApiKeyAuth: []
 *      parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Event id
 *      requestBody:
 *        required: true
 *        content:
 *          multipart/form-data:
 *            schema:
 *              type: object
 *              properties:
 *                imageUrls:
 *                  type: array
 *                  maxItems: 5
 *                  items:
 *                    type: string
 *                    format: binary
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *             application/json:
 *               schema:
 *                  $ref: '#/components/schemas/Menu'
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
 *           description: Menu not found
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Error'
 *               example:
 *                status: failed
 *                message: Menu not found
 *                error: Not Found
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
router.patch(
  "/:id/upload-images",
  uploadArray("imageUrls", 5),
  imageKit.imgKitUploadMulti,
  EventController.uploadImages
);

router.post(
  "/upload-image",
  uploadArray("imageUrls", 5),
  imageKit.imgKitUploadMulti,
  EventController.uploadImage
);

module.exports = router;
