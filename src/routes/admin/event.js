"use strict";

const router = require("express").Router();
const multer = require("multer");
const EventController = require("@controllers/EventController");
const imageKit = require("@middlewares/imageKit");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/", EventController.create);
router.get("/", EventController.getAllEvents);

router.post(
  "/upload-image",
  upload.array("imageUrls", 5),
  // (req, res) => {
  //   console.log(req.files);
  //   res.send("success");
  // }
  imageKit.imgKitCreate,
  EventController.uploadImage
);

module.exports = router;
