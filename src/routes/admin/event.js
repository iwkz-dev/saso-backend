"use strict";

const router = require("express").Router();
const EventController = require("@controllers/EventController");
const imageKit = require("@middlewares/imageKit");
const { uploadArray } = require("@helpers/multer");

router.post(
  "/",
  uploadArray("imageUrls", 5),
  imageKit.imgKitUploadMulti,
  EventController.create
);

router.get("/", EventController.getAllEvents);

router.get("/:id", EventController.getEventById);

router.post(
  "/upload-image",
  uploadArray("imageUrls", 5),
  imageKit.imgKitUploadMulti,
  EventController.uploadImage
);

module.exports = router;
