'use strict';

const httpStatus = require('http-status-codes');
const mongoose = require('mongoose');
const Menu = require('@models/menu');
const Vendor = require('@models/menu');

const readXlsxFile = require('read-excel-file/node');
const Event = require('@models/event');
const Category = require('@models/category');
const resHelpers = require('@helpers/responseHelpers');
const { bulkUpload, deleteImages, deleteImage } = require('@helpers/images');
const {
  dataPagination,
  detailById,
  updateWithImages,
  firstWordUppercase,
  escapeRegex,
  normalizeName,
} = require('@helpers/dataHelper');

class MenuController {
  // TO DO: update menu, get specific menu based on name, delete specific menu, delete all menu
  // belum ada image
  static async create(req, res, next) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const name = await firstWordUppercase(req.body.name);

      const payload = {
        name,
        barcode: req.body.barcode ?? '',
        description: req.body.description,
        note: req.body.note || '',
        quantity: +req.body.quantity,
        quantityOrder: +req.body.quantityOrder || 0,
        price: +req.body.price,
        category: req.body.category,
        vendor: req.body.vendor,
        images: req.body.imagesData || [],
        event: req.body.event || null,
        updated_at: new Date(),
        created_at: new Date(),
      };

      const createMenu = await Menu.create([payload], { session }); // Pass session here

      if (req.body.imagesData) {
        await bulkUpload(req.body.imagesData, createMenu[0]._id, 'menu'); // Pass session here
      }

      await session.commitTransaction();
      session.endSession();

