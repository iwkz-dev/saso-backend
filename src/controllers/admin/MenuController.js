"use strict";

const httpStatus = require("http-status-codes");
const Menu = require("@models/menu");
const Event = require("@models/event");
const resHelpers = require("@helpers/responseHelpers");
const { dataPagination } = require("@helpers/dataHelper");

class MenuController {
  // TO DO: update menu, get specific menu based on name, delete specific menu, delete all menu
  // belum ada image
  static async create(req, res, next) {
    const payload = {
      name: req.body.name,
      description: req.body.description,
      quantity: +req.body.quantity,
      price: +req.body.price,
      category: req.body.category,
      event: req.body.event || null,
      updated_at: new Date(),
      created_at: new Date(),
    };
    console.log(payload);
    try {
      const createMenu = await Menu.create(payload);
      res
        .status(httpStatus.StatusCodes.CREATED)
        .json(resHelpers.success("success create an menu", createMenu));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async getAllMenus(req, res, next) {
    const { page, limit, event, category, date } = req.query;

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
      if (date === "now") {
        const findEvent = await Event.findOne({
          started_at: { $gte: new Date() },
        });

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
        .json(resHelpers.success("success fetch data", findMenu));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async getMenuById(req, res, next) {
    const { id } = req.params;
    try {
      const findMenu = await Menu.findById(id);
      if (!findMenu) {
        throw { name: "Not Found", message: "Menu not found" };
      }
      res
        .status(httpStatus.StatusCodes.OK)
        .json(resHelpers.success("success fetch data", findMenu));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async destroy(req, res, next) {
    const { id } = req.params;

    try {
      const deletedMenu = await Menu.findOneAndDelete({ _id: id });
      if (!deletedMenu) {
        throw { name: "Not Found", message: "Menu not found" };
      }
      res
        .status(httpStatus.StatusCodes.OK)
        .json(resHelpers.success("success delete data", deletedMenu));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async update(req, res, next) {
    const { id } = req.params;
    const payload = {
      name: req.body.name,
      description: req.body.description,
      price: +req.body.price,
      category: req.body.category,
      event: req.body.event || null,
      updated_at: new Date(),
    };
    try {
      const updatedMenu = await Menu.findOneAndUpdate({ _id: id }, payload, {
        new: true,
      });
      if (!updatedMenu) {
        throw { name: "Not Found", message: "Menu not found" };
      }
      res
        .status(httpStatus.StatusCodes.OK)
        .json(resHelpers.success("success update data", updatedMenu));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async addQuantity(req, res, next) {
    const { id } = req.params;
    try {
      const findMenu = await Menu.findById(id);

      if (!findMenu) {
        throw { name: "Not Found", message: "Menu not found" };
      }
      const totalQuantity = findMenu.quantity + +req.body.quantity;
      const payload = {
        quantity: totalQuantity,
        updated_at: new Date(),
      };
      const updatedMenu = await Menu.findOneAndUpdate({ _id: id }, payload, {
        new: true,
      });
      res
        .status(httpStatus.StatusCodes.OK)
        .json(resHelpers.success("success add quantity menu", updatedMenu));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async subsQuantity(req, res, next) {
    const { id } = req.params;
    try {
      const findMenu = await Menu.findById(id);

      if (!findMenu) {
        throw { name: "Not Found", message: "Menu not found" };
      }
      const totalQuantity = findMenu.quantity - +req.body.quantity;
      const payload = {
        quantity: totalQuantity,
        updated_at: new Date(),
      };
      const updatedMenu = await Menu.findOneAndUpdate({ _id: id }, payload, {
        new: true,
      });
      res
        .status(httpStatus.StatusCodes.OK)
        .json(resHelpers.success("success add quantity menu", updatedMenu));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

module.exports = MenuController;
