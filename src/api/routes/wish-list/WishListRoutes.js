const express = require("express");
const router = express.Router();
const WishListController = require("./WishListController");
 const { validate } = require("../../util/validations");
const validations = require("./WishListValidations");
const { verifyToken } = require("../../util/auth");

router.post(
  "/create",
  // verifyToken,
 validate(validations.create),
  WishListController.create
);

router.put(
    "/update/:_id",
   validate(validations.updateWishList),
    // verifyToken,
    WishListController.update
  );
  module.exports = router;  