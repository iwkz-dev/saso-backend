const Menu = require('@models/menu');
const PaymentType = require('@models/paymentType');
const Order = require('@models/order');
const QRCode = require('qrcode');
const { createOrderPaypal } = require('@helpers/paymentHelper');
const { mailer } = require('@helpers/nodemailer');
const { invoiceTemplate } = require('@helpers/templates');

async function generateInvoiceNumber(event, session) {
  const countData = await Order.countDocuments({ event: event.id }).session(
    session
  );
  const date = event.startYear.toString().slice(-2);
  const code = event.name
    .split(' ')
    .map((word) => word.charAt(0))
    .join('');
  return `${code}${date}-${String(countData + 1).padStart(3, '0')}`;
}

async function validateAndPrepareMenus(menus, eventId, session) {
  const orderedMenu = [];
  const resetQuantity = [];

  await Promise.all(
    menus.map(async (el) => {
      const foundMenu = await Menu.findOne({
        _id: el._id,
        event: eventId,
      })
        .select('-updated_at -created_at -description')
        .lean()
        .session(session);

      if (!foundMenu) throw { name: 'Not Found', message: 'Menu not found' };
      if (!el.totalPortion || el.totalPortion <= 0) {
        throw {
          name: 'Bad Request',
          message: 'Portion should be greater than 0',
        };
      }

      const totalOrder = (foundMenu.quantityOrder || 0) + el.totalPortion;
      if (foundMenu.quantity < totalOrder) {
        await Promise.all(
          resetQuantity.map(async (r) => {
            await Menu.findOneAndUpdate(
              { _id: r.id },
              { quantityOrder: r.quantityOrder }
            ).session(session);
          })
        );
        throw {
          name: 'Bad Request',
          message: `Menu '${foundMenu.name}' is out of stock`,
        };
      }

      resetQuantity.push({
        id: foundMenu._id,
        quantityOrder: foundMenu.quantityOrder,
      });

      await Menu.findOneAndUpdate(
        { _id: el._id },
        { quantityOrder: totalOrder }
      ).session(session);

      orderedMenu.push({
        name: foundMenu.name,
        category: foundMenu.category,
        event: foundMenu.event,
        id: foundMenu._id,
        totalPortion: el.totalPortion,
        note: el.note,
        price: foundMenu.price,
        status: 0,
        images: foundMenu.images,
      });
    })
  );

  return orderedMenu;
}

async function getPaymentDetails(
  paymentTypeId,
  invoiceNumber,
  totalPrice,
  session
) {
  const findPaymentType = await PaymentType.findOne({
    _id: paymentTypeId,
  }).session(session);

  if (!findPaymentType)
    throw { name: 'Bad Request', message: 'Payment type not found' };

  let paymentResponse;
  if (findPaymentType.type === 'paypal') {
    paymentResponse = await createOrderPaypal(invoiceNumber, totalPrice);
  } else {
    paymentResponse = {
      status: 'success',
      type: 'transfer',
      message: 'Booking success, please transfer to our bank account',
    };
  }

  return { findPaymentType, paymentResponse };
}

async function sendInvoiceEmail(order, eventData, paymentType, to) {
  const qrcodeImg = await QRCode.toDataURL(order.invoiceNumber, { version: 2 });
  const template = invoiceTemplate({
    ...order.toObject(),
    eventData,
    paymentType: {
      name: paymentType.name,
      note: paymentType.note,
    },
    qrcodeImg,
  });

  await mailer({
    from: 'noreply@gmail.com',
    to,
    subject: `SASO - Your Order ${order.invoiceNumber}`,
    attachDataUrls: true,
    html: template,
  });
}

module.exports = {
  generateInvoiceNumber,
  validateAndPrepareMenus,
  getPaymentDetails,
  sendInvoiceEmail,
};
