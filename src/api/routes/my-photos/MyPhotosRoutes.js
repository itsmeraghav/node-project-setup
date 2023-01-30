const express = require("express");
const router = express.Router();
const MyPhotosController = require("./MyPhotosController");
// const { validate } = require("../../util/validations");
const validations = require("./MyPhotosValidations");
const { verifyToken } = require("../../util/auth");

router.post(
  "/create",
  // verifyToken,
//   validate(validations.createMyPhotos),
  MyPhotosController.create
);

router.post(
  "/list",
  // verifyToken,
  MyPhotosController.list
);

// router.get(
//   "/dropdown",
//   // verifyToken,
//   MyPhotosController.dropdown
// );

router.get(
  "/detail/:_id",  
  // verifyToken,
  MyPhotosController.detail
);

router.delete(
  "/delete/:_id",
  // verifyToken,
  MyPhotosController.delete
);

router.post(
  "/update-status/:_id",
  // verifyToken,
  MyPhotosController.UpdateStatus
);

router.put(
  "/update/:_id",
 // validate(validations.updateMyPhotos),
  // verifyToken,
  MyPhotosController.update
);

module.exports = router;