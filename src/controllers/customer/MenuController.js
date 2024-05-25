'use strict';

const httpStatus = require('http-status-codes');
const Menu = require('@models/menu');
const Event = require('@models/event');
const resHelpers = require('@helpers/responseHelpers');
const {
  dataPagination,
  detailById,
  detailByBarcode,
} = require('@helpers/dataHelper');
const mongoose = require('mongoose');

class MenuController {
  static LIMIT = 100000;

  static async getAllMenus(req, res, next) {
    const { page, limit, event, category, flagDate, status } = req.query;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const options = {
        page: page || 1,
        limit: limit || this.LIMIT,
        sort: {
          updated_at: -1,
        },
      };

      const filter = {};
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
      if (event) {
        filter.event = event;
      }
      if (category) {
        filter.category = category;
      }

      const findMenu = await dataPagination(
        Menu,
        filter,
        null,
        options,
        session
      );
      await session.commitTransaction();
      session.endSession();

      res
        .status(httpStatus.StatusCodes.OK)
        .json(resHelpers.success('success fetch data', findMenu));
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.log(error);
      next(error);
    }
  }

  static async getMenuById(req, res, next) {
    const { id: menuId } = req.params;

    try {
      const findMenu = await detailById(Menu, menuId, null);
      if (!findMenu) {
        throw { name: 'Not Found', message: 'Menu not found' };
      }
      res
        .status(httpStatus.StatusCodes.OK)
        .json(resHelpers.success('success fetch data', findMenu));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async getMenuByBarcode(req, res, next) {
    const { barcode } = req.params;

    try {
      const findMenu = await detailByBarcode(Menu, barcode, null);
      if (findMenu.length <= 0) {
        throw {
          name: 'Not Found',
          message: `Menu with barcode '${barcode}' is not found`,
        };
      }
      res
        .status(httpStatus.StatusCodes.OK)
        .json(resHelpers.success('success fetch data', findMenu));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

module.exports = MenuController;
