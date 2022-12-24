'use strict';

const router = require('express').Router();
const ContactPersonController = require('@controllers/admin/ContactPersonController');
/**
 * @swagger
 * tags:
 *   name: Admin-Contact-Person
 *   description: CRUD operation Contact Person.
 */

/**
 * @swagger
 * /admin/contact-person:
 *    post:
 *      summary: Create Contact-Person
 *      tags: [Admin-Contact-Person]
 *      description: Create contact person
 *      security:
 *         - ApiKeyAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                 - name
 *                 - phoneNumber
 *              properties:
 *                name:
 *                  type: string
 *                phoneNumber:
 *                  type: string
 *                type:
 *                  type: number
 *                event:
 *                  type: string
 *                  format: uuid
 *      responses:
 *        "201":
 *          description: CREATED
 *          content:
 *             application/json:
 *               schema:
 *                  $ref: '#/components/schemas/ContactPerson'
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
router.post('/', ContactPersonController.create);

/**
 * @swagger
 * /admin/contact-person:
 *    get:
 *      summary: Return the list of all the contact person
 *      tags: [Admin-Contact-Person]
 *      security:
 *         - ApiKeyAuth: []
 *      parameters:
 *         - in: query
 *           name: sort
 *           schema:
 *             type: string
 *           description: Sort criteria depend on key of object data, default updated_at:desc.
 *           example: updated_at:desc
 *         - in: query
 *           name: type
 *           schema:
 *             type: string
 *           description: Filter for filtering contact person depends on type of the contact person. 0 for male, 1 for female.
 *           example: 0
 *         - in: query
 *           name: event
 *           schema:
 *             type: string
 *           description: Event id in bson object, if not defined it will show all contact persons
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
 *                  $ref: '#/components/schemas/ContactPersons'
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
router.get('/', ContactPersonController.getAllContactPersons);

/**
 * @swagger
 * /admin/contact-person/{id}:
 *    delete:
 *      summary: Delete an Contact Person
 *      tags: [Admin-Contact-Person]
 *      security:
 *         - ApiKeyAuth: []
 *      parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Contact Person id
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *             application/json:
 *               schema:
 *                  $ref: '#/components/schemas/ContactPerson'
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
router.delete('/:id', ContactPersonController.destroy);

/**
 * @swagger
 * /admin/contact-person/{id}:
 *    put:
 *      summary: Edit Contact-Person
 *      tags: [Admin-Contact-Person]
 *      security:
 *         - ApiKeyAuth: []
 *      parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Contact Person id
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                 - name
 *                 - phoneNumber
 *              properties:
 *                name:
 *                  type: string
 *                phoneNumber:
 *                  type: string
 *                type:
 *                  type: number
 *                event:
 *                  type: string
 *                  format: uuid
 *      responses:
 *        "201":
 *          description: CREATED
 *          content:
 *             application/json:
 *               schema:
 *                  $ref: '#/components/schemas/ContactPerson'
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
router.put('/:id', ContactPersonController.update);

module.exports = router;
