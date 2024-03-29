'use strict';

const axios = require('axios');

const getPaypalEndpointUrl = () => {
  const { PAYPAL_ENV } = process.env;

  const paypalEndpointUrl =
    PAYPAL_ENV === 'sandbox'
      ? 'https://api-m.sandbox.paypal.com'
      : 'https://api-m.paypal.com';

  return paypalEndpointUrl;
};

const getCurrencyCode = () => 'EUR';

const generateAccessToken = async () => {
  const { PAYPAL_CLIENT_ID, PAYPAL_SECRET } = process.env;

  const response = await axios({
    url: `${getPaypalEndpointUrl()}/v1/oauth2/token`,
    method: 'POST',
    auth: {
      username: PAYPAL_CLIENT_ID,
      password: PAYPAL_SECRET || '',
    },
    data: 'grant_type=client_credentials',
  });

  return response.data;
};

const createOrderPaypal = async (orderId, value) => {
  const { access_token: accessToken } = await generateAccessToken();
  const url = `${getPaypalEndpointUrl()}/v2/checkout/orders`;
  // Calculate the value with fee
  const fixedFee = 0.39;
  const percentageFee = 2.99;
  const valueWithFee = (value + fixedFee) / (1 - percentageFee / 100);

  const data = {
    intent: 'CAPTURE',
    purchase_units: [
      {
        description: `Invoice number: ${orderId}. Price includes PayPal fee €${(
          valueWithFee - value
        ).toFixed(2)}`,
        amount: {
          currency_code: getCurrencyCode(),
          value: valueWithFee.toFixed(2),
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

  return response.data;
};

const getOrderPaypal = async (paypalOrderId, paypalAccessToken) => {
  const url = `${getPaypalEndpointUrl()}/v2/checkout/orders/${paypalOrderId}`;

  const response = await axios({
    url,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${paypalAccessToken}`,
    },
  });

  return response.data;
};

const capturePayment = async (orderId) => {
  const { access_token: accessToken } = await generateAccessToken();
  const url = `${getPaypalEndpointUrl()}/v2/checkout/orders/${orderId}/capture`;

  const response = await axios({
    url,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.data;
};

module.exports = {
  createOrderPaypal,
  capturePayment,
  getOrderPaypal,
};
