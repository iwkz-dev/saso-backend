"use strict";

const httpStatus = require("http-status-codes");
const Category = require("@models/category");
const resHelpers = require("@helpers/responseHelpers");
const { dataPagination } = require("@helpers/dataHelper");

class CategoryController {
  static async create(req, res, next) {
    const payload = {
      name: req.body.name,
      updated_at: new Date(),
      created_at: new Date(),
    };
    try {
      const createCategory = await Category.create(payload);
      res
        .status(httpStatus.StatusCodes.CREATED)
        .json(resHelpers.success("success create an event", createCategory));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async getAllCategories(req, res, next) {
    const { page, limit } = req.query;

    try {
      const options = {
        page: page || 1,
        limit: limit || 100000,
        sort: {
          type: "updated_at",
          method: -1,
        },
      };
      const findCategories = await dataPagination(
        Category,
        null,
        null,
        options
      );
      res
        .status(httpStatus.StatusCodes.OK)
        .json(resHelpers.success("success fetch data", findCategories));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

module.exports = CategoryController;
