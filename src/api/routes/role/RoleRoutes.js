const express = require("express");
const router = express.Router();
const RoleController = require("./RoleController");
const { validate } = require("../../util/validations");
const validations = require("./RoleValidations");
const { verifyToken } = require("../../util/auth");

router.post(
  "/create",
  // verifyToken,
  RoleController.create
);

router.post(
  "/list",
  // verifyToken,
  RoleController.list
);

router.get(
  "/dropdown",
  // verifyToken,
  RoleController.dropdown
);

router.get(
  "/detail/:_id",
  // verifyToken,
  RoleController.detail
);

router.delete(
  "/delete/:_id",
  // verifyToken,
  RoleController.delete
);

router.post(
  "/update-status/:_id",
  // verifyToken,
  RoleController.UpdateStatus
);

router.put(
  "/update/:_id",
  // verifyToken,
  RoleController.update
);

module.exports = router;
