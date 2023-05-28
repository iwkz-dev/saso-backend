'use strict';

const httpStatus = require('http-status-codes');
const axios = require('axios');
const resHelpers = require('@helpers/responseHelpers');

const { PAYPAL_ENV, PAYPAL_CLIENTID, PAYPAL_SECRET } = process.env;
const currencyCode = 'EUR';
const paypalEndpointUrl =
  PAYPAL_ENV === 'sandbox'
    ? 'https://api-m.sandbox.paypal.com'
    : 'https://api-m.paypal.com';

const generateAccessToken = async () => {
  const response = await axios({
    url: `${paypalEndpointUrl}/v1/oauth2/token`,
    method: 'POST',
    auth: {
      username: PAYPAL_CLIENTID,
      password: PAYPAL_SECRET,
    },
    data: 'grant_type=client_credentials',
  });

  return response.data;
};

const createOrder = async (req, res, next) => {
  const { access_token: accessToken } = await generateAccessToken();
  const url = `${paypalEndpointUrl}/v2/checkout/orders`;
  const data = {
    intent: 'CAPTURE',
    purchase_units: [
      {
        custom: '123123',
        invoice_id: '123123',
        description: 'Pembelian Toko orderId-123123',
        amount: {
          currency_code: currencyCode,
          value: 30,
        },
      },
    ],
  };

  const response = await axios({
    url,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    data,
  });

  res
    .status(httpStatus.StatusCodes.OK)
    .json(resHelpers.success('success fetch data', response.data));
};

const capturePayment = async (req, res, next) => {
  console.log('asda');
  const { orderId } = req.params;
  console.log(orderId);
  const { access_token: accessToken } = await generateAccessToken();
  const url = `${paypalEndpointUrl}/v2/checkout/orders/${orderId}/capture`;

  console.log({ orderId, url });

  const response = await axios({
    url,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  console.log(response.data);

  res
    .status(httpStatus.StatusCodes.OK)
    .json(resHelpers.success('success fetch data', response.data));
};

module.exports = {
  createOrder,
  capturePayment,
};
