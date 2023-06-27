const express = require("express");
const router = express.Router();
const CartCheckoutController = require("./CartCheckoutController");
 const { validate } = require("../../util/validations");
const validations = require("./CartCheckoutValidations");
const { verifyToken } = require("../../util/auth");

router.post(
  "/create",
  // verifyToken,
//  validate(validations.create),
  CartCheckoutController.create
);

router.post(
  "/list",
  // verifyToken,
  CartCheckoutController.list
);

router.get(
  "/dropdown",
  // verifyToken,
  CartCheckoutController.dropdown
);

router.get(
  "/detail/:_id",  
  // verifyToken,
  CartCheckoutController.detail
);

router.delete(
  "/delete/:_id",
  // verifyToken,
  CartCheckoutController.delete
);

router.post(
  "/update-status/:_id",
  // verifyToken,f
  CartCheckoutController.UpdateStatus
);

router.put(
  "/update/:_id",
 //validate(validations.updateCartCheckout),
  // verifyToken,
  CartCheckoutController.update
);

module.exports = router;