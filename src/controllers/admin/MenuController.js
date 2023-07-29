'use strict';

const httpStatus = require('http-status-codes');
const Menu = require('@models/menu');
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
} = require('@helpers/dataHelper');

class MenuController {
  // TO DO: update menu, get specific menu based on name, delete specific menu, delete all menu
  // belum ada image
  static async create(req, res, next) {
    const name = await firstWordUppercase(req.body.name);

    const payload = {
      name,
      barcode: req.body.barcode ?? '',
      description: req.body.description,
      quantity: +req.body.quantity,
      quantityOrder: +req.body.quantityOrder || 0,
      price: +req.body.price,
      category: req.body.category,
      images: req.body.imagesData,
      event: req.body.event || null,
      updated_at: new Date(),
      created_at: new Date(),
    };
    try {
      const createMenu = await Menu.create(payload);
      if (req.body.imagesData) {
        await bulkUpload(req.body.imagesData, createMenu._id, 'menu');
      }
      res
        .status(httpStatus.StatusCodes.CREATED)
        .json(resHelpers.success('success create a menu', createMenu));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async getAllMenus(req, res, next) {
    const { page, limit, event, category, flagDate, status, sort } = req.query;

    try {
      const options = {
        page: page || 1,
        limit: limit || 100000,
        sort: {
          type: 'created_at',
          method: -1,
        },
      };

      let method;
      if (sort) {
        const splittedSort = sort.split(':');
        if (splittedSort[1] === 'desc') {
          method = -1;
        }
        if (splittedSort[1] === 'asc') {
          method = 1;
        }
        options.sort = {
          type: splittedSort[0],
          method,
        };
      }

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
    const { id } = req.params;
    try {
      const findMenu = await detailById(Menu, id, null);
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

  static async destroy(req, res, next) {
    const { id } = req.params;

    try {
      const deletedMenu = await Menu.findOneAndDelete({ _id: id });
      if (!deletedMenu) {
        throw { name: 'Not Found', message: 'Menu not found' };
      }

      if (deletedMenu.images.length > 0) {
        await deleteImages(deletedMenu.images);
      }

      res
        .status(httpStatus.StatusCodes.OK)
        .json(resHelpers.success('success delete data', deletedMenu));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async update(req, res, next) {
    const { id } = req.params;

    try {
      const findMenu = await detailById(Menu, id, null);
      if (!findMenu) {
        throw { name: 'Not Found', message: `Menu not found` };
      }
      const options = {
        imagesData: req.body.imagesData,
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
        price: +req.body.price,
        category: req.body.category,
        quantity: +req.body.quantity,
        event: req.body.event || null,
        images: payloadImages.imagesSaved,
        updated_at: new Date(),
      };

      const updatedMenu = await Menu.findOneAndUpdate({ _id: id }, payload, {
        new: true,
      });

      if (!updatedMenu) {
        throw { name: 'Not Found', message: 'Menu not found' };
      }

      if (req.body.imagesData) {
        await bulkUpload(req.body.imagesData, findMenu._id, 'menu');
      }

      res
        .status(httpStatus.StatusCodes.OK)
        .json(resHelpers.success('success update data', updatedMenu));
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
        throw { name: 'Not Found', message: 'Menu not found' };
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
        .json(resHelpers.success('success add quantity menu', updatedMenu));
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
        throw { name: 'Not Found', message: 'Menu not found' };
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
        .json(
          resHelpers.success('success substract quantity menu', updatedMenu)
        );
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async uploadImages(req, res, next) {
    const { id } = req.params;
    try {
      const findMenu = await Menu.findById(id);

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

      const updateMenuImages = await Menu.update({ _id: id }, payload, {
        new: true,
      });

      if (req.body.imagesData) {
        await bulkUpload(req.body.imagesData, findMenu._id, 'menu');
      }

      res
        .status(httpStatus.StatusCodes.OK)
        .json(
          resHelpers.success('success add images to the menu', updateMenuImages)
        );
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async destroyImages(req, res, next) {
    const { id, eTag } = req.params;

    try {
      const findMenu = await Menu.findById(id);

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
        });
        res
          .status(httpStatus.StatusCodes.CREATED)
          .json(resHelpers.success('success destroy an image', updatedMenu));
      } else {
        throw { name: 'Bad Request', message: 'Image is empty' };
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async bulkCreate(req, res, next) {
    try {
      const xlsxRead = await readXlsxFile(`./uploads/${req.file.filename}`);
      const sliceXlsx = xlsxRead.slice(1);

      const bulkPayload = await Promise.all(
        sliceXlsx.map(async (item) => {
          const findEvent = await Event.findOne({
            startYear: { $gte: new Date().getFullYear() },
          });
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
          const findCategories = await Category.findOne({ slug });
          if (!findCategories) {
            const categoryPayload = {
              name: item[4],
              updated_at: new Date(),
              created_at: new Date(),
            };
            const createCategory = await Category.create(categoryPayload);
            item.category = createCategory._id;
          } else {
            item.category = findCategories._id;
          }
          item.name = item[0];
          item.description = item[1];
          item.quantity = item[2];
          item.price = item[3];
          item.quantityOrder = 0;
          item.updated_at = new Date();
          item.created_at = new Date();
          return item;
        })
      );

      const createBulkMenus = await Menu.insertMany(bulkPayload);
      res
        .status(httpStatus.StatusCodes.CREATED)
        .json(resHelpers.success('success create a menu', createBulkMenus));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

module.exports = MenuController;
