'use strict';

const mongoose = require('mongoose');
const httpStatus = require('http-status-codes');
const PaymentType = require('@models/paymentType');
const resHelpers = require('@helpers/responseHelpers');

class PaymentTypeController {
  static async create(req, res, next) {
    const { name, type, note = '', events = [] } = req.body;
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const payload = {
        name,
        type: type.toLowerCase(),
        note,
        events: [...new Set(events)],
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
      }

      const createPaymentType = await PaymentType.create(payload);
      await session.commitTransaction();
      res
        .status(httpStatus.StatusCodes.CREATED)
        .json(
          resHelpers.success('success create an payment', createPaymentType)
        );
    } catch (error) {
      await session.abortTransaction();
      console.log(error);
      next(error);
    } finally {
      session.endSession();
    }
  }

  static async getAllPaymentTypes(req, res, next) {
    const { page = 1, limit = 100000, sort } = req.query;

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      let sortOption = { created_at: -1 }; // default sort

      if (sort) {
        const [field, direction] = sort.split(':');
        sortOption = { [field]: direction === 'asc' ? 1 : -1 };
      }

      const skip = (page - 1) * limit;

      // Fetch payment types with related events
      const paymentTypes = await PaymentType.aggregate([
        { $sort: sortOption },
        { $skip: Number(skip) },
        { $limit: Number(limit) },
        {
          $lookup: {
            from: 'events', // collection name
            localField: '_id',
            foreignField: 'paymentTypeId',
            as: 'events',
          },
        },
      ]).session(session);

      // Get total count for pagination
      const totalCount = await PaymentType.countDocuments().session(session);
      const maxPage = Math.ceil(totalCount / limit);

      await session.commitTransaction();

      res.status(httpStatus.StatusCodes.OK).json(
        resHelpers.success('Success load payment types', {
          pagination: {
            maxPage,
            currentPage: Number(page),
            limit: Number(limit),
            count: totalCount,
          },
          data: paymentTypes,
        })
      );
    } catch (error) {
      console.error(error);
      await session.abortTransaction();
      next(error);
    } finally {
      session.endSession();
    }
  }

  static async getPaymentTypeById(req, res, next) {
    const { id } = req.params;

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const paymentType = await PaymentType.findById(id)
        .populate({
          path: 'events',
          options: { sort: { started_at: -1 } },
        })
        .session(session);

      if (!paymentType) {
        throw { name: 'Not Found', message: 'Payment Type not found' };
      }

      await session.commitTransaction();
      res
        .status(httpStatus.StatusCodes.OK)
        .json(resHelpers.success('success fetch data', paymentType));
    } catch (error) {
      await session.abortTransaction();
      console.log(error);
      next(error);
    } finally {
      session.endSession();
    }
  }

  static async update(req, res, next) {
    const { name, type, note = '', events = [] } = req.body;

    const { id } = req.params;

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const findPaymentType = await PaymentType.findOne({
        name: name.trim(),
      });
      if (findPaymentType && findPaymentType._id.toString() !== id) {
        throw {
          name: 'Bad Request',
          message: `You already have payment type with name: ${req.body.type}`,
        };
      }

      const payload = {
        name,
        type: type.toLowerCase(),
        note,
        events,
        updated_at: new Date(),
      };

      const updatePaymentType = await PaymentType.findOneAndUpdate(
        { _id: id },
        payload,
        { new: true }
      );

      if (!updatePaymentType) {
        throw { name: 'Not Found', message: 'Payment type not found' };
      }

      await session.commitTransaction();
      res
        .status(httpStatus.StatusCodes.OK)
        .json(resHelpers.success('success update data', updatePaymentType));
    } catch (error) {
      await session.abortTransaction();
      console.log(error);
      next(error);
    } finally {
      session.endSession();
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
