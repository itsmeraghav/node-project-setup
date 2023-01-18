const express = require("express");
const router = express.Router();
const UserController = require("./UserController");
const { validate } = require("../../util/validations");
const validations = require("./UserValidations");
const { verifyToken } = require("../../util/auth");

router.post(
  "/change-password",
  verifyToken,
  validate(validations.updatePassword),
  UserController.updatePassword
);

router.get("/profile", verifyToken, UserController.profileAccountInfo);

router.post(
  "/profile-complete",
  verifyToken,
  validate(validations.profileComplete),
  UserController.markProfileComplete
);

router.post(
  "/update-profile/:userID",
  // verifyToken,
  //validate(validations.updateProfile),
  UserController.updateProfile
);

router.post(
  "/update-address/:userID",
  // verifyToken,
  validate(validations.updateaddress),
  UserController.updateAddress
);

router.post(
  "/update-education/:userID",
  // verifyToken,
  validate(validations.updateEducation),
  UserController.updateEducation
);

router.post(
  "/update-experience/:userID",
  // verifyToken,
  validate(validations.updateExperience),
  UserController.updateExperience
);

router.post(
  "/update-documents/:userID",
  // verifyToken,
  validate(validations.updatedocument),
  UserController.updateDocuments
);

router.post(
  "/update-status/:_id",
  //verifyToken,
  // validate(validations.updateProfile),
  UserController.UpdateStatus
);

router.post(
  "/verified-status/:_id",
  //verifyToken,
  // validate(validations.updateProfile),
  UserController.verifyUser
);

router.post(
  "/block/:_id",
  verifyToken,
  // validate(validations.updateProfile),
  UserController.block
);

router.get(
  "/filter",
  // verifyToken,
  UserController.filterdropdown
);

router.post(
  "/update-profile-language",
  verifyToken,
  UserController.updateProfileLanguage
);

router.get(
  "/list",
  // verifyToken,
  UserController.listAll
);

router.post(
  "/list",
  // verifyToken,
  UserController.list
);

router.post(
  "/update-destination",
  verifyToken,
  validate(validations.updateDestination),
  UserController.updateDestination
);

router.delete(
  "/:_id",
  // verifyToken,
  UserController.delete
);

router.get(
  "/:_id",
  // verifyToken,
  UserController.detail
);
router.get(
  "/email/:_id",
  // verifyToken,
  UserController.detailByEmail
);

router.post(
  "/get-near-by-list",
  verifyToken,
  validate(validations.getNearByList),
  UserController.getNearByList
);

router.get("/get-admin-setting", verifyToken, UserController.getAdminSetting);

router.get("/get-page", UserController.getPage);

module.exports = router;
