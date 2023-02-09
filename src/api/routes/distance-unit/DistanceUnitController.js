const {
  models: { User, DistanceUnit },
} = require("../../../../lib/models");
var slug = require("slug");
const multer = require("multer");
const asyncParallel = require("async/parallel");
var _ = require("lodash");
const DATATABLE_DEFAULT_LIMIT = 10;
const DATATABLE_DEFAULT_SKIP = 0;

class UserController {
  async create(req, res, next) {
    let { set_distance_unit } = req.body;
    try {
      var newRecord = new DistanceUnit(req.body);
      newRecord.slug = slug(set_distance_unit, {
        replacement: "-",
        lower: true,
        charmap: slug.charmap,
      });
      return newRecord
        .save()
        .then((results) => {
          return res.success(results, req.__("DistanceUnit_CREATE_SUCCESSFULLY"));
        })
        .catch((err) => {
          return res.json({ data: err });
        });
    } catch (err) {
      return next(err);
    }
  }

  
  async update(req, res, next) {
    if (!req.params._id) {
      return res.notFound(
        {},
        req.__("INVALID_REQUEST"),
        req.__("DistanceUnit_NOT_EXIST")
      );
    }
    let data = req.body;
    let { user } = req;
    try {
      user = await DistanceUnit.findOne({
        _id: req.params._id,
        is_deleted: 0,
      });

      if (!user) {
        return res.notFound(
          {},
          req.__("INVALID_REQUEST"),
          req.__("USER_NOT_EXIST")
        );
      }

      if (user.isSuspended) {
        return res.notFound(
          "",
          req.__("YOUR_ACCOUNT_SUSPENDED"),
          req.__("ACCOUNT_SUSPENDED")
        );
      }

      if (data == null) return res.notFound({}, req.__("DistanceUnit_NOT_EXIST"));

      await DistanceUnit.findOneAndUpdate({ _id: req.params._id }, { ...data });

      return res.success(data, req.__("DistanceUnit_UPDATE_SUCCESSFULLY"));
    } catch (err) {
      return res.json({ data: err });
    }
  }
  async delete(req, res, next) {
    if (!req.params._id) {
      return res.notFound(
        {},
        req.__("INVALID_REQUEST"),
        req.__("DistanceUnit_NOT_EXIST")
      );
    }

    try {
      let data = await DistanceUnit.updateOne(
        {
          _id: req.params._id,
        },
        {is_deleted: true }
      );

      if (data == null) return res.notFound({}, req.__("DistanceUnit_NOT_EXIST"));

      return res.success(data, req.__("DistanceUnit_DELETE_SUCCESSFULLY"));
    } catch (err) {
      return res.json({ data: err });
    }
  }

}
module.exports = new UserController();
