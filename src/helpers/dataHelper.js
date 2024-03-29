'use strict';

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
  dataPagination: async (model, filter, select, query) => {
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

    const findData = await model.find(filter, null, options).select(select);

    const countData = await model.countDocuments(filter);
    const getPagination = await onPagination(countData, options.limit, page);

    const result = {
      pagination: getPagination,
      data: findData,
    };
    return result;
  },

  detailById: async (model, id, selected) => {
    const findDetail = await model.findById(id).select(selected);
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

  updateWithImages: async (options) => {
    const { imagesData, bodyETags, dataFound } = options;

    const imagesSaved = [...imagesData];
    let eTags;
    const imagesNotSaved = [];

    if (bodyETags) {
      if (typeof bodyETags === 'string') {
        eTags = [bodyETags];
      } else {
        eTags = [...bodyETags];
      }
      let saved = [];
      let notSaved = [];

      saved = dataFound.images.filter((image) => eTags.includes(image.eTag));
      notSaved = dataFound.images.filter(
        (image) => !eTags.includes(image.eTag)
      );

      if (saved.length > 0) {
        saved.forEach((el) => {
          imagesSaved.push(el);
        });
      }
      if (notSaved.length > 0) {
        notSaved.forEach((el) => {
          imagesNotSaved.push(el);
        });
      }
    }
    if (!bodyETags) {
      dataFound.images.forEach((image) => {
        imagesNotSaved.push(image);
      });
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
