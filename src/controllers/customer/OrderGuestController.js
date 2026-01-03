'use strict';

const mongoose = require('mongoose');
const httpStatus = require('http-status-codes');
const Order = require('@models/order');
const Event = require('@models/event');
const PaymentType = require('@models/paymentType');
const resHelpers = require('@helpers/responseHelpers');
const { detailById } = require('@helpers/dataHelper');
const { getOrderPaypal } = require('@helpers/paymentHelper');
const {
  generateInvoiceNumber,
  validateAndPrepareMenus,
  getPaymentDetails,
  sendInvoiceEmail,
} = require('@helpers/orderHelper');

class OrderGuestController {
  static async order(req, res, next) {
    const { menus, event, arrivedAt, note, paymentTypeId, userData } = req.body;

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
        paymentTypeId,
        invoiceNumber,
        totalPrice,
        session
      );

      const payload = {
        invoiceNumber,
        menus: orderedMenu,
        totalPrice,
        status: 0,
        customerId: null,
        customerFullname: userData.fullname,
        customerEmail: userData.email,
        customerPhone: userData.phone,
        event: findEvent.id,
        note: note || '',
        arrived_at: arrivedAt,
        updated_at: new Date(),
        created_at: new Date(),
        paymentType: findPaymentType._id,
        paypalOrderId: paymentResponse.id || '',
      };

      const createOrder = await Order.create([payload], { session });

      await sendInvoiceEmail(
        createOrder[0],
        findEvent.toObject(),
        findPaymentType.name,
        createOrder[0].customerEmail
      );

      await session.commitTransaction();
      res.status(httpStatus.StatusCodes.CREATED).json(
        resHelpers.success('Success create an order', {
          createOrder: createOrder[0],
          paymentResponse,
        })
      );
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

      const description =
        paymentResponse?.purchase_units?.[0]?.description || '';
      const match = description.match(/Invoice number: ([A-Z0-9-]+)/);
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

      if (findOrder.status === 2) {
        throw {
          name: 'Bad Request',
          message: 'Order has been canceled or refunded, and cannot be changed',
        };
      }

      if (findOrder.status !== 0) {
        throw { name: 'Bad Request', message: 'Order cannot be approved' };
      }

      const findPaymentType = await PaymentType.findOne({
        $or: [{ type: findOrder.paymentType }, { id: findOrder.paymentType }],
      }).session(session);
      if (!findPaymentType || findPaymentType.type !== 'paypal') {
        throw {
          name: 'Bad Request',
          message: 'Payment type not found or is not PayPal',
        };
      }

      await Order.updateOne(
        { _id: findOrder._id },
        { status: 1, updated_at: new Date() },
        { session }
      );

      const findUpdatedOrder = await Order.findById(findOrder._id).session(
        session
      );
      const findEvent = await Event.findById(findUpdatedOrder.event).session(
        session
      );
      if (!findEvent || findEvent.po_closed) {
        throw {
          name: 'Bad Request',
          message: 'Event not found or is not active',
        };
      }

      await sendInvoiceEmail(
        findUpdatedOrder,
        findEvent.toObject(),
        findPaymentType.name,
        findUpdatedOrder.customerEmail
      );

      await session.commitTransaction();
      res
        .status(httpStatus.StatusCodes.OK)
        .json(
          resHelpers.success(
            'Successfully changed order status',
            findUpdatedOrder
          )
        );
    } catch (error) {
      await session.abortTransaction();
      console.log(error);
      next(error);
    } finally {
      session.endSession();
    }
  }

  static async getOrderByInvoiceNumber(req, res, next) {
    const { invoiceNumber, customerFullname, eventId } = req.query;
    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      const findEvent = await detailById(Event, eventId, null);
      if (!findEvent || findEvent.status !== 1) {
        throw { name: 'Not Found', message: 'Event not found' };
      }

      const findOrder = await Order.findOne({
        invoiceNumber,
        customerFullname,
      })
        .populate('paymentType')
        .session(session);

      if (
        !findOrder ||
        findEvent._id.toString() !== findOrder.event.toString()
      ) {
        throw { name: 'Not Found', message: 'Order not found' };
      }

      await session.commitTransaction();

      res
        .status(httpStatus.StatusCodes.OK)
        .json(resHelpers.success('Successfully fetched data', findOrder));
    } catch (error) {
      await session.abortTransaction();
      next(error);
    } finally {
      session.endSession();
    }
  }
}

module.exports = OrderGuestController;
