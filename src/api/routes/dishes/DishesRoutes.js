const express = require("express");
const router = express.Router();
const DishesController = require("./DishesController");
const { validate } = require("../../util/validations");
// const validations = require("./DishesValidations");
const { verifyToken } = require("../../util/auth");

router.post(
  "/create",
  // verifyToken,
  // validate(validations.createdish),
  DishesController.create
);

router.post(
  "/list",
  // verifyToken,
  DishesController.list
);

router.get(
  "/dropdown",
  // verifyToken,
  DishesController.dropdown
);

router.get(
  "/detail/:_id",
  // verifyToken,
  DishesController.detail
);

router.delete(
  "/delete/:_id",
  // verifyToken,
  DishesController.delete
);

router.post(
  "/update-status/:_id",
  // verifyToken,
  DishesController.UpdateStatus
);

router.put(
  "/update/:_id",
  // verifyToken,
  // validate(validations.updateProfile),
  DishesController.update
);

module.exports = router;
