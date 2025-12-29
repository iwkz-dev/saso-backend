'use strict';

const axios = require('axios');
const FormData = require('form-data');

function formatDatePrefix() {
  const date = new Date();
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${year}${month}${day}_`;
}

function isValidImage(file) {
  const allowedTypes = ['jpg', 'jpeg', 'png'];
  const fileType = file.originalname.split('.').pop().toLowerCase();
  return allowedTypes.includes(fileType) && file.size < 12 * 1024 * 1024;
}

async function uploadToImageKit(file) {
  const encodedKey = Buffer.from(
    `${process.env.IMGKIT_PRIVATE_KEY}:`,
    'utf-8'
  ).toString('base64');
  const formData = new FormData();
  const fileName = formatDatePrefix() + file.originalname;

  formData.append('file', file.buffer.toString('base64'));
  formData.append('fileName', fileName);
  formData.append('folder', '/SASO/');

  const response = await axios.post(
    'https://upload.imagekit.io/api/v1/files/upload',
    formData,
    {
      headers: {
        ...formData.getHeaders(),
        Authorization: `Basic ${encodedKey}`,
      },
    }
  );

  return {
    imageUrl: response.data.url,
    eTag: response.data.fileId,
    fileName: response.data.name,
  };
}

async function imgKitUploadMulti(req, _, next) {
  try {
    const files = req.files || [];
    if (files.length === 0) {
      req.body.imagesData = null;
      return next();
    }

    const uploads = await Promise.all(
      files.map((file) => {
        if (!isValidImage(file)) {
          throw {
            name: 'Bad Request',
            message: 'Invalid file type or size exceeds 12MB',
          };
        }
        return uploadToImageKit(file);
      })
    );

    req.body.imagesData = uploads;
    next();
  } catch (err) {
    console.error(err);
    next(err);
  }
}

module.exports = { imgKitUploadMulti };
