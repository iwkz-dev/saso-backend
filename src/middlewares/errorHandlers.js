"use strict";
const httpStatus = require("http-status-codes");
const resHelpers = require("@helpers/responseHelpers");

async function errorHandler(error, req, res, next) {
  switch (error.name) {
    case "Forbidden":
      res
        .status(httpStatus.StatusCodes.FORBIDDEN)
        .json(resHelpers.failed(error.message, error.name || error));
      break;
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
      const keyError = Object.keys(error.errors);
      res
        .status(httpStatus.StatusCodes.BAD_REQUEST)
        .json(
          resHelpers.failed(error._message, error.errors[keyError].message)
        );
      break;
    case "TokenExpiredError":
      res
        .status(httpStatus.StatusCodes.BAD_REQUEST)
        .json(resHelpers.failed("Token expired", "JWT token expired"));
      break;
    case "MongoServerError":
      if (error.code === 11000) {
        console.log(
          "🚀 ~ file: errorHandlers.js ~ line 46 ~ errorHandler ~ error",
          error.keyValue
        );
        const getKeyValue = error.keyValue;
        const newKeyValue = Object.keys(getKeyValue);
        res
          .status(httpStatus.StatusCodes.BAD_REQUEST)
          .json(
            resHelpers.failed(
              `Field '${newKeyValue}' must be unique`,
              error.name || error
            )
          );
      } else {
        res
          .status(httpStatus.StatusCodes.BAD_REQUEST)
          .json(resHelpers.failed(error.message, error.name || error));
      }
      break;
    default:
      res
        .status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR)
        .json(resHelpers.failed(error.message, error.name || error));
      break;
  }
}
module.exports = { errorHandler };
