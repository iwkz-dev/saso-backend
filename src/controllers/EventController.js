"use strict";

const httpStatus = require("http-status-codes");
const Event = require("@models/event");
const Image = require("@models/image");
const resHelpers = require("@helpers/responseHelpers");

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
        .json(resHelpers.success("success create an event", createEvent));
    } catch (error) {
      console.log(error);
      next(error);
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
      next(error);
    }
  }

  static async getEventById(req, res, next) {
    try {
      const { id } = req.params;
      const findEvent = await Event.findById(id);
      if (!findEvent) {
        throw { name: "Not Found", message: "Event saso not found" };
      }
      res
        .status(httpStatus.StatusCodes.OK)
        .json(resHelpers.success("success fetch data", findEvent));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async uploadImage(req, res, next) {
    try {
      console.log(req.body.imageUrls);
      res.send("testing ke controller");
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = EventController;
