const express = require("express");
const router = express.Router();
const Gallery = require("./GalleryController");
const { validate } = require("../../util/validations");
const validations = require("./GalleryValidations");
const { verifyToken } = require("../../util/auth");

router.post(
  "/create",
  // verifyToken,
 validate(validations.create),
 Gallery.create
);

router.post(
  "/list",
  // verifyToken,
  Gallery.list
);

// router.get(
//   "/dropdown",
//   // verifyToken,
//   MyPhotosController.dropdown
// );

router.get(
  "/detail/:_id",  
  // verifyToken,
  Gallery.detail
);

router.delete(
  "/delete/:_id",
  // verifyToken,
  Gallery.delete
);

router.post(
  "/update-status/:_id",
  // verifyToken,
  Gallery.UpdateStatus
);

router.put(
  "/update/:_id",
  validate(validations.updatePhoto),
  // verifyToken,
  Gallery.update
);

module.exports = router;