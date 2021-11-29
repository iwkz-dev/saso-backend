"use strict";

const httpStatus = require("http-status-codes");
const Event = require("@models/event");
const resUtils = require("@utils/responseUtils");

class EventController {
  // ! BELOM ADA AUTHENTICATION BISA JADI REFERENSI BUAT BELAJAR
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
        .json(resUtils.success("success create an event", createEvent));
    } catch (error) {
      console.log(error);
      res
        .status(httpStatus.StatusCodes.BAD_REQUEST)
        .json(resUtils.failed(error.message, error));
    }
  }

  static async getAllEvents(req, res, next) {
    try {
      const findEvents = await Event.find();
      res
        .status(httpStatus.StatusCodes.OK)
        .json(resUtils.success("success fetch data", findEvents));
    } catch (error) {
      console.log(error);
      res
        .status(httpStatus.StatusCodes.BAD_REQUEST)
        .json(resUtils.failed(error.message, error));
    }
  }
}

module.exports = EventController;
