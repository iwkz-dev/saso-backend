"use strict";

const httpStatus = require("http-status-codes");
const Menu = require("@models/menu");
const Event = require("@models/event");
const resHelpers = require("@helpers/responseHelpers");
const { dataPagination } = require("@helpers/dataHelper");

class MenuController {
  static async getAllMenus(req, res, next) {
    const { page, limit, event, category, flagDate, status } = req.query;

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
      if (flagDate === "now" || status) {
        let statusQuery = "";
        if (status === "draft") {
          statusQuery = 0;
        }
        if (status === "approved") {
          statusQuery = 1;
        }
        if (status === "done") {
          statusQuery = 2;
        }

        let filterEvent = {};
        if (flagDate) {
          filterEvent.startYear = { $gte: new Date().getFullYear() };
        }
        if (status) {
          filterEvent.status = statusQuery;
        }
        console.log(
          "🚀 ~ file: MenuController.js ~ line 36 ~ MenuController ~ getAllMenus ~ filterEvent",
          filterEvent
        );
        const findEvent = await Event.findOne(filterEvent);
        filter.event = findEvent._id;
      }
      if (event) {
        filter.event = event;
      }
      if (category) {
        filter.category = category;
      }

      const findMenu = await dataPagination(Menu, filter, null, options);
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
