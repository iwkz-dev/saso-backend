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

class MenuController {
  static async getAllMenus(req, res, next) {
    const { page, limit, event, category, flagDate, status } = req.query;

    try {
      const options = {
        page: page || 1,
        limit: limit || 100000,
        sort: {
          type: 'updated_at',
          method: -1,
        },
      };

      const filter = {};
      if (flagDate === 'now' || status) {
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

        const filterEvent = {};
        if (flagDate) {
          filterEvent.startYear = { $gte: new Date().getFullYear() };
        }
        if (status) {
          filterEvent.status = statusQuery;
        }
        const findEvent = await Event.findOne(filterEvent);
        filter.event = findEvent._id;
      }
      if (event) {
        filter.event = event;
      }
      if (category) {
        filter.category = category;
      }

      const findMenu = await dataPagination(Menu, filter, null, options);
      res
        .status(httpStatus.StatusCodes.OK)
        .json(resHelpers.success('success fetch data', findMenu));
    } catch (error) {
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
