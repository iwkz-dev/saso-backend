"use strict";

const httpStatus = require("http-status-codes");
const Menu = require("@models/menu");
const resHelpers = require("@helpers/responseHelpers");
const { dataPagination } = require("@helpers/dataHelper");

class MenuController {
  static async getAllMenus(req, res, next) {
    const { page, limit, event, category, date } = req.query;

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
      if (date === "now") {
        const findEvent = await Event.findOne({
          startYear: { $gte: new Date().getFullYear() },
        });
        console.log(
          "🚀 ~ file: MenuController.js ~ line 57 ~ MenuController ~ getAllMenus ~ findEvent",
          findEvent
        );

        filter.event = findEvent._id;
      }
      if (event) {
        filter.event = event;
      }
      if (category) {
        filter.category = category;
      }

      const findMenu = await dataPagination(Menu, null, null, options);
      res
        .status(httpStatus.StatusCodes.OK)
        .json(resHelpers.success("success fetch data", findMenu));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

module.exports = MenuController;
