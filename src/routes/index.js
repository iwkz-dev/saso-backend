'use strict';

const router = require('express').Router();

const authRouter = require('@routes/auth');
const { errorHandler } = require('@middlewares/errorHandlers');
const { authAdmin, authCustomer } = require('@middlewares/auth');
const UserController = require('@controllers/admin/UserController');

router.get('/', (req, res) => {
  res.send('You are connected to this app');
});

const routerListAdmin = {
  '/event': 'admin/event',
  '/user': 'admin/user',
  '/menu': 'admin/menu',
  '/category': 'admin/category',
  '/order': 'admin/order',
  '/contact-person': 'admin/contactPerson',
};

const routerListCustomer = {
  '/user': 'customer/user',
  '/menu': 'customer/menu',
  '/event': 'customer/event',
  '/category': 'customer/category',
  '/payment': 'customer/payment',
};

const routerListCustomerAuth = {
  '/order': 'customer/order',
};

// ADMIN AUTH
for (const item in routerListAdmin) {
  router.use(
    `/admin${item}`,
    authAdmin,
    // eslint-disable-next-line global-require, import/no-dynamic-require
    require(`@routes/${routerListAdmin[item]}`)
  );
}

// USER NO AUTH
for (const item in routerListCustomer) {
  router.use(
    `/customer${item}`,
    // eslint-disable-next-line global-require, import/no-dynamic-require
    require(`@routes/${routerListCustomer[item]}`)
  );
}

// USER AUTH
for (const item in routerListCustomerAuth) {
  router.use(
    `/customer${item}`,
    authCustomer,
    // eslint-disable-next-line global-require, import/no-dynamic-require
    require(`@routes/${routerListCustomerAuth[item]}`)
  );
}

// ! LATER WILL BEHANDLED
/**
 * @swagger
 * tags:
 *   name: Admin-User
 *   description: CRUD operation User
 */

/**
 * @swagger
 * /admin/register:
 *    post:
 *      summary: Create user
 *      security:
 *         - ApiKeyAuth: []
 *      requestBody:
 *        required: true
 *        description: ROLE = 1 -> Super Admin; 2 -> Admin; 3 -> Customer
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                 - fullname
 *                 - email
 *                 - password
 *                 - phone
 *              properties:
 *                fullname:
 *                  type: string
 *                email:
 *                  type: string
 *                  format: email
 *                password:
 *                  type: string
 *                  format: password
 *                isActive:
 *                  type: boolean
 *                role:
 *                  type: number
 *                phone:
 *                  type: string
 *              example:
 *                fullname: Super Admin
 *                email: superadmin@test.com
 *                password: test1234
 *                isActive: true
 *                role: 1
 *                phone: 011111111110
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *             application/json:
 *               schema:
 *                  $ref: '#/components/schemas/User'
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
router.post('/admin/register', UserController.register);

router.use('/auth', authRouter);

router.use(errorHandler);

module.exports = router;
