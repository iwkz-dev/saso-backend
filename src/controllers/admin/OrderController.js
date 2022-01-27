"use strict";

const httpStatus = require("http-status-codes");
const Order = require("@models/order");
const Menu = require("@models/menu");
const resHelpers = require("@helpers/responseHelpers");
const { dataPagination } = require("@helpers/dataHelper");

class UserController {
  static async getAllOrders(req, res, next) {
    const { page, limit, date, invoiceNumber } = req.query;
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
      if (invoiceNumber) {
        filter.invoiceNumber = { $regex: ".*" + invoiceNumber + ".*" };
      }
      const findAllOrders = await dataPagination(Order, filter, null, options);
      res
        .status(httpStatus.StatusCodes.OK)
        .json(resHelpers.success("success fetch data", findAllOrders));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async changeStatus(req, res, next) {
    const { status, id } = req.params;
    try {
      let statusPayload = 0;
      if (status === "paid") {
        statusPayload = 1;
      }
      if (status === "refund" || status === "cancel") {
        statusPayload = 2;
      }
      if (status === "done") {
        statusPayload = 3;
      }

      const updateOrder = await Order.findOneAndUpdate(
        { _id: id },
        { status: statusPayload },
        { new: true }
      );
      res
        .status(httpStatus.StatusCodes.OK)
        .json(resHelpers.success("success change status", updateOrder));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

module.exports = UserController;
