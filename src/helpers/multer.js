"use strict";
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

module.exports = {
  uploadArray: (name, count) => {
    return upload.array(name, count);
  },

  uploadSingle: (name) => {
    return upload.single(name);
  },

  uploadFileXls: (name) => {
    const excelFilter = (req, file, cb) => {
      if (
        file.mimetype.includes("excel") ||
        file.mimetype.includes("spreadsheetml")
      ) {
        cb(null, true);
      } else {
        cb("Please upload only excel file.", false);
      }
    };
    const storageInDisk = multer.diskStorage({
      destination: function (req, file, cb) {
        console.log("masuk 20");
        cb(null, "./uploads/");
      },
      filename: function (req, file, cb) {
        const dateTimeStamp = Date.now();
        cb(null, file.originalname + "-" + dateTimeStamp);
      },
    });

    const uploadFile = multer({
      storage: storageInDisk,
      fileFilter: excelFilter,
    });

    return uploadFile.single(name);
  },
};
