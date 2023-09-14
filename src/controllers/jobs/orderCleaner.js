'use strict';

const Order = require('@models/order');
const Event = require('@models/event');
const PaymentType = require('@models/paymentType');
const Menu = require('@models/menu');
const { invoiceTemplate } = require('@helpers/templates');
const { mailer } = require('@helpers/nodemailer');

const orderCleaner = async () => {
  try {
    // 0 = no action
    const statusPayload = 0;
    const findEvent = await Event.findOne({ status: 1 });
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    const ordersToUpdate = await Order.find({
      updated_at: { $lt: twoDaysAgo },
      event: findEvent.id,
      status: statusPayload,
    });

    if (ordersToUpdate.length > 0) {
      for await (const order of ordersToUpdate) {
        const findPaymentType = await PaymentType.findOne({
          _id: order.paymentType,
        });

        if (!findPaymentType) {
          throw { name: 'Bad Request', message: 'Payment type not found' };
        }

        order.status = 2;
        order.updated_at = new Date();

        const menus = order.menus;
        for await (const menu of menus) {
          const menuFound = await Menu.findById(menu._id);
          const payloadMenu = {
            quantityOrder: menuFound.quantityOrder - menu.totalPortion,
          };
          await Menu.updateOne({ _id: menu._id }, payloadMenu);
        }

        await order.save();
        const dataEmail = {
          ...order._doc,
          eventData: { ...findEvent._doc },
          paymentType: findPaymentType.type,
        };
        const template = invoiceTemplate(dataEmail);

        await mailer({
          from: 'noreply@gmail.com',
          to: order.customerEmail,
          subject: `SASO - Your Order ${order.invoiceNumber} payment status has been changed`,
          html: template,
        });
      }
    } else {
      console.log('No orders to update.');
    }
  } catch (e) {
    console.log(e);
  }
};

module.exports = { orderCleaner };
