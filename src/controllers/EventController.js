"use strict";

const httpStatus = require("http-status-codes");
const Event = require("@models/event");
const Image = require("@models/image");
const resUtils = require("@utils/responseUtils");

class EventController {
  // ! BELOM ADA AUTHENTICATION BISA JADI REFERENSI BUAT BELAJAR
  static async create(req, res, next) {
    const payload = {
      name: req.body.name,
      description: req.body.description,
      started_at: req.body.started_at,
      images: req.body.imagesData,
      updated_at: new Date(),
      created_at: new Date(),
    };

    try {
      const payloadImage = req.body.imagesData;
      const createEvent = await Event.create(payload);
      payloadImage.forEach((el) => {
        el.type = "event";
        el.parent_uid = createEvent._id;
        el.updated_at = new Date();
        el.created_at = new Date();
      });
      await Image.insertMany(payloadImage);
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

  static async getEventById(req, res, next) {
    try {
      const { id } = req.params;
      const findEvent = await Event.findById(id);
      res
        .status(httpStatus.StatusCodes.OK)
        .json(resUtils.success("success fetch data", findEvent));
    } catch (error) {
      console.log(error);
      res
        .status(httpStatus.StatusCodes.BAD_REQUEST)
        .json(resUtils.failed(error.message, error));
    }
  }

  static async uploadImage(req, res, next) {
    try {
      console.log(req.body.imageUrls);
      res.send("testing ke controller");
    } catch (error) {
      console.log(error);
      res
        .status(httpStatus.StatusCodes.BAD_REQUEST)
        .json(resUtils.failed(error.message, error));
    }
  }
}

module.exports = EventController;
