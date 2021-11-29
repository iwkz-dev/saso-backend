"use strict";

const httpStatus = require("http-status-codes");
const Event = require("@models/event");
const resHelpers = require("@helpers/responseHelper");

class EventController {
  // ! BELOM ADA AUTHENTICATION
  static async create(req, res, next) {
    const payload = {
      name: req.body.name,
      description: req.body.description,
      started_at: req.body.started_at,
      updated_at: new Date(),
      created_at: new Date(),
    };
    try {
      const createEvent = await Event.create(payload);
      console.log(payload);
      res
        .status(httpStatus.StatusCodes.CREATED)
        .json(resHelpers.success("success create an event", createEvent));
    } catch (error) {
      console.log(error);
      res
        .status(httpStatus.StatusCodes.BAD_REQUEST)
        .json(resHelpers.failed(error.message, error));
    }
  }

  static async getAllEvents(req, res, next) {
    try {
      const findEvents = await Event.find();
      res
        .status(httpStatus.StatusCodes.OK)
        .json(resHelpers.success("success fetch data", findEvents));
    } catch (error) {
      console.log(error);
      res
        .status(httpStatus.StatusCodes.BAD_REQUEST)
        .json(resHelpers.failed(error.message, error));
    }
  }
}

module.exports = EventController;
