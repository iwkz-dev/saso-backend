"use strict";

let resFormat;

module.exports = {
  success: function (message, data) {
    const count = data != null ? data.length : 0;
    resFormat = {
      status: count === 0 ? "false" : "success",
      message: message,
      count: count,
      data: data,
    };

    if (data === null || count === 0) {
      resFormat.data = [];
      delete resFormat.count;
    }

    return resFormat;
  },

  successCompleteForm: function (message, data) {
    const count = data != null ? data.length : 0;
    resFormat = {
      status: "success",
      message: message,
      count: count,
      data: data,
    };

    return resFormat;
  },

  OK: function (message, data) {
    const count = data != null ? data.length : 0;

    resFormat = {
      status: "OK",
      message: message,
      count: count,
      data: data,
    };

    if (data === null || count === 0) {
      delete resFormat.data;
      delete resFormat.count;
    }

    return resFormat;
  },

  failed: function (message, error) {
    return (resFormat = {
      status: "failed",
      message: message,
      error: error.message ? error.message : error,
    });
  },
};
