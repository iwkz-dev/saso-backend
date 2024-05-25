'use strict';

const mongoose = require('mongoose');
const httpStatus = require('http-status-codes');
const Category = require('@models/category');
const resHelpers = require('@helpers/responseHelpers');
const {
  dataPagination,
  detailById,
  firstWordUppercase,
} = require('@helpers/dataHelper');

class CategoryController {
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

      const findCategory = await Category.findOne({ slug }).session(session);
      if (findCategory) {
        throw {
          name: 'Bad Request',
          message: `You already have category with name: ${req.body.name}`,
        };
      }

      const createCategory = await Category.create([payload], { session });
      await session.commitTransaction();
      session.endSession();

      res
        .status(httpStatus.StatusCodes.CREATED)
        .json(resHelpers.success('Success create a category', createCategory));
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

      const findCategories = await dataPagination(
        Category,
        null,
        null,
        options
      );
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

  static async getCategoryById(req, res, next) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { id } = req.params;
      const findCategory = await detailById(Category, id, null);

      if (!findCategory) {
        throw { name: 'Not Found', message: 'Category not found' };
      }

      await session.commitTransaction();
      session.endSession();

      res
        .status(httpStatus.StatusCodes.OK)
        .json(resHelpers.success('Success fetch data', findCategory));
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

      const updatedCategory = await Category.findOneAndUpdate(
        { _id: id },
        payload,
        { new: true, session }
      );

      if (!updatedCategory) {
        throw { name: 'Not Found', message: 'Category not found' };
      }

      await session.commitTransaction();
      session.endSession();

      res
        .status(httpStatus.StatusCodes.OK)
        .json(resHelpers.success('Success update data', updatedCategory));
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
      const deletedCategory = await Category.findOneAndDelete({
        _id: id,
      }).session(session);
      if (!deletedCategory) {
        throw { name: 'Not Found', message: 'Category not found' };
      }

      await session.commitTransaction();
      session.endSession();

      res
        .status(httpStatus.StatusCodes.OK)
        .json(resHelpers.success('Success delete data', deletedCategory));
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error(error);
      next(error);
    }
  }
}
module.exports = CategoryController;
