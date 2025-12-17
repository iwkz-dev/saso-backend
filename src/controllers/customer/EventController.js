'use strict';

const httpStatus = require('http-status-codes');
const Event = require('@models/event');
const ContactPerson = require('@models/contactPerson');
const resHelpers = require('@helpers/responseHelpers');
const { dataPagination } = require('@helpers/dataHelper');
const mongoose = require('mongoose');

class EventController {
  // -1 for descending & 1 for ascending
  static async getAllEvents(req, res, next) {
    const { page, limit, flagDate, status } = req.query;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      let statusQuery;
      switch (status) {
        case 'draft':
          statusQuery = 0;
          break;
        case 'approved':
          statusQuery = 1;
          break;
        case 'done':
          statusQuery = 2;
          break;
        default:
          statusQuery = undefined;
      }

      const options = {
        page: page || 1,
        limit: limit || 100000,
        sort: { updated_at: -1 },
      };

      const filter = {};
      if (flagDate === 'now') {
        filter.startYear = { $gte: new Date().getFullYear() };
      }
      if (statusQuery !== undefined) {
        filter.status = statusQuery;
      }

      const findEvents = await dataPagination(
        Event,
        filter,
        null,
        options,
        session
      );

      const eventWithContactPerson = await Promise.all(
        findEvents.data.map(async (event) => {
          const contactPersons = await ContactPerson.find({
            event: event._id,
          }).session(session);
          return {
            ...event._doc,
            contactPersons,
          };
        })
      );

      findEvents.data = eventWithContactPerson;

      await session.commitTransaction();
      session.endSession();

      res
        .status(httpStatus.StatusCodes.OK)
        .json(resHelpers.success('success fetch data', findEvents));
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.log(error);
      next(error);
    }
  }

  static async getEventBySlug(req, res, next) {
    const { slug } = req.params;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const event = await Event.findOne({ slug, status: 1 }).session(session);
      if (!event) {
        throw { name: 'Not Found', message: 'Event not found' };
      }

      const contactPersons = await ContactPerson.find({
        event: event._id,
      }).session(session);

      const eventWithContactPersons = {
        ...event._doc,
        contactPersons,
      };

      await session.commitTransaction();
      session.endSession();

      res
        .status(httpStatus.StatusCodes.OK)
        .json(
          resHelpers.success('success fetch data', eventWithContactPersons)
        );
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.log(error);
      next(error);
    }
  }
}

module.exports = EventController;
