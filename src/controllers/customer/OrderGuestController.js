'use strict';

const mongoose = require('mongoose');
const httpStatus = require('http-status-codes');
const Order = require('@models/order');
const Menu = require('@models/menu');
const Event = require('@models/event');
const PaymentType = require('@models/paymentType');
const resHelpers = require('@helpers/responseHelpers');
const QRCode = require('qrcode');
const { invoiceTemplate } = require('@helpers/templates');
const { detailById } = require('@helpers/dataHelper');
const { createOrderPaypal, getOrderPaypal } = require('@helpers/paymentHelper');
const { mailer } = require('@helpers/nodemailer');

class OrderController {
  static async order(req, res, next) {
    const { menus, event, arrivedAt, note, paymentType, userData } = req.body;

    const session = await mongoose.startSession();
    try {
      session.startTransaction();

      const findEvent = await Event.findOne({ _id: event }).session(session);
      if (!findEvent || findEvent.status !== 1) {
        throw { name: 'Bad Request', message: 'Event not found' };
      }

      const countData = await Order.countDocuments({
        event: findEvent.id,
      }).session(session);

      const strStartYear = findEvent.startYear.toString();
      const date = strStartYear.slice(-2);
      const code = findEvent.name
        .split(' ')
        .map((word) => word[0])
        .join('');

      const invoiceNumber = `${code}${date}-${(countData + 1)
        .toString()
        .padStart(3, '0')}`;

      const resetQuantity = [];
      const findMenu = await Promise.all(
        menus.map(async (el) => {
          const foundMenu = await Menu.findOne({
            _id: el._id,
            event: findEvent.id,
          })
            .select('-updated_at -created_at -description')
            .lean()
            .session(session);

          if (!foundMenu)
            throw { name: 'Not Found', message: 'Menu not found' };

          if (el.totalPortion <= 0) {
            throw {
              name: 'Bad Request',
              message: 'Portion should be greater than 0',
            };
          }

          const totalOrder = (foundMenu.quantityOrder || 0) + el.totalPortion;

          if (foundMenu.quantity < totalOrder) {
            throw {
              name: 'Bad Request',
              message: `Menu '${foundMenu.name}' is out of stock`,
            };
          } else {
            resetQuantity.push({
              id: foundMenu._id,
              quantityOrder: foundMenu.quantityOrder,
            });
            foundMenu.totalPortion = el.totalPortion;
            await Menu.findOneAndUpdate(
              { _id: el._id },
              { quantityOrder: totalOrder },
              { session }
            );
            foundMenu.note = el.note;
            return foundMenu;
          }
        })
      );

      const findPaymentType = await PaymentType.findOne({
        type: paymentType,
      }).session(session);
      if (!findPaymentType)
        throw { name: 'Bad Request', message: 'Payment type not found' };

      findMenu.forEach(async (findError) => {
        if (findError.error) {
          await Promise.all(
            resetQuantity.map(async (el) => {
              await Menu.findOneAndUpdate(
                { _id: el.id },
                { quantityOrder: el.quantityOrder },
                { session }
              );
            })
          );
          throw { name: findError.name, message: findError.message };
        }
      });

      const totalPrice = findMenu.reduce(
        (total, el) => total + el.price * el.totalPortion,
        0
      );

      let paymentResponse;
      if (findPaymentType.type === 'paypal') {
        paymentResponse = await createOrderPaypal(invoiceNumber, totalPrice);
      } else if (findPaymentType.type === 'transfer') {
        paymentResponse = {
          status: 'success',
          type: 'transfer',
          message: 'Booking success, please transfer to our bank account',
        };
      }

      const payload = {
        invoiceNumber,
        menus: findMenu,
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
        paymentType: findPaymentType.type,
        paypalOrderId: paymentResponse.id || '',
      };

      const createOrder = await Order.create([payload], { session });

      const qrcodeImg = await QRCode.toDataURL(createOrder[0].invoiceNumber, {
        version: 2,
      });

      const dataEmail = {
        ...createOrder[0]._doc,
        eventData: findEvent.toObject(),
        paymentType: findPaymentType.type,
        qrcodeImg,
      };

      const template = invoiceTemplate(dataEmail);

      await mailer({
        from: 'noreply@gmail.com',
        to: createOrder[0].customerEmail,
        subject: `SASO - Your Order ${createOrder[0].invoiceNumber}`,
        attachDataUrls: true,
        html: template,
      });

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

      if (
        !paymentResponse.purchase_units ||
        paymentResponse.purchase_units.length === 0
      ) {
        throw { name: 'Bad Request', message: 'There is no purchase unit' };
      }

      const description = paymentResponse.purchase_units[0].description;
      const regex = /Invoice number: ([A-Z0-9-]+)/;
      const match = description.match(regex);

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

      if (!findOrder) {
        throw { name: 'Not Found', message: 'Order not found' };
      }

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
      if (!findEvent || findEvent.status !== 1) {
        throw {
          name: 'Bad Request',
          message: 'Event not found or is not active',
        };
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
    const {
      invoiceNumber: orderInvoiceNumber,
      customerFullname,
      eventId,
    } = req.query;

    const session = await mongoose.startSession();
    try {
      session.startTransaction();

      const findEvent = await detailById(Event, eventId, null);

      if (findEvent.status !== 1) {
        throw { name: 'Not Found', message: 'Order not found' };
      }

      const findOrder = await Order.findOne({
        $and: [{ invoiceNumber: orderInvoiceNumber }, { customerFullname }],
      }).session(session);

      if (!findOrder) {
        throw { name: 'Not Found', message: 'Order not found' };
      }

      if (findEvent._id.toString() !== findOrder.event.toString()) {
        throw { name: 'Not Found', message: 'Order not found' };
      }

      const findPaymentType = await PaymentType.findOne({
        $or: [{ type: findOrder.paymentType }, { id: findOrder.paymentType }],
      }).session(session);

      const result = JSON.parse(JSON.stringify(findOrder));
      result.paymentType = {
        paymentType: findOrder.paymentType,
        name: findPaymentType.type,
      };

      await session.commitTransaction();

      res
        .status(httpStatus.StatusCodes.OK)
        .json(resHelpers.success('Successfully fetched data', result));
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
