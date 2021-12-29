"use strict";

const httpStatus = require("http-status-codes");
const Menu = require("@models/menu");
const resHelpers = require("@helpers/responseHelpers");
const { dataPagination } = require("@helpers/dataHelper");

class MenuController {
  static async getAllMenus(req, res, next) {
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

      const findMenu = await dataPagination(Menu, null, null, options);
      res
        .status(httpStatus.StatusCodes.OK)
        .json(resHelpers.success("success fetch data", findMenu));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = MenuController;
