'use strict';

let resFormat;

module.exports = {
  success(message, data) {
    const count = data != null ? data.length : 0;
    resFormat = {
      status: count === 0 ? 'false' : 'success',
      message,
      count,
      data,
    };

    if (data === null || count === 0) {
      resFormat.data = [];
      delete resFormat.count;
    }

    return resFormat;
  },

  successCompleteForm(message, data) {
    const count = data != null ? data.length : 0;
    resFormat = {
      status: 'success',
      message,
      count,
      data,
    };

    return resFormat;
  },

  OK(message, data) {
    const count = data != null ? data.length : 0;

    resFormat = {
      status: 'OK',
      message,
      count,
      data,
    };

    if (data === null || count === 0) {
      delete resFormat.data;
      delete resFormat.count;
    }

    return resFormat;
  },

  failed(message, error) {
    // eslint-disable-next-line no-return-assign
    return (resFormat = {
      status: 'failed',
      message,
      error: error.message ? error.message : error,
    });
  },
};
