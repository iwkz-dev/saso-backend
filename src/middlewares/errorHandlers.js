"use strict";
const httpStatus = require("http-status-codes");
const resHelpers = require("@helpers/responseHelpers");

async function errorHandler(error, req, res, next) {
  switch (error.name) {
    case "Invalid Auth":
      res
        .status(httpStatus.StatusCodes.UNAUTHORIZED)
        .json(resHelpers.failed(error.message, error.name || error));
      break;
    case "Bad Request":
      res
        .status(httpStatus.StatusCodes.BAD_REQUEST)
        .json(resHelpers.failed(error.message, error.name || error));
      break;
    case "Not Found":
      res
        .status(httpStatus.StatusCodes.NOT_FOUND)
        .json(resHelpers.failed(error.message, error.name));
      break;
    case "ValidationError":
      res
        .status(httpStatus.StatusCodes.BAD_REQUEST)
        .json(resHelpers.failed(error._message, error.errors));
      break;
    default:
      res
        .status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR)
        .json(resHelpers.failed(error.message, error.name || error));
      break;
  }
}
module.exports = { errorHandler };
