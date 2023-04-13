const express = require("express");
const router = express.Router();
const CuisineController = require("./CuisineController");
const { validate } = require("../../util/validations");
const validations = require("./CuisineValidations");
const { verifyToken } = require("../../util/auth");

router.post(
  "/create",
  // verifyToken,
  validate(validations.createtype),
  CuisineController.create
);

router.post(
  "/list",
  // verifyToken,
  CuisineController.list
);

router.get(
  "/dropdown",
  // verifyToken,
  CuisineController.dropdown
);

router.get(
  "/:_id",  
  // verifyToken,
  CuisineController.detail
);

router.delete(
  "/:_id",
  // verifyToken,
  CuisineController.delete
);

// router.post(
//   "/update-status/:_id",
//   // verifyToken,
//   CuisineController.UpdateStatus
// );

// router.put(
//   "/update/:_id",
//   validate(validations.updateProfile),
//   // verifyToken,
//   CuisineController.update
// );

module.exports = router;
