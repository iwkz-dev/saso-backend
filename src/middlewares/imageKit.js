"use strict";

const axios = require("axios");
const FormData = require("form-data");

async function imgKitCreate(req, res, next) {
  if (!req.files) {
    try {
      throw { name: "NoImage" };
    } catch (err) {
      next(err);
    }
  } else {
    console.log(req.files);
    // const typeFile = `.${
    //   req.files[0].originalname.split(".")[
    //     req.files[0].originalname.split(".").length - 1
    //   ]
    // }`;

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
              formData.append("file", imgBufferEncoded);
              formData.append("fileName", el.originalname);

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
              throw { name: "FileIsBig" };
            }
          } else {
            throw { name: "WrongTypeFile" };
          }
        })
      ).then((result) => {
        let imageUrls = [];

        result.forEach((el) => {
          imageUrls.push(el.data.url);
        });
        req.body.imageUrls = imageUrls;
        next();
      });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
}

module.exports = { imgKitCreate };
