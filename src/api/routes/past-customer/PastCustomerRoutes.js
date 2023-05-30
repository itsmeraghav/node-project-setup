const express = require("express");
const router = express.Router();
const PastCustomerController = require("./PastCustomerController");
 const { validate } = require("../../util/validations");
const validations = require("./PastCustomerValidations");
const { verifyToken } = require("../../util/auth");

router.post(
  "/create",
  // verifyToken,
 validate(validations.create),
  PastCustomerController.create
);

router.post(
  "/list",
  // verifyToken,
  PastCustomerController.list
);

router.get(
  "/dropdown",
  // verifyToken,
  PastCustomerController.dropdown
);

router.get(
  "/detail/:_id",  
  // verifyToken,
  PastCustomerController.detail
);

router.delete(
  "/delete/:_id",
  // verifyToken,
  PastCustomerController.delete
);

router.post(
  "/update-status/:_id",
  // verifyToken,f
  PastCustomerController.UpdateStatus
);

router.put(
  "/update/:_id",
 //validate(validations.updatePastCustomer),
  // verifyToken,
  PastCustomerController.update
);

module.exports = router;