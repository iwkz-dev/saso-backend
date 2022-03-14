"use strict";

const httpStatus = require("http-status-codes");
const Event = require("@models/event");
const resHelpers = require("@helpers/responseHelpers");
const { bulkUpload, deleteImages, deleteImage } = require("@helpers/images");
const { dataPagination } = require("@helpers/dataHelper");

class EventController {
  static async create(req, res, next) {
    let payload = {
      name: req.body.name,
      description: req.body.description,
      started_at: req.body.started_at,
      images: req.body.imagesData,
      updated_at: new Date(),
      created_at: new Date(),
    };

    try {
      const getYear = req.body.started_at.split("-");
      payload.startYear = getYear[0];
      // if(req.body.started_at) {}
      const createEvent = await Event.create(payload);
      if (req.body.imagesData) {
        await bulkUpload(req.body.imagesData, createEvent._id, "event");
      }

      res
        .status(httpStatus.StatusCodes.CREATED)
        .json(resHelpers.success("success create an event", createEvent));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

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

  static async getEventById(req, res, next) {
    try {
      const { id } = req.params;
      const findEvent = await Event.findById(id);
      if (!findEvent) {
        throw { name: "Not Found", message: "Event not found" };
      }
      res
        .status(httpStatus.StatusCodes.OK)
        .json(resHelpers.success("success fetch data", findEvent));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async destroy(req, res, next) {
    const { id } = req.params;
    try {
      const deletedEvent = await Event.findOneAndDelete({ _id: id });
      if (!deletedEvent) {
        throw { name: "Not Found", message: "Event not found" };
      }
      // DELETE PHOTO FROM DATABASE AND IMAGEKIT
      // ? ATAU MAU TETEP DISIMPEN?
      if (deletedEvent.images.length > 0) {
        await deleteImages(deletedEvent);
      }
      res
        .status(httpStatus.StatusCodes.OK)
        .json(resHelpers.success("success delete data", deletedEvent));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async update(req, res, next) {
    let payload = {
      name: req.body.name,
      description: req.body.description,
      started_at: req.body.started_at,
      updated_at: new Date(),
    };
    const { id } = req.params;
    try {
      const getYear = req.body.started_at.split("-");
      payload.startYear = getYear[0];
      const updatedEvent = await Event.findOneAndUpdate({ _id: id }, payload, {
        new: true,
      });
      if (!updatedEvent) {
        throw { name: "Not Found", message: "Event not found" };
      }
      res
        .status(httpStatus.StatusCodes.OK)
        .json(resHelpers.success("success update data", updatedEvent));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async uploadImages(req, res, next) {
    const { id } = req.params;

    try {
      const findEvent = await Event.findById(id);

      if (!findEvent) {
        throw { name: "Not Found", message: "Event not found" };
      }
      if (findEvent.images.length > 4) {
        throw { name: "Bad Request", message: "You can only upload 5 images" };
      }
      let imagesPayload = [...findEvent.images];
      req.body.imagesData.forEach((el) => {
        imagesPayload.push(el);
      });

      const payload = {
        images: imagesPayload,
        updated_at: new Date(),
      };

      const updateEventImages = await Event.update({ _id: id }, payload, {
        new: true,
      });

      if (req.body.imagesData) {
        await bulkUpload(req.body.imagesData, findEvent._id, "event");
      }

      res
        .status(httpStatus.StatusCodes.OK)
        .json(
          resHelpers.success(
            "success add images to the Event",
            updateEventImages
          )
        );
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async destroyImages(req, res, next) {
    const { id, eTag } = req.params;

    try {
      const findEvent = await Event.findById(id);

      if (!findEvent) {
        throw { name: "Not Found", message: "Event not found" };
      }

      let imagesPayload = [];

      if (findEvent.images.length > 0) {
        await deleteImage("event", eTag);
        findEvent.images.forEach((el) => {
          if (el.eTag !== eTag) {
            imagesPayload.push(el);
          }
        });
        const payload = {
          images: imagesPayload,
          updated_at: new Date(),
        };

        const updatedEvent = await Event.findOneAndUpdate(
          { _id: id },
          payload,
          {
            new: true,
          }
        );
        res
          .status(httpStatus.StatusCodes.CREATED)
          .json(resHelpers.success("success destroy an image", updatedEvent));
      } else {
        throw { name: "Bad Request", message: "Image is empty" };
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  // ! LATER BAKAL KEHAPUS
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
