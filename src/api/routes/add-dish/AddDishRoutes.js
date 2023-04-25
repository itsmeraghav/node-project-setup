const express = require("express");
const router = express.Router();
const AddDishController = require("./AddDishController");
const { validate } = require("../../util/validations");
// const validations = require("./AddDishValidations");
const { verifyToken } = require("../../util/auth");

router.post(
  "/create",
  // verifyToken,
  // validate(validations.createdish),
  AddDishController.create
);

router.post(
  "/list",
  // verifyToken,
  AddDishController.list
);

router.get(
  "/dropdown",
  // verifyToken,
  AddDishController.dropdown
);

router.get(
  "/detail/:_id",
  // verifyToken,
  AddDishController.detail
);

router.delete(
  "/delete/:_id",
  // verifyToken,
  AddDishController.delete
);

router.post(
  "/update-status/:_id",
  // verifyToken,
  AddDishController.UpdateStatus
);

router.put(
  "/update/:_id",
  // verifyToken,
  // validate(validations.updateProfile),
  AddDishController.update
);

module.exports = router;
