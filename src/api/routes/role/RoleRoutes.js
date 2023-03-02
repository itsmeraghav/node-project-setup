const express = require("express");
const router = express.Router();
const RoleController = require("./RoleController");
const { validate } = require("../../util/validations");
const validations = require("./RoleValidations");
const { verifyToken } = require("../../util/auth");

router.post(
  "/",
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
  "/:slug",
  // verifyToken,
  RoleController.detail
);

router.delete(
  "/:slug",
  // verifyToken,
  RoleController.delete
);

router.post(
  "/update-status/:slug",
  // verifyToken,
  RoleController.UpdateStatus
);

router.put(
  "/:slug",
  // verifyToken,
  RoleController.update
);

module.exports = router;
