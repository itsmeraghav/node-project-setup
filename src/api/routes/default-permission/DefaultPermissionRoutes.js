const express = require('express');
const router = express.Router();
const DefaultPermissionController = require('./DefaultPermissionController');
const { validate } = require('../../util/validations');
const validations = require('./DefaultPermissionValidations');
const { verifyToken } = require('../../util/auth');

router.post(
    "/",
    // verifyToken,
    DefaultPermissionController.create
);

router.post(
    "/list",
    // verifyToken,
    DefaultPermissionController.list
);
router.get(
    "/list",
    // verifyToken,
    DefaultPermissionController.listAll
);
 

router.get(
    "/:slug",
    // verifyToken,
    DefaultPermissionController.detail
);

router.delete(
    "/:slug",
    // verifyToken,
    DefaultPermissionController.delete
);

router.put(
    "/:slug",
    // verifyToken,
    DefaultPermissionController.update
);
 


module.exports = router;
