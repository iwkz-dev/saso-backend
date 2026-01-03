'use strict';

const mongoose = require('mongoose');
const httpStatus = require('http-status-codes');
const ContactPerson = require('@models/contactPerson');
const resHelpers = require('@helpers/responseHelpers');
const {
  dataPagination,
  detailById,
  firstWordUppercase,
} = require('@helpers/dataHelper');

class ContactPersonController {
  static async create(req, res, next) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const name = await firstWordUppercase(req.body.name);
      const payload = {
        name,
        phoneNumber: req.body.phoneNumber,
        event: req.body.event || null,
        updated_at: new Date(),
        created_at: new Date(),
      };

      const createContactPerson = await ContactPerson.create([payload], {
        session,
      });

      await session.commitTransaction();
      session.endSession();

      res.status(httpStatus.StatusCodes.CREATED).json(
        resHelpers.success(
          'Successfully created a contact person',
          createContactPerson[0] // Since create returns an array when using session
        )
      );
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.log(error);
      next(error);
    }
  }

  static async getAllContactPersons(req, res, next) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const { page, limit, event, type, sort } = req.query;

      const options = {
        page: page || 1,
        limit: limit || 100000,
        sort: {
          updated_at: -1,
        },
      };

      if (sort) {
        const [sortField, sortOrder] = sort.split(':');
        options.sort = {
          [sortField]: sortOrder === 'asc' ? 1 : -1,
        };
      }

      const filter = {};
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
        options,
        session
      );

      await session.commitTransaction();
      session.endSession();

      res
        .status(httpStatus.StatusCodes.OK)
        .json(
          resHelpers.success('Successfully fetched data', findContactPersons)
        );
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.log(error);
      next(error);
    }
  }

  static async getContactPersonById(req, res, next) {
    const { id } = req.params;
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const findContactPerson = await ContactPerson.findById(id)
        .populate('event')
        .session(session);
      if (!findContactPerson) {
        throw { name: 'Not Found', message: 'Contact Person not found' };
      }

      await session.commitTransaction();
      session.endSession();

      res
        .status(httpStatus.StatusCodes.OK)
        .json(
          resHelpers.success('Successfully fetched data', findContactPerson)
        );
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.log(error);
      next(error);
    }
  }

  static async destroy(req, res, next) {
    const { id } = req.params;
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const deletedContactPerson = await ContactPerson.findOneAndDelete(
        { _id: id },
        { session }
      );
      if (!deletedContactPerson) {
        throw { name: 'Not Found', message: 'Contact Person not found' };
      }

      await session.commitTransaction();
      session.endSession();

      res
        .status(httpStatus.StatusCodes.OK)
        .json(
          resHelpers.success('Successfully deleted data', deletedContactPerson)
        );
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.log(error);
      next(error);
    }
  }

  static async update(req, res, next) {
    const { id } = req.params;
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const name = await firstWordUppercase(req.body.name);
      const payload = {
        name,
        phoneNumber: req.body.phoneNumber,
        type: req.body.type || 0,
        event: req.body.event || null,
        updated_at: new Date(),
      };

      const updatedContactPerson = await ContactPerson.findOneAndUpdate(
        { _id: id },
        payload,
        { new: true, session }
      );

      if (!updatedContactPerson) {
        throw { name: 'Not Found', message: 'Contact Person not found' };
      }

      await session.commitTransaction();
      session.endSession();

      res
        .status(httpStatus.StatusCodes.OK)
        .json(
          resHelpers.success('Successfully updated data', updatedContactPerson)
        );
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.log(error);
      next(error);
    }
  }
}

module.exports = ContactPersonController;
