const express = require("express");
const router = express.Router();
const DiscountController = require("./DiscountController");
 const { validate } = require("../../util/validations");
const validations = require("./DiscountValidations");
const { verifyToken } = require("../../util/auth");

router.post(
  "/create",
  // verifyToken,
 validate(validations.create),
  DiscountController.create
);

router.post(
  "/list",
  // verifyToken,
  DiscountController.list
);

router.get(
  "/dropdown",
  // verifyToken,
  DiscountController.dropdown
);

router.get(
  "/detail/:_id",  
  // verifyToken,
  DiscountController.detail
);

router.delete(
  "/delete/:_id",
  // verifyToken,
  DiscountController.delete
);

router.post(
  "/update-status/:_id",
  // verifyToken,
  DiscountController.UpdateStatus
);

router.put(
  "/update/:_id",
 validate(validations.updateDiscount),
  // verifyToken,
  DiscountController.update
);

module.exports = router;