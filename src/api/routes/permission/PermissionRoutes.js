const express = require('express');
const router = express.Router();
const PermissionController = require('./PermissionController');
const { validate } = require('../../util/validations');
const validations = require('./PermissionValidations');
const { verifyToken } = require('../../util/auth');

router.post(
    "/",
    // verifyToken,
    PermissionController.create
);

router.post(
    "/list",
    // verifyToken,
    PermissionController.list
);
router.get(
    "/list",
    // verifyToken,
    PermissionController.listAll
);
 

// router.get(
//     "/:slug",
//     // verifyToken,
//     PermissionController.detail
// );

router.delete(
    "/:slug",
    // verifyToken,
    PermissionController.delete
);

router.put(
    "/:slug",
    // verifyToken,
    PermissionController.update
);

router.get(
    "/permission/:role_id",
    // verifyToken,
    PermissionController.deletePer
);
 


module.exports = router;
