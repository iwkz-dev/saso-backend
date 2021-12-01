"use strict";

const httpStatus = require("http-status-codes");
const Menu = require("@models/menu");
const resUtils = require("@utils/responseUtils");

class MenuController {
  // ! BELOM ADA AUTHENTICATION BISA JADI REFERENSI BUAT BELAJAR
  // TO DO: update menu, get specific menu based on name, delete specific menu, delete all menu
  // belum ada image
  static async create(req, res, next) {
    const payload = {
      name: req.body.name,
      description: req.body.description,
      quantity: req.body.quantity,
      price: req.body.price,
      category: req.body.category,
      updated_at: new Date(),
      created_at: new Date(),
    };
    try {
      const createMenu = await Menu.create(payload);
      console.log(payload);
      res
        .status(httpStatus.StatusCodes.CREATED)
        .json(resUtils.success("success create an menu", createMenu));
    } catch (error) {
      console.log(error);
      res
        .status(httpStatus.StatusCodes.BAD_REQUEST)
        .json(resUtils.failed(error.message, error));
    }
  }

  static async getAllMenus(req, res, next) {
    try {
      const findMenu = await Menu.find();
      res
        .status(httpStatus.StatusCodes.OK)
        .json(resUtils.success("success fetch data", findMenu));
    } catch (error) {
      console.log(error);
      res
        .status(httpStatus.StatusCodes.BAD_REQUEST)
        .json(resUtils.failed(error.message, error));
    }
  }
}

module.exports = MenuController;
