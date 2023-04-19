'use strict';

const httpStatus = require('http-status-codes');
const Order = require('@models/order');
const Menu = require('@models/menu');
const resHelpers = require('@helpers/responseHelpers');
const { dataPagination } = require('@helpers/dataHelper');

class UserController {
  static async getAllOrders(req, res, next) {
    const { page, limit, invoiceNumber, event } = req.query;
    try {
      const options = {
        page: page || 1,
        limit: limit || 100000,
        sort: {
          type: 'updated_at',
          method: -1,
        },
      };

      const filter = {};
      if (invoiceNumber) {
        filter.invoiceNumber = { $regex: `.*${invoiceNumber}.*` };
      }

      if (event) {
        filter.event = event;
      }

      console.log(filter);
      const findAllOrders = await dataPagination(Order, filter, null, options);
      res
        .status(httpStatus.StatusCodes.OK)
        .json(resHelpers.success('success fetch data', findAllOrders));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async changeStatus(req, res, next) {
    const { status, id } = req.params;
    try {
      // 0 = no action
      let statusPayload = 0;
      const findOrder = await Order.findById(id);
      if (!findOrder) {
        throw { name: 'Not Found', message: 'Order not found' };
      }
      if (findOrder.status === 2) {
        throw {
          name: 'Bad Request',
          message: 'Order has been canceled or refund can not be changed',
        };
      }
      if (status === 'paid') {
        statusPayload = 1;
      }
      if (status === 'refund' || status === 'cancel') {
        statusPayload = 2;
        findOrder.menus.forEach(async (el) => {
          const menuFound = await Menu.findById(el._id);
          const payloadMenu = {
            quantityOrder: menuFound.quantityOrder - el.totalPortion,
          };
          await Menu.update({ _id: el._id }, payloadMenu);
        });
      }
      if (status === 'done') {
        statusPayload = 3;
      }

      const updateOrder = await Order.update(
        { _id: id },
        { status: statusPayload, updated_at: new Date() },
        { new: true }
      );
      res
        .status(httpStatus.StatusCodes.OK)
        .json(resHelpers.success('success change status', updateOrder));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

module.exports = UserController;
