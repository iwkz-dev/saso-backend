"use strict";

const router = require("express").Router();
const MenuController = require("@controllers/admin/MenuController");
const imageKit = require("@middlewares/imageKit");
const { uploadArray } = require("@helpers/multer");

// ! LATER: BELOM ADA IMAGE

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
  "/",
  uploadArray("imageUrls", 5),
  imageKit.imgKitUploadMulti,
  MenuController.create
);

/**
 * @swagger
 * /admin/menu:
 *    get:
 *      summary: Return the list of all the menus
 *      tags: [Admin-Menu]
 *      description: If you want to show all menus please delete all forms below
 *      security:
 *         - ApiKeyAuth: []
 *      parameters:
 *         - in: query
 *           name: event
 *           schema:
 *             type: string
 *           description: Event id in bson object, if not defined it will show all menus
 *           example: 61c57ee6cca613610e9795b1
 *         - in: query
 *           name: category
 *           schema:
 *             type: string
 *           description: Category id in bson object, if not defined it will show all menus
 *           example: 61dbb879a59f547c07e1ce21
 *         - in: query
 *           name: date
 *           schema:
 *             type: string
 *           description: Filter for filtering menus depends on year now, if not defined it will show all menus
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
 *                  $ref: '#/components/schemas/ResultMenus'
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
router.get("/", MenuController.getAllMenus);

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
router.get("/:id/detail", MenuController.getMenuById);

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
router.delete("/:id", MenuController.destroy);

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
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                 - name
 *                 - description
 *                 - quantity
 *                 - price
 *                 - category
 *              properties:
 *                name:
 *                  type: string
 *                description:
 *                  type: string
 *                price:
 *                  type: number
 *                category:
 *                  type: string
 *                  format: uuid
 *                event:
 *                  type: string
 *                  format: uuid
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
router.put("/:id", MenuController.update);

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
router.patch("/:id/add-quantity", MenuController.addQuantity);

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
router.patch("/:id/subs-quantity", MenuController.subsQuantity);

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
  "/:id/upload-images",
  uploadArray("imageUrls", 5),
  imageKit.imgKitUploadMulti,
  MenuController.uploadImages
);

module.exports = router;
