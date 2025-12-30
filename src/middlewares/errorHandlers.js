'use strict';

const httpStatus = require('http-status-codes');
const resHelpers = require('@helpers/responseHelpers');
const { handleMongoDuplicate } = require('@helpers//dataHelper');

async function errorHandler(error, req, res, next) {
  if (error.code === 11000) {
    return handleMongoDuplicate(httpStatus, resHelpers, error, res);
  }

  switch (error.name) {
    case 'Forbidden':
      return res
        .status(httpStatus.StatusCodes.FORBIDDEN)
        .json(resHelpers.failed(error.message, error.name));

    case 'Invalid Auth':
      return res
        .status(httpStatus.StatusCodes.UNAUTHORIZED)
        .json(resHelpers.failed(error.message, error.name));

    case 'Bad Request':
      return res
        .status(httpStatus.StatusCodes.BAD_REQUEST)
        .json(resHelpers.failed(error.message, error.name));

    case 'Not Found':
      return res
        .status(httpStatus.StatusCodes.NOT_FOUND)
        .json(resHelpers.failed(error.message, error.name));

    case 'ValidationError': {
      const keys = Object.keys(error.errors);
      const messages = keys.map((k) => error.errors[k].message);

      return res
        .status(httpStatus.StatusCodes.BAD_REQUEST)
        .json(
          resHelpers.failed(
            error._message,
            keys.length > 1 ? messages.join('; ') : messages[0]
          )
        );
    }

    case 'TokenExpiredError':
      return res
        .status(httpStatus.StatusCodes.UNAUTHORIZED)
        .json(resHelpers.failed('Token expired', 'JWT token expired'));

    default:
      return res
        .status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR)
        .json(resHelpers.failed(error.message, error.name));
  }
}

module.exports = { errorHandler };