      res
        .status(httpStatus.StatusCodes.CREATED)
        .json(resHelpers.success('success create a menu', createMenu[0]));
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error(error);
      next(error);
    }
  }

  static async getAllMenus(req, res, next) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const {
        page = 1,
        limit = 100000,
        name,
        event,
        category,
        vendor,
        flagDate,
        status,
        sort,
      } = req.query;

      const options = {
        page: Number(page),
        limit: Number(limit),
        sort: {
          type: 'created_at',
          method: -1,
        },
      };

      if (sort) {
        const [field, direction] = sort.split(':');
        options.sort = {
          type: field,
          method: direction === 'asc' ? 1 : -1,
        };
      }

      const filter = {};

      if (name) {
        filter.name = { $regex: escapeRegex(name), $options: 'i' };
      }

      if (category) {
        filter.category = category;
      }

      if (vendor) {
        filter.vendor = vendor;
      }

      if (event) {
        filter.event = event;
      } else if (flagDate === 'now' || status) {
        const statusMap = {
          draft: 0,
          approved: 1,
          done: 2,
        };

        const eventFilter = {};

        if (flagDate === 'now') {
          eventFilter.startYear = { $gte: new Date().getFullYear() };
        }

        if (status) {
          eventFilter.status = statusMap[status];
        }

        const foundEvent = await Event.findOne(eventFilter).session(session);
        filter.event = foundEvent ? foundEvent._id : null;
      }

      const menus = await dataPagination(Menu, filter, null, options, session);

      await session.commitTransaction();
      res
        .status(httpStatus.StatusCodes.OK)
        .json(resHelpers.success('success fetch data', menus));
    } catch (error) {
      console.error(error);
      next(error);
    } finally {
      session.endSession();
    }
  }

  static async createMenus(req, res, next) {
    const { event, menus } = req.body;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      if (!event) throw new Error('Event is required');
      if (!Array.isArray(menus) || menus.length === 0)
        throw new Error('Menus must be a non-empty array');

      // Collect unique category and vendor names
      const categoryNames = [
        ...new Set(menus.map((m) => normalizeName(m.category)).filter(Boolean)),
      ];
      const vendorNames = [
        ...new Set(menus.map((m) => normalizeName(m.vendor)).filter(Boolean)),
      ];

      const categories = await Category.find(
        { name: { $in: categoryNames } },
        { name: 1 }
      ).session(session);
      const vendors = await Vendor.find(
        { name: { $in: vendorNames } },
        { name: 1 }
      ).session(session);

      const categoryMap = categories.reduce((acc, c) => {
        acc[normalizeName(c.name)] = c._id;
        return acc;
      }, {});
      const vendorMap = vendors.reduce((acc, v) => {
        acc[normalizeName(v.name)] = v._id;
        return acc;
      }, {});

      const existingMenus = await Menu.find({ event }, { name: 1 }).session(
        session
      );
      const existingNames = new Set(
        existingMenus.map((m) => normalizeName(m.name))
      );

      const duplicates = [];
      const payloads = [];

      // Prepare all async name transformations in parallel
      const namePromises = menus.map((item) => firstWordUppercase(item.name));
      const names = await Promise.all(namePromises);

      for (let i = 0; i < menus.length; i++) {
        const item = menus[i];

        if (!item.name) throw new Error(`Row ${i + 1}: name is required`);
        if (item.price === undefined || item.price === null)
          throw new Error(`Row ${i + 1}: price is required`);
        if (item.quantity === undefined || item.quantity === null)
          throw new Error(`Row ${i + 1}: quantity is required`);

        const name = names[i];
        const normalizedName = normalizeName(name);

        // Check for duplication in the same event
        if (existingNames.has(normalizedName)) {
          duplicates.push(name);
        } else {
          existingNames.add(normalizedName); // mark as used

          const categoryId = item.category
            ? categoryMap[normalizeName(item.category)]
            : null;
          if (item.category && !categoryId)
            throw new Error(
              `Row ${i + 1}: category "${item.category}" not found`
            );

          const vendorId = item.vendor
            ? vendorMap[normalizeName(item.vendor)]
            : null;
          if (item.vendor && !vendorId)
            throw new Error(`Row ${i + 1}: vendor "${item.vendor}" not found`);

          payloads.push({
            name,
            description: item.description || '',
            note: item.note || '',
            quantity: +item.quantity,
            quantityOrder: 0,
            price: +item.price,
            category: categoryId,
            vendor: vendorId,
            images: [],
            event,
            updated_at: new Date(),
            created_at: new Date(),
          });
        }
      }

      // Insert new menus
      const createdMenus = await Menu.insertMany(payloads, {
        session,
        ordered: true,
      });

      await session.commitTransaction();

      res.status(httpStatus.StatusCodes.CREATED).json(
        resHelpers.success('success create multiple menus', {
          count: createdMenus.length,
          data: createdMenus,
          duplicates, // return skipped duplicates for info
        })
      );
    } catch (error) {
      await session.abortTransaction();
      console.error(error);
      next(error);
    } finally {
      session.endSession();
    }
  }

  static async getMenuById(req, res, next) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { id } = req.params;
      const findMenu = await detailById(Menu, id, null);

      if (!findMenu) {
        throw { name: 'Not Found', message: 'Menu not found' };
      }

      await session.commitTransaction();
      session.endSession();

      res
        .status(httpStatus.StatusCodes.OK)
        .json(resHelpers.success('success fetch data', findMenu));
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error(error);
      next(error);
    }
  }

  static async destroy(req, res, next) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { id } = req.params;

      const deletedMenu = await Menu.findOneAndDelete({ _id: id }).session(
        session
      );
      if (!deletedMenu) {
        throw { name: 'Not Found', message: 'Menu not found' };
      }

      if (deletedMenu.images.length > 0) {
        await deleteImages(deletedMenu.images);
      }

      await session.commitTransaction();
      session.endSession();

      res
        .status(httpStatus.StatusCodes.OK)
        .json(resHelpers.success('success delete data', deletedMenu));
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error(error);
      next(error);
    }
  }

  static async update(req, res, next) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { id } = req.params;

      if (req.body.imageUrls) {
        const imageUrls = Array.isArray(req.body.imageUrls)
          ? req.body.imageUrls
          : [req.body.imageUrls];

        if (!Array.isArray(req.body.eTags)) {
          req.body.eTags = [];
        }

        imageUrls.forEach((imageId) => {
          req.body.eTags.push(imageId);
        });
      }

      const findMenu = await detailById(Menu, id, null);
      if (!findMenu) {
        throw { name: 'Not Found', message: 'Menu not found' };
      }

      const requestedQuantity = Number(req.body.quantity);
      if (requestedQuantity < (findMenu.quantityOrder || 0)) {
        throw {
          name: 'Bad Request',
          message: `Quantity cannot be less than already ordered quantity (${findMenu.quantityOrder})`,
        };
      }

      const options = {
        imagesData: req.body.imagesData || [],
        bodyETags: req.body.eTags,
        dataFound: findMenu,
      };

      const payloadImages = await updateWithImages(options);
      if (payloadImages.imagesSaved.length > 5) {
        await deleteImages(req.body.imagesData);
        throw { name: 'Bad Request', message: 'The limit of image is 5' };
      }
      await deleteImages(payloadImages.imagesNotSaved);

      const payload = {
        name: req.body.name,
        barcode: req.body.barcode ?? '',
        description: req.body.description,
        note: req.body.note || '',
        price: +req.body.price,
        category: req.body.category,
        vendor: req.body.vendor,
        quantity: requestedQuantity,
        event: req.body.event || null,
        images: payloadImages.imagesSaved,
        updated_at: new Date(),
      };

      const updatedMenu = await Menu.findOneAndUpdate({ _id: id }, payload, {
        new: true,
        session,
      });

      if (!updatedMenu) {
        throw { name: 'Not Found', message: 'Menu not found' };
      }

      if (req.body.imagesData) {
        await bulkUpload(req.body.imagesData, findMenu._id, 'menu');
      }

      await session.commitTransaction();
      session.endSession();

      res
        .status(httpStatus.StatusCodes.OK)
        .json(resHelpers.success('success update data', updatedMenu));
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error(error);
      next(error);
    }
  }

  static async addQuantity(req, res, next) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { id } = req.params;
      const findMenu = await Menu.findById(id).session(session);

      if (!findMenu) {
        throw { name: 'Not Found', message: 'Menu not found' };
      }
      const totalQuantity = findMenu.quantity + +req.body.quantity;
      const payload = {
        quantity: totalQuantity,
        updated_at: new Date(),
      };
      const updatedMenu = await Menu.findOneAndUpdate({ _id: id }, payload, {
        new: true,
        session,
      });

      await session.commitTransaction();
      session.endSession();

      res
        .status(httpStatus.StatusCodes.OK)
        .json(resHelpers.success('success add quantity menu', updatedMenu));
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error(error);
      next(error);
    }
  }

  static async subsQuantity(req, res, next) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { id } = req.params;
      const findMenu = await Menu.findById(id).session(session);

      if (!findMenu) {
        throw { name: 'Not Found', message: 'Menu not found' };
      }
      const totalQuantity = findMenu.quantity - +req.body.quantity;
      const payload = {
        quantity: totalQuantity,
        updated_at: new Date(),
      };
      const updatedMenu = await Menu.findOneAndUpdate({ _id: id }, payload, {
        new: true,
        session,
      });

      await session.commitTransaction();
      session.endSession();

      res
        .status(httpStatus.StatusCodes.OK)
        .json(
          resHelpers.success('success subtract quantity menu', updatedMenu)
        );
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error(error);
      next(error);
    }
  }

  static async uploadImages(req, res, next) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { id } = req.params;
      const findMenu = await Menu.findById(id).session(session);

      if (!findMenu) {
        throw { name: 'Not Found', message: 'Menu not found' };
      }
      if (findMenu.images.length > 4) {
        throw { name: 'Bad Request', message: 'You can only upload 5 images' };
      }

      const imagesPayload = [...findMenu.images];
      req.body.imagesData.forEach((el) => {
        imagesPayload.push(el);
      });

      const payload = {
        images: imagesPayload,
        updated_at: new Date(),
      };

      const updateMenuImages = await Menu.updateOne({ _id: id }, payload, {
        session,
      });

      if (req.body.imagesData) {
        await bulkUpload(req.body.imagesData, findMenu._id, 'menu');
      }

      await session.commitTransaction();
      session.endSession();

      res
        .status(httpStatus.StatusCodes.OK)
        .json(
          resHelpers.success('success add images to the menu', updateMenuImages)
        );
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error(error);
      next(error);
    }
  }

  static async destroyImages(req, res, next) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { id, eTag } = req.params;
      const findMenu = await Menu.findById(id).session(session);

      if (!findMenu) {
        throw { name: 'Not Found', message: 'Menu not found' };
      }

      const imagesPayload = [];

      if (findMenu.images.length > 0) {
        await deleteImage('menu', eTag);
        findMenu.images.forEach((el) => {
          if (el.eTag !== eTag) {
            imagesPayload.push(el);
          }
        });
        const payload = {
          images: imagesPayload,
          updated_at: new Date(),
        };

        const updatedMenu = await Menu.findOneAndUpdate({ _id: id }, payload, {
          new: true,
          session,
        });

        await session.commitTransaction();
        session.endSession();

        res
          .status(httpStatus.StatusCodes.CREATED)
          .json(resHelpers.success('success destroy an image', updatedMenu));
      } else {
        throw { name: 'Bad Request', message: 'Image is empty' };
      }
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error(error);
      next(error);
    }
  }

  static async bulkCreate(req, res, next) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const xlsxRead = await readXlsxFile(`./uploads/${req.file.filename}`);
      const sliceXlsx = xlsxRead.slice(1);

      const bulkPayload = await Promise.all(
        sliceXlsx.map(async (item) => {
          const findEvent = await Event.findOne({
            startYear: { $gte: new Date().getFullYear() },
          }).session(session);
          if (findEvent) {
            item.event = findEvent._id;
          } else {
            throw {
              name: 'Bad Request',
              message:
                'You have no event for this year, please create an event first',
            };
          }
          const slug = item[4].toLowerCase().replace(' ', '_');
          const findCategories = await Category.findOne({ slug }).session(
            session
          );
          if (!findCategories) {
            const categoryPayload = {
              name: item[4],
              updated_at: new Date(),
              created_at: new Date(),
            };
            const createCategory = await Category.create([categoryPayload], {
              session,
            });
            item.category = createCategory[0]._id;
          } else {
            item.category = findCategories._id;
          }
          item.name = item[0];
          item.description = item[1];
          item.note = item[2];
          item.quantity = item[3];
          item.price = item[4];
          item.quantityOrder = 0;
          item.updated_at = new Date();
          item.created_at = new Date();
          return item;
        })
      );

      const createBulkMenus = await Menu.insertMany(bulkPayload, { session });

      await session.commitTransaction();
      session.endSession();

      res
        .status(httpStatus.StatusCodes.CREATED)
        .json(resHelpers.success('success create a menu', createBulkMenus));
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error(error);
      next(error);
    }
  }
}

module.exports = MenuController;
