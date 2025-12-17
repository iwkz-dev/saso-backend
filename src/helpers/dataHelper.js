'use strict';

const mongoose = require('mongoose');

async function onPagination(count, limit, page) {
  const totalPage = Math.ceil(count / limit);
  const pagination = {
    maxPage: totalPage,
    currentPage: page,
    limit,
    count,
  };
  return pagination;
}

module.exports = {
  dataPagination: async (model, filter, select, query, session) => {
    const page = query.page ? parseInt(query.page, 10) : 1;
    const limit = query.limit ? parseInt(query.limit, 10) : null;
    const options = {
      limit: limit * 1,
      skip: (page - 1) * limit,
      sort: null,
    };
    if (query.sort) {
      options.sort = {
        [query.sort.type]: query.sort.method,
      };
    }

    const findData = await model
      .find(filter, null, options)
      .select(select)
      .session(session);

    const countData = await model.countDocuments(filter);
    const getPagination = await onPagination(countData, options.limit, page);

    const result = {
      pagination: getPagination,
      data: findData,
    };
    return result;
  },

  detailById: async (model, id, selected) => {
    if (!mongoose.isValidObjectId(id)) {
      throw { name: 'Bad Request', message: 'Invalid ID format' };
    }

    const findDetail = await model
      .findOne({ _id: new mongoose.Types.ObjectId(id) })
      .select(selected);

    return findDetail;
  },

  detailByBarcode: async (model, barcode, selected) => {
    const findDetail = await model
      .find({
        barcode,
      })
      .select(selected);
    return findDetail;
  },

  updateWithImages: async ({ imagesData, bodyETags, dataFound }) => {
    const imagesSaved = [...imagesData];
    const imagesNotSaved = [];

    let eTags = [];
    if (bodyETags) {
      if (Array.isArray(bodyETags)) {
        eTags = bodyETags;
      } else {
        eTags = [bodyETags];
      }
    }

    if (eTags.length > 0) {
      const saved = dataFound.images.filter((image) =>
        eTags.includes(image.eTag)
      );
      const notSaved = dataFound.images.filter(
        (image) => !eTags.includes(image.eTag)
      );

      // Add saved to the beginning of the array
      imagesSaved.unshift(...saved);
      imagesNotSaved.push(...notSaved);
    } else {
      imagesNotSaved.push(...dataFound.images);
    }

    return { imagesSaved, imagesNotSaved };
  },

  firstWordUppercase: async (words) => {
    if (!words || words.length < 0) {
      return '';
    }
    const wordsArray = words.split(' ');

    for (let i = 0; i < wordsArray.length; i++) {
      wordsArray[i] =
        wordsArray[i].charAt(0).toUpperCase() + wordsArray[i].slice(1);
    }

    const newStr = wordsArray.join(' ');
    return newStr;
  },
};
