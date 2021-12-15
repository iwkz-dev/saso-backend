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

    const countData = await model.countDocuments();
    const getPagination = await pagination(countData, options.limit, page);

    const result = {
      pagination: getPagination,
      data: findData,
    };
    return result;
  },
};
