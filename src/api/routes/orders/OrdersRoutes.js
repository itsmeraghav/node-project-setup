const express = require("express");
const router = express.Router();
const OrdersController = require("./OrdersController");
 const { validate } = require("../../util/validations");
const validations = require("./OrdersValidations");
const { verifyToken } = require("../../util/auth");

router.post(
  "/create",
  // verifyToken,
//  validate(validations.create),
  OrdersController.create
);

router.post(
  "/list",
  // verifyToken,
  OrdersController.list
);

router.get(
  "/dropdown",
  // verifyToken,
  OrdersController.dropdown
);

router.get(
  "/detail/:_id",  
  // verifyToken,
  OrdersController.detail
);

router.delete(
  "/delete/:_id",
  // verifyToken,
  OrdersController.delete
);

router.post(
  "/update-status/:_id",
  // verifyToken,f
  OrdersController.UpdateStatus
);

router.put(
  "/update/:_id",
 //validate(validations.updateOrders),
  // verifyToken,
  OrdersController.update
);

module.exports = router;