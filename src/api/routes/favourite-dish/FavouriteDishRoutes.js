const express = require("express");
const router = express.Router();
const FavouriteDishController = require("./FavouriteDishController");
 const { validate } = require("../../util/validations");
const validations = require("./FavouriteDishValidations");
const { verifyToken } = require("../../util/auth");

router.post(
  "/create",
  // verifyToken,
validate(validations.create),
  FavouriteDishController.create
);

router.put(
    "/update/:_id",
   validate(validations.updateFavouriteDish),
    // verifyToken,
    FavouriteDishController.update
  );
  module.exports = router;  