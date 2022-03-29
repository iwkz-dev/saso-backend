"use strict";

async function pagination(count, limit, page) {
  const totalPage = Math.ceil(count / limit);
  const pagination = {
    maxPage: totalPage,
    currentPage: page,
    limit: limit,
    count: count,
  };
  return pagination;
}

module.exports = {
  dataPagination: async (model, filter, select, query) => {
    let page = query.page ? parseInt(query.page) : 1;
    let limit = query.limit ? parseInt(query.limit) : null;
    let options = {
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
    const getPagination = await pagination(countData, options.limit, page);

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

  updateWithImages: async (options) => {
    const { imagesData, bodyETags, dataFound } = options;

    let imagesSaved = [...imagesData];
    let eTags;
    let imagesNotSaved = [];

    if (bodyETags) {
      if (typeof bodyETags === "string") {
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
};
