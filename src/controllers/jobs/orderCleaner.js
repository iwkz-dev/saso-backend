'use strict';

const Order = require('@models/order');
const Event = require('@models/event');

const orderCleaner = async () => {
  try {
    // 0 = no action
    const statusPayload = 0;
    const findEvent = await Event.findOne({ status: 1 });
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    Order.updateMany(
      {
        updated_at: { $lt: oneDayAgo },
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

module.exports = { orderCleaner };
