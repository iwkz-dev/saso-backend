'use strict';

const mongoose = require('mongoose');
const httpStatus = require('http-status-codes');
const Order = require('@models/order');
const User = require('@models/user');
const Event = require('@models/event');
const PaymentType = require('@models/paymentType');
const resHelpers = require('@helpers/responseHelpers');
const { invoiceTemplate } = require('@helpers/templates');
const { pdfGenerator } = require('@helpers/pdfGenerator');
const { dataPagination, detailById } = require('@helpers/dataHelper');
const { getOrderPaypal } = require('@helpers/paymentHelper');
const {
  generateInvoiceNumber,
  validateAndPrepareMenus,
  getPaymentDetails,
  sendInvoiceEmail,
} = require('@helpers/orderHelper');

class OrderController {
  static async order(req, res, next) {
    const { menus, event, arrivedAt, note, paymentType } = req.body;
    const userId = req.user.id;

    const session = await mongoose.startSession();
    try {
      session.startTransaction();

      const findEvent = await Event.findOne({ _id: event }).session(session);
      if (!findEvent || findEvent.po_closed) {
        throw { name: 'Bad Request', message: 'Event not found' };
      }

      const invoiceNumber = await generateInvoiceNumber(findEvent, session);
      const orderedMenu = await validateAndPrepareMenus(
        menus,
        findEvent.id,
        session
      );
      const totalPrice = orderedMenu.reduce(
        (acc, menu) => acc + menu.price * menu.totalPortion,
        0
      );

      const { findPaymentType, paymentResponse } = await getPaymentDetails(
        paymentType,
        invoiceNumber,
        totalPrice,
        session
      );

      const findUser = await User.findById(userId).session(session);
      if (!findUser) {
        throw { name: 'Bad Request', message: 'User not found' };
      }

      const payload = {
        invoiceNumber,
        menus: orderedMenu,
        totalPrice,
        status: 0,
        customerId: userId,
        customerFullname: findUser.fullname,
        customerEmail: findUser.email,
        customerPhone: findUser.phone,
        event: findEvent.id,
        note: note || '',
        arrived_at: arrivedAt,
        updated_at: new Date(),
        created_at: new Date(),
        paymentType: findPaymentType.type,
        paypalOrderId: paymentResponse.id || '',
      };

      const createOrder = await Order.create([payload], { session });
      await sendInvoiceEmail(
        createOrder[0],
        findEvent.toObject(),
        findPaymentType.type,
        createOrder[0].customerEmail
      );

      res.status(httpStatus.StatusCodes.CREATED).json(
        resHelpers.success('success create an order', {
          createOrder: createOrder[0],
          paymentResponse,
        })
      );

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      console.log(error);
      next(error);
    } finally {
      session.endSession();
    }
  }

