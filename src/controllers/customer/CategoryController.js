"use strict";

const httpStatus = require("http-status-codes");
const Category = require("@models/category");
const Menu = require("@models/menu");
const Event = require("@models/event");
const resHelpers = require("@helpers/responseHelpers");
const { dataPagination } = require("@helpers/dataHelper");

class CategoryController {
  static async getAllCategories(req, res, next) {
    const { page, limit, flagDate } = req.query;

    try {
      const options = {
        page: page || 1,
        limit: limit || 100000,
        sort: {
          type: "updated_at",
          method: -1,
        },
      };

      const categories = await Category.find();

      const result = await Promise.all(
        await categories.map(async (el) => {
          let filter = { category: el._id };
          if (flagDate === "now") {
            const findEvent = await Event.findOne({
              startYear: { $gte: new Date().getFullYear() },
            });

            filter.event = findEvent._id;
          }
          const foundMenu = await dataPagination(Menu, filter, null, options);
          return { _id: el._id, name: el.name, menus: foundMenu };
        })
      );
      res
        .status(httpStatus.StatusCodes.OK)
        .json(resHelpers.success("success fetch data", result));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

module.exports = CategoryController;
