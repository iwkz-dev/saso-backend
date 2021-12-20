"use strict";

const router = require("express").Router();
const EventController = require("@controllers/admin/EventController");
const imageKit = require("@middlewares/imageKit");
const { uploadArray } = require("@helpers/multer");

/**
 * @swagger
 * components:
 *    schemas:
 *      Event:
 *        type: object
 *        required:
 *          - name
 *          - description
 *        properties:
 *          id:
 *            type: string
 *            description: Event Id generate automatically
 *          name:
 *            type: string
 *            description: Name of an Event
 *          description:
 *            type: string
 *            description: Description of an Event
 *          started_at:
 *            type: date
 *            description: Start date of Event
 *          images:
 *            type: array
 *            description: List image of Event
 *          updated_at:
 *            type: date
 *            description: Date of Event when updated
 *          created_at:
 *            type: date
 *            description: Date of Event when first created
 *        example:
 *          id: 61b0213b2c1cd3bc4b2f39cd
 *          name: Saso 2021
 *          description: Saso 2021 is the best
 *          images: Array
 *          started_at: 2021-10-10T00:00:00.000Z
 *          updated_at: 2021-12-20T03:43:15.192Z
 *          created_at: 2021-12-20T03:43:15.192Z
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
 *      security:
 *        - JWT: []
 *      summary: Returns the list of all the events
 *      responses:
 *      '200':
 *        description: The list of the events
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Event'
 *
 */
router.get("/", EventController.getAllEvents);

router.get("/:id/detail", EventController.getEventById);

router.delete("/:id", EventController.destroy);

router.put(
  "/:id",
  uploadArray("imageUrls", 5),
  imageKit.imgKitUploadMulti,
  EventController.update
);

router.post(
  "/upload-image",
  uploadArray("imageUrls", 5),
  imageKit.imgKitUploadMulti,
  EventController.uploadImage
);

module.exports = router;
