'use strict';

const httpStatus = require('http-status-codes');
const Order = require('@models/order');
const Menu = require('@models/menu');
const PaymentType = require('@models/paymentType');
const Event = require('@models/event');
const resHelpers = require('@helpers/responseHelpers');
const { dataPagination } = require('@helpers/dataHelper');
const { invoiceTemplate } = require('@helpers/templates');
const { mailer } = require('@helpers/nodemailer');

class OrderController {
  static async getAllOrders(req, res, next) {
    const { page, limit, invoiceNumber, event } = req.query;
    try {
      const options = {
        page: page || 1,
        limit: limit || 100000,
        sort: {
          type: 'created_at',
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

      const findUpdatedOrder = await Order.findById(id);

      const findEvent = await Event.findOne({ _id: findUpdatedOrder.event });
      if (findEvent.status !== 1 || !findEvent) {
        throw { name: 'Bad Request', message: 'Event not found' };
      }

      const findPaymentType = await PaymentType.findOne({
        _id: findUpdatedOrder.paymentType,
      });
      if (!findPaymentType) {
        throw { name: 'Bad Request', message: 'Payment type not found' };
      }

      const dataEmail = {
        ...findUpdatedOrder._doc,
        eventData: { ...findEvent._doc },
        paymentType: findPaymentType.type,
      };

      const template = invoiceTemplate(dataEmail);

      await mailer({
        from: 'noreply@gmail.com',
        to: findUpdatedOrder.customerEmail,
        subject: `SASO - Your Order ${findUpdatedOrder.invoiceNumber} payment status has been changed`,
        html: template,
      });

      res
        .status(httpStatus.StatusCodes.OK)
        .json(resHelpers.success('success change status', updateOrder));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

module.exports = OrderController;
