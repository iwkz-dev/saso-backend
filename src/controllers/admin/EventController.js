'use strict';

const mongoose = require('mongoose');
const httpStatus = require('http-status-codes');
const Event = require('@models/event');
const Menu = require('@models/menu');
const PaymentType = require('@models/paymentType');
const resHelpers = require('@helpers/responseHelpers');
const { bulkUpload, deleteImages, deleteImage } = require('@helpers/images');
const {
  dataPagination,
  detailById,
  updateWithImages,
  firstWordUppercase,
} = require('@helpers/dataHelper');
const { STATUS_EVENT_MAP } = require('@constants/status');

class EventController {
  static async create(req, res, next) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const name = await firstWordUppercase(req.body.name);

      const payload = {
        name,
        slug: name
          .toLowerCase()
          .trim()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, ''),
        description: req.body.description || '',
        started_at: req.body.started_at,
        po_closed: req.body.po_closed || false,
        images: req.body.imagesData || [],
        status: 0,
        iban: req.body.iban || '',
        bic: req.body.bic || '',
        bankName: req.body.bankName || '',
        paypal: req.body.paypal || '',
        usageNote: req.body.usageNote || '',
        paymentTypes: req.body.paymentTypes || [],
        updated_at: new Date(),
        created_at: new Date(),
      };

      const getYear = req.body.started_at.split('-');
      payload.startYear = getYear[0];

      // Validate unique payment type names
      if (payload.paymentTypes.length > 0) {
        const paymentTypesData = await PaymentType.find({
          _id: { $in: payload.paymentTypes },
        }).session(session);

        const nameCount = {};
        for (const pt of paymentTypesData) {
          nameCount[pt.name] = (nameCount[pt.name] || 0) + 1;
        }

        const duplicates = Object.keys(nameCount).filter(
          (n) => nameCount[n] > 1
        );
        if (duplicates.length > 0) {
          throw {
            name: 'Bad Request',
            message: `Duplicate payment type names found: ${duplicates.join(
              ', '
            )}`,
          };
        }
      }

      const createEvent = await Event.create([payload], { session });

      if (req.body.imagesData) {
        await bulkUpload(req.body.imagesData, createEvent[0]._id, 'event');
      }

      await session.commitTransaction();

      res
        .status(httpStatus.StatusCodes.CREATED)
        .json(resHelpers.success('success create an event', createEvent[0]));
    } catch (error) {
      await session.abortTransaction();
      console.log(error);
      next(error);
    } finally {
      session.endSession();
    }
  }

  static async getAllEvents(req, res, next) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { page = 1, limit = 100000, flagDate, status, sort } = req.query;

      const statusQuery =
        status !== undefined ? STATUS_EVENT_MAP[status] : undefined;

      if (status && statusQuery === undefined) {
        throw { name: 'Bad Request', message: 'Invalid status' };
      }

      const options = {
        page,
        limit,
        sort: {
          type: 'created_at',
          method: -1,
        },
        session,
      };

      if (sort) {
        const [type, order] = sort.split(':');
        options.sort = {
          type,
          method: order === 'desc' ? -1 : 1,
        };
      }

      const filter = {};

      if (flagDate === 'now') {
        filter.startYear = { $gte: new Date().getFullYear() };
      }

      if (status) {
        filter.status = statusQuery;
      }

      const findEvents = await dataPagination(
        Event,
        filter,
        null,
        options,
        session
      );

      await session.commitTransaction();

      res
        .status(httpStatus.StatusCodes.OK)
        .json(resHelpers.success('Success load events', findEvents));
    } catch (error) {
      await session.abortTransaction();
      console.log(error);
      next(error);
    } finally {
      session.endSession();
    }
  }

  static async getEventById(req, res, next) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const { id } = req.params;
      const findEvent = await Event.findById(id)
        .populate('paymentTypes')
        .session(session);
      if (!findEvent) {
        throw { name: 'Not Found', message: 'Event not found' };
      }

      await session.commitTransaction();

      res
        .status(httpStatus.StatusCodes.OK)
        .json(resHelpers.success('Success load an event', findEvent));
    } catch (error) {
      await session.abortTransaction();
      console.log(error);
      next(error);
    } finally {
      session.endSession();
    }
  }

  static async destroy(req, res, next) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const { id } = req.params;

      const deletedEvent = await Event.findOneAndDelete(
        { _id: id },
        { session }
      );
      if (!deletedEvent) {
        throw { name: 'Not Found', message: 'Event not found' };
      }

      // DELETE PHOTO FROM DATABASE AND IMAGEKIT
      if (deletedEvent.images.length > 0) {
        await deleteImages(deletedEvent.images);
      }

      // DELETE MENU THAT HAS RELATIONS WITH EVENT
      const findMenu = await Menu.find({ event: deletedEvent._id }).session(
        session
      );

      if (findMenu.length > 0) {
        await Menu.deleteMany({ event: deletedEvent._id }).session(session);
        findMenu.forEach(async (menu) => {
          if (menu.images.length > 0) {
            await deleteImages(menu.images);
          }
        });
      }

      await session.commitTransaction();

      res
        .status(httpStatus.StatusCodes.OK)
        .json(resHelpers.success('Event successfully deleted', deletedEvent));
    } catch (error) {
      await session.abortTransaction();
      console.log(error);
      next(error);
    } finally {
      session.endSession();
    }
  }

  static async update(req, res, next) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const { id } = req.params;

      if (req.body.imageUrls) {
        const imageUrls = Array.isArray(req.body.imageUrls)
          ? req.body.imageUrls
          : [req.body.imageUrls];

        if (!Array.isArray(req.body.eTags)) {
          req.body.eTags = [];
        }

        imageUrls.forEach((imageId) => {
          req.body.eTags.push(imageId);
        });
      }

      const findEvent = await detailById(Event, id, null);
      if (!findEvent) {
        throw { name: 'Not Found', message: `Event not found` };
      }

      const options = {
        imagesData: req.body.imagesData || [],
        bodyETags: req.body.eTags,
        dataFound: findEvent,
      };

      const payloadImages = await updateWithImages(options);
      if (payloadImages.imagesSaved.length > 5) {
        await deleteImages(req.body.imagesData);
        throw { name: 'Bad Request', message: 'The limit of image is 5' };
      }
      await deleteImages(payloadImages.imagesNotSaved);

      const getYear = req.body.started_at.split('-');

      const payload = {
        name: req.body.name,
        slug: req.body.name
          .toLowerCase()
          .trim()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, ''),
        description: req.body.description || '',
        started_at: req.body.started_at,
        po_closed: req.body.po_closed || false,
        startYear: getYear[0],
        images: payloadImages.imagesSaved,
        iban: req.body.iban || '',
        bic: req.body.bic || '',
        bankName: req.body.bankName || '',
        paypal: req.body.paypal || '',
        usageNote: req.body.usageNote || '',
        status: req.body.status,
        paymentTypes: req.body.paymentTypes || [],
        updated_at: new Date(),
      };

      // Validate unique payment type names
      if (payload.paymentTypes.length > 0) {
        const paymentTypesData = await PaymentType.find({
          _id: { $in: payload.paymentTypes },
        }).session(session);

        const nameCount = {};
        for (const pt of paymentTypesData) {
          nameCount[pt.name] = (nameCount[pt.name] || 0) + 1;
        }

        const duplicates = Object.keys(nameCount).filter(
          (n) => nameCount[n] > 1
        );
        if (duplicates.length > 0) {
          throw {
            name: 'Bad Request',
            message: `Duplicate payment type names found: ${duplicates.join(
              ', '
            )}`,
          };
        }
      }

      const updatedEvent = await Event.findOneAndUpdate({ _id: id }, payload, {
        new: true,
        session,
      });

      if (!updatedEvent) {
        throw { name: 'Not Found', message: 'Event not found' };
      }

      if (req.body.imagesData) {
        await bulkUpload(req.body.imagesData, findEvent._id, 'event');
      }

      await session.commitTransaction();

      res
        .status(httpStatus.StatusCodes.OK)
        .json(resHelpers.success('success update data', updatedEvent));
    } catch (error) {
      await session.abortTransaction();
      console.log(error);
      next(error);
    } finally {
      session.endSession();
    }
  }

  static async uploadImages(req, res, next) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const { id } = req.params;

      const findEvent = await Event.findById(id).session(session);

      if (!findEvent) {
        throw { name: 'Not Found', message: 'Event not found' };
      }
      if (findEvent.images.length + req.body.imagesData.length > 5) {
        throw { name: 'Bad Request', message: 'You can only upload 5 images' };
      }

      const imagesPayload = [...findEvent.images, ...req.body.imagesData];

      const payload = {
        images: imagesPayload,
        updated_at: new Date(),
      };

      const updateEventImages = await Event.updateOne({ _id: id }, payload, {
        session,
      });

      if (req.body.imagesData) {
        await bulkUpload(req.body.imagesData, findEvent._id, 'event');
      }

      await session.commitTransaction();

      res
        .status(httpStatus.StatusCodes.OK)
        .json(
          resHelpers.success(
            'success add images to the Event',
            updateEventImages
          )
        );
    } catch (error) {
      await session.abortTransaction();
      console.log(error);
      next(error);
    } finally {
      session.endSession();
    }
  }

  static async destroyImages(req, res, next) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const { id, eTag } = req.params;

      const findEvent = await Event.findById(id).session(session);

      if (!findEvent) {
        throw { name: 'Not Found', message: 'Event not found' };
      }

      if (findEvent.images.length === 0) {
        throw { name: 'Bad Request', message: 'Image is empty' };
      }

      await deleteImage('event', eTag);

      const imagesPayload = findEvent.images.filter((el) => el.eTag !== eTag);

      const payload = {
        images: imagesPayload,
        updated_at: new Date(),
      };

      const updatedEvent = await Event.findOneAndUpdate({ _id: id }, payload, {
        new: true,
        session,
      });

      await session.commitTransaction();

      res
        .status(httpStatus.StatusCodes.CREATED)
        .json(resHelpers.success('success destroy an image', updatedEvent));
    } catch (error) {
      await session.abortTransaction();
      console.log(error);
      next(error);
    } finally {
      session.endSession();
    }
  }

  static async changeStatus(req, res, next) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { id, status } = req.params;

      const statusPayload = STATUS_EVENT_MAP[status];

      if (statusPayload === undefined) {
        throw { name: 'Bad Request', message: 'Invalid status' };
      }

      const updateEvent = await Event.findOneAndUpdate(
        { _id: id },
        { status: statusPayload, updated_at: new Date() },
        { new: true, session }
      );

      await session.commitTransaction();

      res
        .status(httpStatus.StatusCodes.OK)
        .json(resHelpers.success('success change status', updateEvent));
    } catch (error) {
      await session.abortTransaction();
      console.log(error);
      next(error);
    } finally {
      session.endSession();
    }
  }

  static async changePOClosed(req, res, next) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const { id, poClosedStatus } = req.params;

      let statusPOClosed;
      if (poClosedStatus === 'no') {
        statusPOClosed = false;
      } else if (poClosedStatus === 'yes') {
        statusPOClosed = true;
      } else {
        throw { name: 'Bad Request', message: 'Invalid status' };
      }

      const updateEvent = await Event.findOneAndUpdate(
        { _id: id },
        { po_closed: statusPOClosed, updated_at: new Date() },
        { new: true, session }
      );

      await session.commitTransaction();

      res
        .status(httpStatus.StatusCodes.OK)
        .json(
          resHelpers.success('success change PO Closed status', updateEvent)
        );
    } catch (error) {
      await session.abortTransaction();
      console.log(error);
      next(error);
    } finally {
      session.endSession();
    }
  }

  // ! LATER BAKAL KEHAPUS
  static async uploadImage(req, res, next) {
    try {
      res.send('testing ke controller');
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

module.exports = EventController;
