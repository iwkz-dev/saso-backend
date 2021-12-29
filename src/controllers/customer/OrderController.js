"use strict";

const httpStatus = require("http-status-codes");
const Order = require("@models/order");
const Menu = require("@models/menu");
const resHelpers = require("@helpers/responseHelpers");
const { dataPagination } = require("@helpers/dataHelper");

class UserController {
  static async order(req, res, next) {
    const { menus } = req.body;
    try {
      //   ! LATER: WILL BE AUTOMATED SS21
      const countData = await Order.countDocuments();
      let invoiceNumber = "SS21-";
      if (countData < 10) {
        invoiceNumber += `00${countData + 1}`;
      } else if (countData < 100) {
        invoiceNumber += `0${countData + 1}`;
      }

      const findMenu = await Promise.all(
        menus.map(async (el) => {
          const foundMenu = await Menu.findOne({ _id: el._id })
            .select(["-updated_at", "-created_at", "-description", "-quantity"])
            .lean();
          foundMenu["totalPortion"] = el.totalPortion;
          return foundMenu;
        })
      );

      const totalEachMenu = findMenu.map((el) => {
        return el.price * el.totalPortion;
      });

      let totalPrice = 0;
      totalEachMenu.forEach((el) => {
        totalPrice += el;
      });
      const payload = {
        invoiceNumber,
        menus: findMenu,
        totalPrice,
        status: 0,
        updated_at: new Date(),
        created_at: new Date(),
      };

      const createOrder = await Order.create(payload);

      res
        .status(httpStatus.StatusCodes.CREATED)
        .json(resHelpers.success("success create an order", createOrder));
      console.log(invoiceNumber);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

module.exports = UserController;
