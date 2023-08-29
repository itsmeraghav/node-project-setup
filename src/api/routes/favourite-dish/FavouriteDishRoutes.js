const express = require("express");
const router = express.Router();
const FavouriteDishController = require("./FavouriteDishController");
const { validate } = require("../../util/validations");
// const validations = require("./FavouriteDishValidations");
const { verifyToken } = require("../../util/auth");

router.post(
  "/create",
  // verifyToken,
  // validate(validations.create),
  FavouriteDishController.create
);

router.post(
  "/delete/:_id",
  //  validate(validations.updateFavouriteDish),
  // verifyToken,
  FavouriteDishController.delete
);

router.post(
  "/list",
  // verifyToken,
  // validate(validations.create),
  FavouriteDishController.list
);

router.post(
  "/request-approve/:_id",
  // verifyToken,
  // validate(validations.create),
  FavouriteDishController.UpdateApproveStatus
);
module.exports = router;
