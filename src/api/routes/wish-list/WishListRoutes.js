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

  
router.post(
  "/list",
  // verifyToken,
  WishListController.list
);

router.get(
  "/detail/:_id",  
  // verifyToken,
  WishListController.detail
);
router.delete(
  "/:_id",
  // verifyToken,
  WishListController.delete
);


router.get(
  "/dropdown",
  // verifyToken,
  WishListController.dropdown
);


  module.exports = router;  