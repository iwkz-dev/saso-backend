'use strict';

const Order = require('@models/order');
const Menu = require('@models/menu');
const Event = require('@models/event');
const PaymentType = require('@models/paymentType');
const { dataPagination, detailById } = require('@helpers/dataHelper');

const paymentPaypalCleaner = async () => {
  try {
    // 0 = no action
    const statusPayload = 0;
    const findPaymentType = await PaymentType.findOne({ type: 'paypal' });
    const findEvent = await Event.findOne({ status: 1 });
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    Order.updateMany(
      {
        created_at: { $lt: oneDayAgo },
        paymentType: findPaymentType.id,
        event: findEvent.id,
        status: statusPayload,
      },
      { $set: { status: 2 } }
    )
      .then((result) => {
        console.log(`${result} orders have been updated.`);
      })
      .catch((error) => {
        console.error('Error updating orders:', error);
      });
  } catch (e) {
    console.log(e);
  }
};

module.exports = { paymentPaypalCleaner };
