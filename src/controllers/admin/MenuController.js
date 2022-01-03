"use strict";

const httpStatus = require("http-status-codes");
const Menu = require("@models/menu");
const resHelpers = require("@helpers/responseHelpers");
const { dataPagination } = require("@helpers/dataHelper");

class MenuController {
  // TO DO: update menu, get specific menu based on name, delete specific menu, delete all menu
  // belum ada image
  static async create(req, res, next) {
    const payload = {
      name: req.body.name,
      description: req.body.description,
      quantity: req.body.quantity,
      price: req.body.price,
      category: req.body.category,
      event: req.body.event || null,
      updated_at: new Date(),
      created_at: new Date(),
    };
    console.log(payload);
    try {
      const createMenu = await Menu.create(payload);
      res
        .status(httpStatus.StatusCodes.CREATED)
        .json(resHelpers.success("success create an menu", createMenu));
    } catch (error) {
      next(error);
    }
  }

  static async getAllMenus(req, res, next) {
    const { page, limit, event } = req.query;

    try {
      const options = {
        page: page || 1,
        limit: limit || 100000,
        sort: {
          type: "updated_at",
          method: -1,
        },
      };

      let filter = {};
      if (event) {
        filter.event = event;
      }

      const findMenu = await dataPagination(Menu, filter, null, options);
      res
        .status(httpStatus.StatusCodes.OK)
        .json(resHelpers.success("success fetch data", findMenu));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = MenuController;
