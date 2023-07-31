'use strict';

const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });

module.exports = {
  uploadArray: (name, count) => upload.array(name, count),

  uploadSingle: (name) => upload.single(name),

  uploadFileXls: (name) => {
    const excelFilter = (req, file, cb) => {
      if (
        file.mimetype.includes('excel') ||
        file.mimetype.includes('spreadsheetml')
      ) {
        cb(null, true);
      } else {
        cb('Please upload only excel file.', false);
      }
    };
    const storageInDisk = multer.diskStorage({
      destination(req, file, cb) {
        cb(null, './uploads/');
      },
      filename(req, file, cb) {
        const dateTimeStamp = Date.now();
        cb(null, `${dateTimeStamp}-${file.originalname}`);
      },
    });

    const uploadFile = multer({
      storage: storageInDisk,
      fileFilter: excelFilter,
    });

    return uploadFile.single(name);
  },
};
