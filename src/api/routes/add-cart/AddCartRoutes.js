const express = require("express");
const router = express.Router();
const AddCartController = require("./AddCartController");
const { validate } = require("../../util/validations");
const validations = require("./AddCartValidations");
const { verifyToken } = require("../../util/auth");

router.post(
  "/create",
  // verifyToken,
 // validate(validations.createAddCart),
  AddCartController.create
);

router.post(
  "/list",
  // verifyToken,
  AddCartController.list
);

router.get(
  "/dropdown",
  // verifyToken,
  AddCartController.dropdown
);

router.get(
  "/detail/:user_id",  
  // verifyToken,
  AddCartController.detail
);

router.delete(
  "/delete/:_id",
  // verifyToken,
  AddCartController.delete
);

router.post(
  "/update-status/:_id",
  // verifyToken,
  AddCartController.UpdateStatus
);

router.put(
  "/update",
 // validate(validations.updateAddCart),
  // verifyToken,
  AddCartController.update
);

module.exports = router;