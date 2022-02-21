"use strict";

const httpStatus = require("http-status-codes");
const Event = require("@models/event");
const resHelpers = require("@helpers/responseHelpers");
const { dataPagination, getOneData } = require("@helpers/dataHelper");

class EventController {
  // -1 for descending & 1 for ascending
  static async getAllEvents(req, res, next) {
    // let limit = 3;
    // let page = 1;
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
      let filter = {};
      if (flagDate === "now") {
        filter.startYear = { $gte: new Date().getFullYear() };
      }
      console.log(
        "🚀 ~ file: EventController.js ~ line 50 ~ EventController ~ getAllEvents ~ filter",
        filter
      );
      const findEvents = await dataPagination(Event, filter, null, options);

      // const findEvents = await Event.find(null, null, {
      //   sort: { updated_at: -1 },
      //   limit: limit * 1,
      //   skip: (page - 1) * limit,
      // });
      // .limit(limit * 1)
      // .skip((page - 1) * limit)
      // .sort({ updated_at: -1 });
      res
        .status(httpStatus.StatusCodes.OK)
        .json(resHelpers.success("success fetch data", findEvents));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

module.exports = EventController;
