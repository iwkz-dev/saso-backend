'use strict';

const httpStatus = require('http-status-codes');
const PaymentType = require('@models/paymentType');
const resHelpers = require('@helpers/responseHelpers');
const { dataPagination, detailById } = require('@helpers/dataHelper');

class PaymentTypeController {
  static async create(req, res, next) {
    try {
      const type = await req.body.type;
      const payload = {
        type: type.toLowerCase(),
        updated_at: new Date(),
        created_at: new Date(),
      };
      const findPaymentType = await PaymentType.findOne({
        type: type.toLowerCase(),
      });
      if (findPaymentType) {
        throw {
          name: 'Bad Request',
          message: `You already have payment type with name: ${req.body.type}`,
        };
      } else {
        const createPaymentType = await PaymentType.create(payload);
        res
          .status(httpStatus.StatusCodes.CREATED)
          .json(
            resHelpers.success('success create an payment', createPaymentType)
          );
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async getAllPaymentTypes(req, res, next) {
    const { page, limit, sort } = req.query;
    try {
      const options = {
        page: page || 1,
        limit: limit || 100000,
        sort: {
          type: 'created_at',
          method: -1,
        },
      };

      let method;
      if (sort) {
        const splittedSort = sort.split(':');
        if (splittedSort[1] === 'desc') {
          method = -1;
        }
        if (splittedSort[1] === 'asc') {
          method = 1;
        }
        options.sort = {
          type: splittedSort[0],
          method,
        };
      }

      const findPaymentTypes = await dataPagination(
        PaymentType,
        null,
        null,
        options
      );
      res
        .status(httpStatus.StatusCodes.OK)
        .json(resHelpers.success('success fetch data', findPaymentTypes));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async getPaymentTypeById(req, res, next) {
    const { id } = req.params;
    try {
      const findPaymentType = await detailById(PaymentType, id, null);
      if (!findPaymentType) {
        throw { name: 'Not Found', message: 'Payment Type not found' };
      }
      res
        .status(httpStatus.StatusCodes.OK)
        .json(resHelpers.success('success fetch data', findPaymentType));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async update(req, res, next) {
    const payload = {
      type: req.body.type,
      updated_at: new Date(),
    };

    const { id } = req.params;
    try {
      const findPaymentType = await PaymentType.findOne({
        type: req.body.type.toLowerCase(),
      });
      if (findPaymentType) {
        throw {
          name: 'Bad Request',
          message: `You already have payment type with name: ${req.body.type}`,
        };
      } else {
        const updatePaymentType = await PaymentType.findOneAndUpdate(
          { _id: id },
          payload,
          { new: true }
        );
        if (!updatePaymentType) {
          throw { name: 'Not Found', message: 'Payment type not found' };
        }
        res
          .status(httpStatus.StatusCodes.OK)
          .json(resHelpers.success('success update data', updatePaymentType));
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async delete(req, res, next) {
    const { id } = req.params;

    try {
      const deletedPaymentType = await PaymentType.findOneAndDelete({
        _id: id,
      });
      if (!deletedPaymentType) {
        throw { name: 'Not Found', message: 'Payment type not found' };
      }
      res
        .status(httpStatus.StatusCodes.OK)
        .json(resHelpers.success('success delete data', deletedPaymentType));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

module.exports = PaymentTypeController;
