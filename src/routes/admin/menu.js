'use strict';

const router = require('express').Router();
const MenuController = require('@controllers/admin/MenuController');
const imageKit = require('@middlewares/imageKit');
const { uploadArray, uploadFileXls } = require('@helpers/multer');

/**
 * @swagger
 * tags:
 *   name: Admin-Menu
 *   description: CRUD operation Menu
 */

/**
 * @swagger
 * /admin/menu:
 *    post:
 *      summary: Create Menu
 *      tags: [Admin-Menu]
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
 *                 - quantity
 *                 - price
 *                 - category
 *                 - event
 *              properties:
 *                name:
 *                  type: string
 *                description:
 *                  type: string
 *                quantity:
 *                  type: number
 *                price:
 *                  type: number
 *                category:
 *                  type: string
 *                  format: uuid
 *                event:
 *                  type: string
 *                  format: uuid
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
  '/',
  uploadArray('imageUrls', 5),
  imageKit.imgKitUploadMulti,
  MenuController.create
);

/**
 * @swagger
 * /admin/menu:
 *   get:
 *     summary: Return the list of all menus
 *     tags: [Admin-Menu]
 *     description: >
 *       <h1>Query behavior</h1>
 *       <ul>
 *         <li>If no query parameters are provided, all menus will be returned.</li>
 *         <li>
 *           Menus can be filtered by <b>event</b> directly using the event ID,
 *           or indirectly using <b>status</b> and/or <b>flagDate</b>.
 *         </li>
 *         <li>
 *           When <b>status</b> is provided, the system will search for an event
 *           with the corresponding status (draft, approved, or done) and return
 *           menus associated with that event.
 *         </li>
 *         <li>
 *           When <b>flagDate=now</b> is provided, only events starting from the
 *           current year onward will be considered.
 *         </li>
 *         <li>
 *           The <b>name</b> parameter filters menus based on the related event name.
 *         </li>
 *         <li>
 *           Sorting, pagination, and filtering by category or vendor can be combined
 *           with the above filters.
 *         </li>
 *       </ul>
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sort criteria using field and direction. Default is created_at:desc.
 *         example: created_at:desc
 *
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter menus by event name.
 *         example: Music Festival
 *
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter menus by event status. Allowed values are draft, approved, or done.
 *         example: approved
 *
 *       - in: query
 *         name: event
 *         schema:
 *           type: string
 *         description: Event ID (BSON ObjectId). If not defined, menus from all events will be returned.
 *         example: 61dbb879a59f547c07e1ce21
 *
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Category ID (BSON ObjectId).
 *         example: 61dbb879a59f547c07e1ce21
 *
 *       - in: query
 *         name: vendor
 *         schema:
 *           type: string
 *         description: Vendor ID (BSON ObjectId).
 *         example: 61dbb879a59f547c07e1ce21
 *
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *         description: Current page number.
 *         example: 1
 *
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *         description: Number of items per page.
 *         example: 10
 *
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResultMenus'
 *
 *       "401":
 *         description: Invalid access token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 *       "500":
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', MenuController.getAllMenus);

/**
 * @swagger
 * /admin/menu/{id}/detail:
 *    get:
 *      summary: Return detail menu
 *      tags: [Admin-Menu]
 *      security:
 *         - ApiKeyAuth: []
 *      parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Menu id
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
 */
router.get('/:id/detail', MenuController.getMenuById);

/**
 * @swagger
 * /admin/menu/{id}:
 *    delete:
 *      summary: Delete an Menu
 *      tags: [Admin-Menu]
 *      security:
 *         - ApiKeyAuth: []
 *      parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Menu id
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
 */
router.delete('/:id', MenuController.destroy);

/**
 * @swagger
 * /admin/menu/{id}:
 *    put:
 *      summary: Edit an Menu
 *      tags: [Admin-Menu]
 *      security:
 *         - ApiKeyAuth: []
 *      parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Menu id
 *      requestBody:
 *        required: true
 *        content:
 *          multipart/form-data:
 *            schema:
 *              type: object
 *              required:
 *                 - name
 *                 - description
 *                 - quantity
 *                 - price
 *                 - category
 *                 - event
 *              properties:
 *                name:
 *                  type: string
 *                description:
 *                  type: string
 *                price:
 *                  type: number
 *                quantity:
 *                  type: number
 *                category:
 *                  type: string
 *                  format: uuid
 *                event:
 *                  type: string
 *                  format: uuid
 *                imageUrls:
 *                  type: array
 *                  maxItems: 5
 *                  items:
 *                    type: string
 *                    format: binary
 *                eTags:
 *                  type: array
 *                  maxItems: 5
 *                  items:
 *                    type: string
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
router.put(
  '/:id',
  uploadArray('imageUrls', 5),
  imageKit.imgKitUploadMulti,
  MenuController.update
);

/**
 * @swagger
 * /admin/menu/{id}/add-quantity:
 *    patch:
 *      summary: Add Quantity menu
 *      tags: [Admin-Menu]
 *      security:
 *         - ApiKeyAuth: []
 *      parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Menu id
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                 - quantity
 *              properties:
 *                quantity:
 *                  type: number
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
router.patch('/:id/add-quantity', MenuController.addQuantity);

/**
 * @swagger
 * /admin/menu/{id}/subs-quantity:
 *    patch:
 *      summary: Substract Quantity menu
 *      tags: [Admin-Menu]
 *      security:
 *         - ApiKeyAuth: []
 *      parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Menu id
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                 - quantity
 *              properties:
 *                quantity:
 *                  type: number
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
router.patch('/:id/subs-quantity', MenuController.subsQuantity);

/**
 * @swagger
 * /admin/menu/{id}/upload-images:
 *    patch:
 *      summary: Update image of menu
 *      tags: [Admin-Menu]
 *      security:
 *         - ApiKeyAuth: []
 *      parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Menu id
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
  '/:id/upload-images',
  uploadArray('imageUrls', 5),
  imageKit.imgKitUploadMulti,
  MenuController.uploadImages
);

/**
 * @swagger
 * /admin/menu/{id}/delete-images/{eTag}:
 *    delete:
 *      summary: Delete image of menu
 *      tags: [Admin-Menu]
 *      security:
 *         - ApiKeyAuth: []
 *      parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Menu id
 *       - in: path
 *         name: eTag
 *         required: true
 *         schema:
 *           type: string
 *         description: eTag of the Image
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
 *           description: Bad Request
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Error'
 *               example:
 *                status: failed
 *                message: Validation Error
 *                error: Validation Error
 */
router.delete('/:id/delete-images/:eTag', MenuController.destroyImages);

/**
 * @swagger
 * /admin/menu/bulkCreate:
 *    post:
 *      summary: Bulk create of menus
 *      tags: [Admin-Menu]
 *      security:
 *         - ApiKeyAuth: []
 *      requestBody:
 *        required: true
 *        description: |
 *            The file should be in .xlsx | <br>
 *            <b>Sample table <i>Please crete .xlsx file with format like below</i>:</b>
 *              | Name | Description | Quantity | Price | Category      |
 *              |------|-------------|----------|-------|---------------|
 *              | Sate | Sate Enak   | 12       | 5     | Makanan Besar |
 *        content:
 *          multipart/form-data:
 *            schema:
 *              type: object
 *              properties:
 *                file:
 *                  type: string
 *                  format: binary
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *             application/json:
 *               schema:
 *                  $ref: '#/components/schemas/ResultBulkMenus'
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
router.post('/bulkCreate', uploadFileXls('file'), MenuController.bulkCreate);

module.exports = router;
