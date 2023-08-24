'use strict';

const mongoose = require('mongoose');
const httpStatus = require('http-status-codes');
const Order = require('@models/order');
const Menu = require('@models/menu');
const Event = require('@models/event');
const PaymentType = require('@models/paymentType');
const resHelpers = require('@helpers/responseHelpers');
const { invoiceTemplate } = require('@helpers/templates');
const { pdfGenerator } = require('@helpers/pdfGenerator');
const { detailById } = require('@helpers/dataHelper');
const { createOrderPaypal } = require('@helpers/paymentHelper');
const { mailer } = require('@helpers/nodemailer');

class OrderController {
  static async order(req, res, next) {
    const { menus, event, arrivedAt, note, paymentType, userData } = req.body;

    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      // ! LATER: WILL BE AUTOMATED SS21
      const findEvent = await Event.findOne({ _id: event });
      if (findEvent.status !== 1 || !findEvent) {
        throw { name: 'Bad Request', message: 'Event not found' };
      }

      const countData = await Order.countDocuments({ event: findEvent.id });

      const strStartYear = findEvent.startYear.toString();
      const date = `${strStartYear.charAt(2)}${strStartYear.charAt(3)}`;

      let invoiceNumber = `SS${date}-`;
      if (countData < 10) {
        invoiceNumber += `00${countData + 1}`;
      } else if (countData < 100) {
        invoiceNumber += `0${countData + 1}`;
      } else {
        invoiceNumber += `${countData + 1}`;
      }

      const resetQuantity = [];
      const findMenu = await Promise.all(
        menus.map(async (el) => {
          const foundMenu = await Menu.findOne({
            _id: el._id,
            event: findEvent.id,
          })
            .select(['-updated_at', '-created_at', '-description'])
            .lean();

          if (!foundMenu) {
            throw { name: 'Not Found', message: 'Menu not found' };
          }

          if (el.totalPortion <= 0 || !el.totalPortion) {
            throw {
              name: 'Bad Request',
              message: `Portion should be greater 0`,
            };
          }
          let quantityFound = foundMenu.quantityOrder;

          if (!quantityFound) {
            quantityFound = 0;
          }

          const totalOrder = quantityFound + el.totalPortion;

          if (foundMenu.quantity < totalOrder) {
            return {
              error: true,
              name: 'Bad Request',
              message: `Menu '${foundMenu.name}' is out of stock`,
            };
          } else {
            resetQuantity.push({
              id: foundMenu._id,
              quantityOrder: foundMenu.quantityOrder,
            });
            foundMenu.totalPortion = el.totalPortion;
            delete foundMenu.quantity;
            delete foundMenu.quantityOrder;
            const payloadMenu = {
              quantityOrder: totalOrder,
            };
            await Menu.findOneAndUpdate({ _id: el._id }, payloadMenu);
            return foundMenu;
          }
        })
      );

      const findPaymentType = await PaymentType.findOne({
        type: paymentType,
      });

      //* CHECK IF THE MENU IS OUT OF STOCK *//
      findMenu.forEach((findError) => {
        if (findError.error) {
          resetQuantity.forEach(async (el) => {
            await Menu.findOneAndUpdate(
              { _id: el.id },
              { quantityOrder: el.quantityOrder },
              { new: true }
            );
          });
          throw {
            name: findError.name,
            message: findError.message,
          };
        }
      });

      const totalEachMenu = findMenu.map((el) => el.price * el.totalPortion);

      let totalPrice = 0;
      totalEachMenu.forEach((el) => {
        totalPrice += el;
      });

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
        paymentType: findPaymentType.id,
      };

      const createOrder = await Order.create(payload);

      let paymentResponse;
      if (findPaymentType.type === 'paypal') {
        paymentResponse = await createOrderPaypal(invoiceNumber, totalPrice);
      }
      if (findPaymentType.type === 'transfer') {
        paymentResponse = {
          status: 'success',
          type: 'transfer',
          message: 'Booking success, please transfer to our bank account',
        };
      }

      const dataEmail = {
        ...createOrder._doc,
        eventData: { ...findEvent._doc },
        paymentType: findPaymentType.type,
      };

      const template = invoiceTemplate(dataEmail);

      await mailer({
        from: 'noreply@gmail.com',
        to: createOrder.customerEmail,
        subject: `SASO - Your Order ${createOrder.invoiceNumber}`,
        html: template,
      });

      res.status(httpStatus.StatusCodes.CREATED).json(
        resHelpers.success('success create an order', {
          createOrder,
          paymentResponse,
        })
      );
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      console.log(error);
      next(error);
    } finally {
      await session.endSession();
    }
  }

  static async approveOrder(req, res, next) {
    const { id } = req.params;
    try {
      // 0 = no action
      const newStatus = 1;
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

      if (findOrder.status !== 0) {
        throw {
          name: 'Bad Request',
          message: 'Order can not be approved',
        };
      }

      const updateOrder = await Order.update(
        { _id: id },
        { status: newStatus, updated_at: new Date() },
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

  static async getOrderByInvoiceNumber(req, res, next) {
    const { invoiceNumber: orderInvoiceNumber, customerFullname } = req.query;
    try {
      const findOrder = await Order.findOne({
        invoiceNumber: orderInvoiceNumber,
      });

      if (!findOrder) {
        throw { name: 'Not Found', message: 'Order not found' };
      }

      if (findOrder.customerFullname !== customerFullname) {
        throw { name: 'Not Found', message: 'Order not found' };
      }

      const findPaymentType = await detailById(
        PaymentType,
        findOrder.paymentType,
        null
      );

      const result = JSON.parse(JSON.stringify(findOrder));
      result.paymentType = {
        paymentType: findOrder.paymentType,
        name: findPaymentType.type,
      };

      res
        .status(httpStatus.StatusCodes.OK)
        .json(resHelpers.success('success fetch data', result));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async generatePdf(req, res, next) {
    const { id: orderId } = req.params;
    const { id: userId } = req.user;

    try {
      const findOrder = await detailById(Order, orderId, null);
      const findEvent = await detailById(Event, findOrder.event, null);
      if (!findOrder) {
        throw { name: 'Not Found', message: 'Order not found' };
      }
      if (!findEvent) {
        throw { name: 'Not Found', message: 'Event not found' };
      }
      if (userId !== findOrder.customerId.toString()) {
        throw {
          name: 'Forbidden',
          message: 'You have no authorization to look this order',
        };
      }
      findOrder.eventData = findEvent;
      const template = invoiceTemplate(findOrder);
      const pdfData = await pdfGenerator(template);
      res.setHeader('Content-Type', 'application/pdf');
      res.send(pdfData);
    } catch (error) {
      // if (error.name) {
      //   res
      //     .status(httpStatus.StatusCodes.OK)
      //     .json(resHelpers.success("success download pdf"));
      // } else {
      console.log(error.name);
      next(error);
      // }
    }
  }
}

module.exports = OrderController;