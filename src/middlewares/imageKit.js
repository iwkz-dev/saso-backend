"use strict";

const axios = require("axios");
const FormData = require("form-data");

async function imgKitUploadMulti(req, res, next) {
  if (!req.files) {
    try {
      throw { name: "Bad Request", message: "No image has been uploaded" };
    } catch (err) {
      next(err);
    }
  } else {
    // ! COBA PAKE SHARP
    try {
      Promise.all(
        req.files.map((el) => {
          const typeFile =
            el.originalname.split(".")[el.originalname.split(".").length - 1];
          if (typeFile === "jpg" || typeFile === "png" || typeFile === "jpeg") {
            if (el.size < 2000000) {
              let encodePrivateKey = Buffer.from(
                `${process.env.IMGKIT_PRIVATE_KEY}:`,
                "utf-8"
              ).toString("base64");

              let imgBufferEncoded = el.buffer.toString("base64");

              let formData = new FormData();
              let date = new Date();
              let day = date.getDate();
              if (day < 10) {
                day = `0${day}`;
              }
              let year = date.getFullYear();
              let month = date.getMonth() + 1;
              if (month < 10) {
                month = `0${month}`;
              }
              formData.append("file", imgBufferEncoded);
              formData.append(
                "fileName",
                `${year}${month}${day}_${el.originalname}`
              );

              return axios.post(
                "https://upload.imagekit.io/api/v1/files/upload",
                formData,
                {
                  headers: {
                    ...formData.getHeaders(),
                    Authorization: `Basic ${encodePrivateKey}`,
                  },
                }
              );
            } else {
              throw { name: "Bad Request" };
            }
          } else {
            throw { name: "Bad Request" };
          }
        })
      ).then((result) => {
        let imagesData = [];

        result.forEach((el) => {
          imagesData.push({
            imageUrl: el.data.url,
            eTag: el.data.fileId,
            fieldName: el.data.name,
          });
        });
        console.log(imagesData);
        req.body.imagesData = imagesData;
        next();
      });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
}

module.exports = { imgKitUploadMulti };
