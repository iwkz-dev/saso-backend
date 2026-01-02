'use strict';

const mongoose = require('mongoose');
const httpStatus = require('http-status-codes');
const Event = require('@models/event');
const resHelpers = require('@helpers/responseHelpers');
const { STATUS_EVENT_MAP } = require('@constants/status');

class EventController {
  // -1 for descending & 1 for ascending
  static async getAllEvents(req, res, next) {
    const { page = 1, limit = 100000, flagDate, status } = req.query;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const filter = {};

      if (flagDate === 'now') {
        filter.startYear = { $gte: new Date().getFullYear() };
      }

      if (status && STATUS_EVENT_MAP[status] !== undefined) {
        filter.status = STATUS_EVENT_MAP[status];
      }

      const skip = (Number(page) - 1) * Number(limit);

      const pipeline = [
        { $match: filter },

        {
          $lookup: {
            from: 'contactpeople',
            localField: '_id',
            foreignField: 'event',
            as: 'contactPersons',
          },
        },

        { $sort: { updated_at: -1 } },

        {
          $facet: {
            data: [{ $skip: skip }, { $limit: Number(limit) }],
            total: [{ $count: 'count' }],
          },
        },
      ];

      const result = await Event.aggregate(pipeline).session(session);

      const data = result[0].data;
      const total = result[0].total[0]?.count || 0;

      await session.commitTransaction();

      res.status(httpStatus.StatusCodes.OK).json(
        resHelpers.success('success fetch data', {
          data,
          total,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(total / limit),
        })
      );
    } catch (error) {
      await session.abortTransaction();
      console.error(error);
      next(error);
    } finally {
      session.endSession();
    }
  }

  static async getEventBySlug(req, res, next) {
    const { page = 1, limit = 100000, slug } = req.params;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const pipeline = [
        { $match: { slug, status: 1 } },
        {
          $lookup: {
            from: 'contactpeople',
            localField: '_id',
            foreignField: 'event',
            as: 'contactPersons',
          },
        },
        { $sort: { updated_at: -1 } },
        { $skip: (page - 1) * limit },
        { $limit: limit },
      ];

      const result = await Event.aggregate(pipeline).session(session);

      if (!result.length) {
        throw { name: 'Not Found', message: 'Event not found' };
      }

      const totalCount = await Event.countDocuments({ slug, status: 1 });
      const totalPage = Math.ceil(totalCount / limit);
      const pagination = {
        maxPage: totalPage,
        currentPage: page,
        limit,
        count: totalCount,
      };

      await session.commitTransaction();

      res
        .status(httpStatus.StatusCodes.OK)
        .json(
          resHelpers.success('success fetch data', { ...result[0], pagination })
        );
    } catch (error) {
      await session.abortTransaction();
      console.error(error);
      next(error);
    } finally {
      session.endSession();
    }
  }
}

module.exports = EventController;
