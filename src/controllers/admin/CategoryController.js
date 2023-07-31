'use strict';

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
    try {
      const name = await firstWordUppercase(req.body.name);
      const payload = {
        name,
        updated_at: new Date(),
        created_at: new Date(),
      };
      let slug;
      if (req.body.name) {
        slug = req.body.name.toLowerCase().replace(' ', '_');
      }
      slug = '';
      const findCategory = await Category.findOne({ slug });
      if (findCategory) {
        throw {
          name: 'Bad Request',
          message: `You already have category with name: ${req.body.name}`,
        };
      } else {
        const createCategory = await Category.create(payload);
        res
          .status(httpStatus.StatusCodes.CREATED)
          .json(
            resHelpers.success('success create an category', createCategory)
          );
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async getAllCategories(req, res, next) {
    const { page, limit, sort } = req.query;
    try {
      const options = {
        page: page || 1,
        limit: limit || 100000,
        sort: {
          type: 'updated_at',
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

      const findCategories = await dataPagination(
        Category,
        null,
        null,
        options
      );
      res
        .status(httpStatus.StatusCodes.OK)
        .json(resHelpers.success('success fetch data', findCategories));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async getCategoryById(req, res, next) {
    const { id } = req.params;
    try {
      const findCategory = await detailById(Category, id, null);
      if (!findCategory) {
        throw { name: 'Not Found', message: 'Category not found' };
      }
      res
        .status(httpStatus.StatusCodes.OK)
        .json(resHelpers.success('success fetch data', findCategory));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async update(req, res, next) {
    const payload = {
      name: req.body.name,
      slug: req.body.name.toLowerCase().replace(' ', '_'),
      updated_at: new Date(),
    };

    const { id } = req.params;
    try {
      const updatedCategory = await Category.findOneAndUpdate(
        { _id: id },
        payload,
        { new: true }
      );
      if (!updatedCategory) {
        throw { name: 'Not Found', message: 'Category not found' };
      }
      res
        .status(httpStatus.StatusCodes.OK)
        .json(resHelpers.success('success update data', updatedCategory));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async delete(req, res, next) {
    const { id } = req.params;

    try {
      const deletedCategory = await Category.findOneAndDelete({ _id: id });
      if (!deletedCategory) {
        throw { name: 'Not Found', message: 'Category not found' };
      }
      res
        .status(httpStatus.StatusCodes.OK)
        .json(resHelpers.success('success delete data', deletedCategory));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

module.exports = CategoryController;
