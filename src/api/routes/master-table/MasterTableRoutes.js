const express = require("express");
const router = express.Router();
const MasterTableController = require("./MasterTableController");
const { validate } = require("../../util/validations");
const validations = require("./MasterTableValidations");
const { verifyToken } = require("../../util/auth");

router.post(
  "/create",
  // verifyToken,
 //validate(validations.createtype),
  MasterTableController.create
);

router.post(
  "/list",
  // verifyToken,
  MasterTableController.list
);

router.get(
  "/dropdown",
  // verifyToken,
  MasterTableController.dropdown
);
router.get(
  "/dropdown_cuisines",
  // verifyToken,
  MasterTableController.dropdown_cuisines
);
router.get(
  "/dropdown_spicelevel",
  // verifyToken,
  MasterTableController.dropdown_spicelevel
);
router.get(
  "/dropdown_type",
  // verifyToken,
  MasterTableController.dropdown_type
);
router.get(
  "/dropdown_cuisine",
  // verifyToken,
  MasterTableController.dropdown_cuisine
);

router.get(
  "/:_id",  
  // verifyToken,
  MasterTableController.detail
);

router.delete(
  "/:_id",
  // verifyToken,
  MasterTableController.delete
);

router.post(
  "/update-status/:_id",
  // verifyToken,
  MasterTableController.UpdateStatus
);

router.put(
  "/update/:_id",
 // validate(validations.updateProfile),
  // verifyToken,
  MasterTableController.update
);

module.exports = router;
