'use strict';

const httpStatus = require('http-status-codes');
const Event = require('@models/event');
const resHelpers = require('@helpers/responseHelpers');
const { dataPagination, getOneData } = require('@helpers/dataHelper');

class EventController {
  // -1 for descending & 1 for ascending
  static async getAllEvents(req, res, next) {
    // let limit = 3;
    // let page = 1;
    const { page, limit, flagDate, status } = req.query;
    try {
      let statusQuery = '';
      if (status === 'draft') {
        statusQuery = 0;
      }
      if (status === 'approved') {
        statusQuery = 1;
      }
      if (status === 'done') {
        statusQuery = 2;
      }
      const options = {
        page: page || 1,
        limit: limit || 100000,
        sort: {
          type: 'updated_at',
          method: -1,
        },
      };
      const filter = {};
      if (flagDate === 'now') {
        filter.startYear = { $gte: new Date().getFullYear() };
      }

      if (status) {
        filter.status = statusQuery;
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
        .json(resHelpers.success('success fetch data', findEvents));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

module.exports = EventController;
