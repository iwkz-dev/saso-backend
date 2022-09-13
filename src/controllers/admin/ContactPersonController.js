"use strict";

const httpStatus = require("http-status-codes");
const ContactPerson = require("@models/contactPerson");
const resHelpers = require("@helpers/responseHelpers");
const { dataPagination, firstWordUppercase } = require("@helpers/dataHelper");

class ContactPersonController {
  static async create(req, res, next) {
    const name = await firstWordUppercase(req.body.name);

    let payload = {
      name,
      phoneNumber: req.body.phoneNumber,
      type: req.body.type || 0,
      event: req.body.event || null,
      updated_at: new Date(),
      created_at: new Date(),
    };

    try {
      const createContactPerson = await ContactPerson.create(payload);

      res
        .status(httpStatus.StatusCodes.CREATED)
        .json(
          resHelpers.success(
            "success create an contact person",
            createContactPerson
          )
        );
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async getAllContactPersons(req, res, next) {
    const { page, limit, event, type, sort } = req.query;

    try {
      const options = {
        page: page || 1,
        limit: limit || 100000,
        sort: {
          type: "updated_at",
          method: -1,
        },
      };

      let method;
      if (sort) {
        let splittedSort = sort.split(":");
        if (splittedSort[1] === "desc") {
          method = -1;
        }
        if (splittedSort[1] === "asc") {
          method = 1;
        }
        options.sort = {
          type: splittedSort[0],
          method,
        };
      }

      let filter = {};
      if (event) {
        filter.event = event;
      }
      if (type) {
        filter.type = type;
      }

      const findContactPersons = await dataPagination(
        ContactPerson,
        filter,
        null,
        options
      );

      res
        .status(httpStatus.StatusCodes.OK)
        .json(resHelpers.success("success fetch data", findContactPersons));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
  static async destroy(req, res, next) {
    const { id } = req.params;
    try {
      const deletedContactPerson = await ContactPerson.findOneAndDelete({
        _id: id,
      });
      if (!deletedContactPerson) {
        throw { name: "Not Found", message: "Contact Person not found" };
      }
      res
        .status(httpStatus.StatusCodes.OK)
        .json(resHelpers.success("success delete data", deletedContactPerson));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
  static async update(req, res, next) {
    const { id } = req.params;
    const name = await firstWordUppercase(req.body.name);

    let payload = {
      name,
      phoneNumber: req.body.phoneNumber,
      type: req.body.type || 0,
      event: req.body.event || null,
      updated_at: new Date(),
    };
    try {
      const updatedContactPerson = await ContactPerson.findOneAndUpdate(
        { _id: id },
        payload,
        {
          new: true,
        }
      );

      if (!updatedContactPerson) {
        throw { name: "Not Found", message: "Contact Person not found" };
      }

      res
        .status(httpStatus.StatusCodes.OK)
        .json(resHelpers.success("success update data", updatedContactPerson));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

module.exports = ContactPersonController;
