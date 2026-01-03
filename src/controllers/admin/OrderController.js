'use strict';

const httpStatus = require('http-status-codes');
const mongoose = require('mongoose');
const Order = require('@models/order');
const Menu = require('@models/menu');
const PaymentType = require('@models/paymentType');
const Event = require('@models/event');
const QRCode = require('qrcode');
const resHelpers = require('@helpers/responseHelpers');
const {
  dataPagination,
  detailById,
  escapeRegex,
} = require('@helpers/dataHelper');
const { invoiceTemplate } = require('@helpers/templates');
const { mailer } = require('@helpers/nodemailer');
const { STATUS_ORDER_MAP } = require('@constants/status');

class OrderController {
  static async getAllOrders(req, res, next) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { page, limit, invoiceNumber, event } = req.query;
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
        filter.invoiceNumber = { $regex: `.*${escapeRegex(invoiceNumber)}.*` };
      }

      if (event) {
        filter.event = event;
      }

      const findAllOrders = await dataPagination(
        Order,
        filter,
        null,
        options,
        session
      );

      await session.commitTransaction();
      session.endSession();

      res
        .status(httpStatus.StatusCodes.OK)
        .json(resHelpers.success('success fetch data', findAllOrders));
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.log(error);
      next(error);
    }
  }

  static async changeStatus(req, res, next) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { status, id } = req.params;

      if (!(status in STATUS_ORDER_MAP)) {
        throw { name: 'Bad Request', message: 'Invalid status' };
      }

      const findOrder = await Order.findById(id).session(session);
      if (!findOrder) {
        throw { name: 'Not Found', message: 'Order not found' };
      }

      if (findOrder.status === 2) {
        const restoreStockPromises = findOrder.menus.map(async (el) => {
          const menuFound = await Menu.findById(el.id).session(session);
          if (!menuFound) {
            throw { name: 'Not Found', message: 'Menu not found' };
          }

          return Menu.updateOne(
            { _id: el.id },
            { $inc: { quantityOrder: el.totalPortion } },
            { session }
          );
        });
        await Promise.all(restoreStockPromises);
      }

      if (status === 'refund' || status === 'cancel') {
        const reduceStockPromises = findOrder.menus.map(async (el) => {
          const menuFound = await Menu.findById(el.id).session(session);
          if (!menuFound) {
            throw { name: 'Not Found', message: 'Menu not found' };
          }

          return Menu.updateOne(
            { _id: el.id },
            { $inc: { quantityOrder: -el.totalPortion } },
            { session }
          );
        });
        await Promise.all(reduceStockPromises);
      }

      await Order.updateOne(
        { _id: id },
        { status: STATUS_ORDER_MAP[status], updated_at: new Date() },
        { session }
      );

      const findUpdatedOrder = await Order.findById(id).session(session);

      const findEvent = await Event.findById(findUpdatedOrder.event).session(
        session
      );
      if (!findEvent || findEvent.status !== 1) {
        throw {
          name: 'Bad Request',
          message: 'Event not found or not active',
        };
      }

      const findPaymentType = await PaymentType.findOne({
        $or: [
          { type: findUpdatedOrder.paymentType },
          { id: findUpdatedOrder.paymentType },
        ],
      }).session(session);

      if (!findPaymentType) {
        throw { name: 'Bad Request', message: 'Payment type not found' };
      }

      const qrcodeImg = await QRCode.toDataURL(findUpdatedOrder.invoiceNumber, {
        version: 2,
      });

      const dataEmail = {
        ...findUpdatedOrder._doc,
        eventData: findEvent._doc,
        paymentType: findPaymentType.name,
        qrcodeImg,
      };

      const template = invoiceTemplate(dataEmail);

      await mailer({
        from: 'noreply@gmail.com',
        to: findUpdatedOrder.customerEmail,
        subject: `SASO - Your Order ${findUpdatedOrder.invoiceNumber} payment status has been changed`,
        attachDataUrls: true,
        html: template,
      });

      await session.commitTransaction();

      res
        .status(httpStatus.StatusCodes.OK)
        .json(resHelpers.success('success change status', findUpdatedOrder));
    } catch (error) {
      await session.abortTransaction();
      next(error);
    } finally {
      session.endSession();
    }
  }

  static async getOrderByInvoiceNumber(req, res, next) {
    const { invoiceNumber } = req.params;

    const session = await mongoose.startSession();
    try {
      session.startTransaction();

      const findOrder = await Order.findOne({ invoiceNumber });
      if (!findOrder) {
        throw { name: 'Not Found', message: 'Order not found' };
      }

      const result = JSON.parse(JSON.stringify(findOrder));

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

  static async getOrderById(req, res, next) {
    const { id } = req.params;
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const findOrder = await Order.findById(id)
        .populate('event')
        .session(session);
      if (!findOrder) {
        throw { name: 'Not Found', message: 'Order not found' };
      }

      await session.commitTransaction();

      res
        .status(httpStatus.StatusCodes.OK)
        .json(resHelpers.success('Successfully fetched data', findOrder));
    } catch (error) {
      await session.abortTransaction();
      console.log(error);
      next(error);
    } finally {
      session.endSession();
    }
  }

  static async confirmOrderedMenuStatusByVendors(req, res, next) {
    const { orderId, vendorId } = req.params;

    const session = await mongoose.startSession();
    try {
      session.startTransaction();

      const order = await Order.findOne({ _id: orderId }).session(session);
      if (!order) {
        throw { name: 'Not Found', message: 'Order not found' };
      }

      if (order.status !== 1 && order.status !== 3) {
        throw {
          name: 'Bad Request',
          message: 'Order must be paid before confirming menu status.',
        };
      }

      const menuPromises = order.menus.map((orderedMenu) =>
        detailById(Menu, orderedMenu.id, 'name vendor')
      );
      const menuDocs = await Promise.all(menuPromises);

      let anyUpdated = false;
      const updatedMenus = [];

      const orderedMenus = order.menus;

      for (let i = 0; i < orderedMenus.length; i++) {
        const orderedMenu = orderedMenus[i];
        const menuDoc = menuDocs.find(
          (menu) => menu._id.toString() === orderedMenu.id.toString()
        );

        if (
          menuDoc &&
          menuDoc.vendor.toString() === vendorId &&
          orderedMenu.status !== 1
        ) {
          orderedMenu.status = 1;
          updatedMenus.push({
            _id: menuDoc._id,
            name: menuDoc.name,
          });
          anyUpdated = true;
        }
      }

      if (!anyUpdated) {
        throw {
          name: 'Bad Request',
          message:
            'No ordered menus matched this vendor, or all items are already confirmed.',
        };
      }

      await Order.updateOne(
        { _id: orderId },
        { $set: { menus: orderedMenus } },
        { session }
      );

      const allConfirmed = orderedMenus.every((m) => m.status === 1);

      if (allConfirmed) {
        await Order.updateOne(
          { _id: orderId },
          { status: 3, updated_at: new Date() },
          { session }
        );

        const findUpdatedOrder = await Order.findById(orderId).session(session);
        const findEvent = await Event.findOne({
          _id: findUpdatedOrder.event,
        }).session(session);
        if (!findEvent || findEvent.status !== 1) {
          throw {
            name: 'Bad Request',
            message: 'Event not found or its status is invalid.',
          };
        }

        const findPaymentType = await PaymentType.findOne({
          $or: [
            { type: findUpdatedOrder.paymentType },
            { id: findUpdatedOrder.paymentType },
          ],
        }).session(session);
        if (!findPaymentType) {
          throw { name: 'Bad Request', message: 'Payment type not found.' };
        }

        const qrcodeImg = await QRCode.toDataURL(
          findUpdatedOrder.invoiceNumber,
          {
            version: 2,
          }
        );

        const dataEmail = {
          ...findUpdatedOrder._doc,
          eventData: { ...findEvent._doc },
          paymentType: findPaymentType.type,
          qrcodeImg,
        };

        const template = invoiceTemplate(dataEmail);

        await mailer({
          from: 'noreply@gmail.com',
          to: findUpdatedOrder.customerEmail,
          subject: `SASO - Your Order ${findUpdatedOrder.invoiceNumber} is now done`,
          attachDataUrls: true,
          html: template,
        });
      }

      await session.commitTransaction();

      res.status(httpStatus.StatusCodes.OK).json(
        resHelpers.success(
          allConfirmed
            ? 'All ordered menus confirmed. Order status updated to done and email sent.'
            : 'Ordered menus confirmed for this vendor.',
          {
            confirmedMenus: updatedMenus,
            orderDone: allConfirmed,
          }
        )
      );
    } catch (error) {
      await session.abortTransaction();
      console.error(error);
      next(error);
    } finally {
      session.endSession();
    }
  }
}

module.exports = OrderController;
