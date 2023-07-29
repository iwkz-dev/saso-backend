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
    },
    data: 'grant_type=client_credentials',
  });

  return response.data;
};

const createOrderPaypal = async (orderId, value) => {
  const { access_token: accessToken } = await generateAccessToken();
  const url = `${getPaypalEndpointUrl()}/v2/checkout/orders`;

  // TODO: change me
  const data = {
    intent: 'CAPTURE',
    purchase_units: [
      {
        description: `Invoice number: ${orderId} `,
        amount: {
          currency_code: getCurrencyCode(),
          value,
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

  console.log('paypal response:', response);

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

  console.log(response.data);

  return response.data;
};

module.exports = {
  createOrderPaypal,
  capturePayment,
};
