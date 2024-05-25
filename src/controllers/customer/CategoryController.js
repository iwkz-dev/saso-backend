'use strict';

const mongoose = require('mongoose');
const httpStatus = require('http-status-codes');
const Category = require('@models/category');
const Menu = require('@models/menu');
const Event = require('@models/event');
const resHelpers = require('@helpers/responseHelpers');
const { dataPagination } = require('@helpers/dataHelper');

class CategoryController {
  static async getAllCategories(req, res, next) {
    const { page, limit, flagDate, status, event } = req.query;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const options = {
        page: page || 1,
        limit: limit || 100000,
        sort: { updated_at: -1 },
      };

      const categories = await Category.find().session(session);

      const result = await Promise.all(
        categories.map(async (el) => {
          const filter = { category: el._id };
          if (event) {
            filter.event = event;
          }
          if (flagDate === 'now' || status) {
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

            const filterEvent = {};
            if (flagDate) {
              filterEvent.startYear = { $gte: new Date().getFullYear() };
            }
            if (statusQuery !== undefined) {
              filterEvent.status = statusQuery;
            }

            const findEvent = await Event.findOne(filterEvent).session(session);
            if (findEvent) {
              filter.event = findEvent._id;
            }
          }

          const foundMenu = await dataPagination(
            Menu,
            filter,
            null,
            options,
            session
          );
          return { _id: el._id, name: el.name, menus: foundMenu };
        })
      );

      await session.commitTransaction();
      session.endSession();

      res
        .status(httpStatus.StatusCodes.OK)
        .json(resHelpers.success('success fetch data', result));
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.log(error);
      next(error);
    }
  }
}

module.exports = CategoryController;
