'use strict';

const mongoose = require('mongoose');
const httpStatus = require('http-status-codes');
const Vendor = require('@models/vendor');
const resHelpers = require('@helpers/responseHelpers');
const {
  dataPagination,
  detailById,
  firstWordUppercase,
} = require('@helpers/dataHelper');

class VendorController {
  static async create(req, res, next) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const name = await firstWordUppercase(req.body.name);
      const payload = {
        name,
        updated_at: new Date(),
        created_at: new Date(),
      };

      const slug = req.body.name
        ? req.body.name.toLowerCase().replace(/ /g, '_')
        : '';

      const findVendor = await Vendor.findOne({ slug }).session(session);
      if (findVendor) {
        throw {
          name: 'Bad Request',
          message: `You already have vendor with name: ${req.body.name}`,
        };
      }

      const createVendor = await Vendor.create([payload], { session });
      await session.commitTransaction();
      session.endSession();

      res
        .status(httpStatus.StatusCodes.CREATED)
        .json(resHelpers.success('Success create a vendor', createVendor));
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error(error);
      next(error);
    }
  }

  static async getAllCategories(req, res, next) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { page, limit, sort } = req.query;

      let sortOptions = { updated_at: -1 };
      if (sort) {
        const [type, order] = sort.split(':');
        sortOptions = { [type]: order === 'asc' ? 1 : -1 };
      }

      const options = {
        page: page || 1,
        limit: limit || 100000,
        sort: sortOptions,
      };

      const findCategories = await dataPagination(Vendor, null, null, options);
      await session.commitTransaction();
      session.endSession();

      res
        .status(httpStatus.StatusCodes.OK)
        .json(resHelpers.success('Success fetch data', findCategories));
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error(error);
      next(error);
    }
  }

  static async getVendorById(req, res, next) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { id } = req.params;
      const findVendor = await detailById(Vendor, id, null);

      if (!findVendor) {
        throw { name: 'Not Found', message: 'Vendor not found' };
      }

      await session.commitTransaction();
      session.endSession();

      res
        .status(httpStatus.StatusCodes.OK)
        .json(resHelpers.success('Success fetch data', findVendor));
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error(error);
      next(error);
    }
  }

  static async update(req, res, next) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { id } = req.params;
      const payload = {
        name: req.body.name,
        slug: req.body.name.toLowerCase().replace(/ /g, '_'),
        updated_at: new Date(),
      };

      const updatedVendor = await Vendor.findOneAndUpdate(
        { _id: id },
        payload,
        { new: true, session }
      );

      if (!updatedVendor) {
        throw { name: 'Not Found', message: 'Vendor not found' };
      }

      await session.commitTransaction();
      session.endSession();

      res
        .status(httpStatus.StatusCodes.OK)
        .json(resHelpers.success('Success update data', updatedVendor));
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error(error);
      next(error);
    }
  }

  static async delete(req, res, next) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { id } = req.params;
      const deletedVendor = await Vendor.findOneAndDelete({
        _id: id,
      }).session(session);
      if (!deletedVendor) {
        throw { name: 'Not Found', message: 'Vendor not found' };
      }

      await session.commitTransaction();
      session.endSession();

      res
        .status(httpStatus.StatusCodes.OK)
        .json(resHelpers.success('Success delete data', deletedVendor));
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error(error);
      next(error);
    }
  }
}
module.exports = VendorController;
