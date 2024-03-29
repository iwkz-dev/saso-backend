'use strict';

const Image = require('@models/image');
const axios = require('axios');

module.exports = {
  bulkUpload: async (payload, id, type) => {
    try {
      payload.forEach((el) => {
        el.type = type;
        el.parent_uid = id;
        el.updated_at = new Date();
        el.created_at = new Date();
      });
      await Image.insertMany(payload);
    } catch (error) {
      console.log(error);
      throw { name: 'Failed upload', message: 'Failed upload images' };
    }
  },
  deleteImages: async (data) => {
    const fileIdImages = [];
    if (data.length > 0) {
      data.forEach(async (el) => {
        fileIdImages.push(el.eTag);
        await Image.findOneAndDelete({
          eTag: el.eTag,
        });
      });
      const encodePrivateKey = Buffer.from(
        `${process.env.IMGKIT_PRIVATE_KEY}:`,
        'utf-8'
      ).toString('base64');

      await axios.post(
        'https://api.imagekit.io/v1/files/batch/deleteByFileIds',
        { fileIds: fileIdImages },
        {
          headers: {
            Authorization: `Basic ${encodePrivateKey}`,
          },
        }
      );
    }
  },
  deleteImage: async (model, eTag) => {
    const fileIdImages = [eTag];
    // if (data.images.length > 0) {

    const imageFound = await Image.findOne({
      eTag,
    });
    if (!imageFound || imageFound.type !== model) {
      throw { name: 'Not Found', message: 'Image not found' };
    }
    await Image.deleteOne({
      eTag,
    });
    const encodePrivateKey = Buffer.from(
      `${process.env.IMGKIT_PRIVATE_KEY}:`,
      'utf-8'
    ).toString('base64');

    await axios.post(
      'https://api.imagekit.io/v1/files/batch/deleteByFileIds',
      { fileIds: fileIdImages },
      {
        headers: {
          Authorization: `Basic ${encodePrivateKey}`,
        },
      }
    );
  },
};
