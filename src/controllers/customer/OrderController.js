"use strict";

const httpStatus = require("http-status-codes");
const Order = require("@models/order");
const Menu = require("@models/menu");
const resHelpers = require("@helpers/responseHelpers");
const { dataPagination } = require("@helpers/dataHelper");

class UserController {
  static async order(req, res, next) {
    const { menus } = req.body;
    const { id: userId } = req.user;
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
            .select(["-updated_at", "-created_at", "-description"])
            .lean();

          if (el.totalPortion < 0 || !el.totalPortion) {
            throw {
              name: "Bad Request",
              message: `Portion should be greater 0`,
            };
          }
          if (foundMenu.quantity < 1) {
            throw {
              name: "Bad Request",
              message: `Menu '${foundMenu.name}' is out of stock`,
            };
          }
          const quantityFound = foundMenu.quantity;
          foundMenu["totalPortion"] = el.totalPortion;
          delete foundMenu.quantity;
          const payloadMenu = {
            quantity: quantityFound - el.totalPortion,
          };
          await Menu.findOneAndUpdate({ _id: el._id }, payloadMenu);
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
        customer: userId,
        updated_at: new Date(),
        created_at: new Date(),
      };

      const createOrder = await Order.create(payload);

      res
        .status(httpStatus.StatusCodes.CREATED)
        .json(resHelpers.success("success create an order", createOrder));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async getAllOrders(req, res, next) {
    const { id: userId } = req.user;
    const { page, limit } = req.query;
    try {
      const options = {
        page: page || 1,
        limit: limit || 100000,
        sort: {
          type: "updated_at",
          method: -1,
        },
      };
      let filter = {
        customer: userId,
      };
      const findOrdersById = await dataPagination(Order, filter, null, options);
      res
        .status(httpStatus.StatusCodes.OK)
        .json(resHelpers.success("success fetch data", findOrdersById));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async getOrderById(req, res, next) {
    const { id: userId } = req.user;
    const { id: orderId } = req.params;

    try {
      const findOrder = await Order.findById({ _id: orderId });
      console.log(userId, findOrder.customer);
      if (userId !== findOrder.customer.toString()) {
        throw {
          name: "Forbidden",
          message: "You have no authorization to look this order",
        };
      }
      res
        .status(httpStatus.StatusCodes.OK)
        .json(resHelpers.success("success fetch data", findOrder));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

module.exports = UserController;