  static async approveOrder(req, res, next) {
    const { orderID, facilitatorAccessToken } = req.body;
    const session = await mongoose.startSession();
    try {
      session.startTransaction();

      const paymentResponse = await getOrderPaypal(
        orderID,
        facilitatorAccessToken
      );

      if (paymentResponse.status !== 'COMPLETED') {
        throw {
          name: 'Bad Request',
          message: 'Payment status is not completed',
        };
      }

      const description = paymentResponse?.purchase_units?.[0]?.description;
      const regex = /Invoice number: ([A-Z0-9-]+)/;
      const match = description?.match(regex);

      if (!match || !match[1]) {
        throw {
          name: 'Bad Request',
          message: 'Invoice number not found in description',
        };
      }

      const invoiceNumber = match[1].trim();

      const findOrder = await Order.findOne({
        invoiceNumber,
        paypalOrderId: orderID,
      }).session(session);
      if (!findOrder) throw { name: 'Not Found', message: 'Order not found' };
      if (findOrder.status === 2)
        throw { name: 'Bad Request', message: 'Order canceled or refunded' };
      if (findOrder.status !== 0)
        throw { name: 'Bad Request', message: 'Order cannot be approved' };

      const findPaymentType = await PaymentType.findOne({
        $or: [{ type: findOrder.paymentType }, { id: findOrder.paymentType }],
      }).session(session);
      if (!findPaymentType || findPaymentType.type !== 'paypal') {
        throw { name: 'Bad Request', message: 'Invalid payment type' };
      }

      await Order.updateOne(
        { _id: findOrder._id },
        { status: 1, updated_at: new Date() },
        { session }
      );

      const updatedOrder = await Order.findById(findOrder._id).session(session);
      const findEvent = await Event.findById(updatedOrder.event).session(
        session
      );
      if (!findEvent || findEvent.po_closed)
        throw { name: 'Bad Request', message: 'Invalid event' };

      await sendInvoiceEmail(
        updatedOrder,
        findEvent.toObject(),
        findPaymentType.type,
        updatedOrder.customerEmail
      );

      await session.commitTransaction();

      res
        .status(httpStatus.StatusCodes.OK)
        .json(
          resHelpers.success('Successfully changed order status', updatedOrder)
        );
    } catch (error) {
      await session.abortTransaction();
      console.log(error);
      next(error);
    } finally {
      session.endSession();
    }
  }

  static async getAllOrders(req, res, next) {
    const { id: userId } = req.user;
    const { page, limit } = req.query;

    try {
      const options = {
        page: page || 1,
        limit: limit || 100000,
        sort: { type: 'created_at', method: -1 },
      };
      const filter = { customerId: userId };
      const orders = await dataPagination(Order, filter, null, options);

      res
        .status(httpStatus.StatusCodes.OK)
        .json(resHelpers.success('Fetched orders', orders));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async getOrderById(req, res, next) {
    const { id: userId } = req.user;
    const { id: orderId } = req.params;
    const session = await mongoose.startSession();

    try {
      session.startTransaction();
      const order = await detailById(Order, orderId, null);

      if (!order) throw { name: 'Not Found', message: 'Order not found' };
      if (userId !== order.customerId.toString()) {
        throw { name: 'Forbidden', message: 'Unauthorized access' };
      }

      const findPaymentType = await PaymentType.findOne({
        $or: [{ type: order.paymentType }, { id: order.paymentType }],
      }).session(session);

      const result = JSON.parse(JSON.stringify(order));
      result.paymentType = {
        paymentType: order.paymentType,
        name: findPaymentType.type,
      };

      await session.commitTransaction();
      res
        .status(httpStatus.StatusCodes.OK)
        .json(resHelpers.success('Fetched order', result));
    } catch (error) {
      await session.abortTransaction();
      console.log(error);
      next(error);
    } finally {
      session.endSession();
    }
  }

  static async generatePdf(req, res, next) {
    const { id: orderId } = req.params;
    const { id: userId } = req.user;
    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      const order = await detailById(Order, orderId, { session });
      if (!order) throw { name: 'Not Found', message: 'Order not found' };
      if (userId !== order.customerId.toString()) {
        throw { name: 'Forbidden', message: 'Unauthorized access' };
      }

      const event = await detailById(Event, order.event, { session });
      if (!event) throw { name: 'Not Found', message: 'Event not found' };

      const findPaymentType = await PaymentType.findOne({
        $or: [{ type: order.paymentType }, { id: order.paymentType }],
      }).session(session);
      if (!findPaymentType)
        throw { name: 'Bad Request', message: 'Payment type not found' };

      const template = invoiceTemplate({
        ...order._doc,
        eventData: { ...event._doc },
        paymentType: findPaymentType.type,
      });
      const pdfData = await pdfGenerator(template);

      await session.commitTransaction();
      res.setHeader('Content-Type', 'application/pdf');
      res.send(pdfData);
    } catch (error) {
      await session.abortTransaction();
      console.log(error);
      next(error);
    } finally {
      session.endSession();
    }
  }
}

module.exports = OrderController;
