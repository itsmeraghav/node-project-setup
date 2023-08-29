const {
  models: { User, Followersfollowing },
} = require("../../../../lib/models");
var slug = require("slug");
const multer = require("multer");
const asyncParallel = require("async/parallel");
var _ = require("lodash");
const DATATABLE_DEFAULT_LIMIT = 10;
const DATATABLE_DEFAULT_SKIP = 0;

class UserController {
  async create(req, res, next) {
    let { image } = req.body;
    try {
      var newRecord = new Followersfollowing(req.body);

      return newRecord
        .save()
        .then((results) => {
          return res.success(
            results,
            req.__("Followers & following_CREATE_SUCCESSFULLY")
          );
        })
        .catch((err) => {
          return res.json({ data: err });
        });
    } catch (err) {
      return next(err);
    }
  }

  async list(req, res, next) {
    /** Filteration value */
    let limit = req.body.length
      ? parseInt(req.body.length)
      : DATATABLE_DEFAULT_LIMIT;
    let skip = req.body.start
      ? parseInt(req.body.start)
      : DATATABLE_DEFAULT_SKIP;
    skip = skip === 0 ? 0 : (skip - 1) * limit;
    var conditions = {
      is_deleted: 0,
    };
    let filterObj = req.body.filter ? req.body.filter : null;
    if (filterObj) {
      //apply filter

      if (filterObj?.from_id) {
        conditions["from_id"] = filterObj?.from_id;
      }
      if (filterObj?.to_id) {
        conditions["to_id"] = filterObj?.to_id;
      }
    }
    asyncParallel(
      {
        data: function(callback) {
          Followersfollowing.find(
            conditions,

            {},
            { sort: { created_at: "desc" }, skip: skip, limit: limit },
            (err, result) => {
              callback(err, result);
            }
          )
            .populate("to_id", "upload_profile full_name bio")
            .populate("from_id", "upload_profile full_name bio")
            .exec();
        },
        records_filtered: function(callback) {
          Followersfollowing.countDocuments(conditions, (err, result) => {
            /* send success response */
            callback(err, result);
          });
        },
        records_total: function(callback) {
          Followersfollowing.countDocuments(
            { is_deleted: 0 },
            (err, result) => {
              /* send success response */
              callback(err, result);
            }
          );
        },
      },
      function(err, results) {
        if (err) return res.json({ data: err });

        let data = {
          records: results && results.data ? results.data : [],
          recordsFiltered:
            results && results.records_filtered ? results.records_filtered : 0,
          recordsTotal:
            results && results.records_total ? results.records_total : 0,
        };
        return res.success(
          data,
          req.__("Followers & following_LIST_GENREATED")
        );
      }
    );
  }

  async update(req, res, next) {
    if (!req.params._id) {
      return res.notFound(
        {},
        req.__("INVALID_REQUEST"),
        req.__("Followersfollowing_NOT_EXIST")
      );
    }
    let data = req.body;
    let { user } = req;
    try {
      user = await Followersfollowing.findOne({
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

      if (data == null)
        return res.notFound({}, req.__("Followers & following_NOT_EXIST"));

      await Followersfollowing.findOneAndUpdate(
        { _id: req.params._id },
        { ...data }
      );

      return res.success(
        data,
        req.__("Followersfollowing_UPDATE_SUCCESSFULLY")
      );
    } catch (err) {
      return res.json({ data: err });
    }
  }

  async delete(req, res, next) {
    if (!req.params._id) {
      return res.notFound(
        {},
        req.__("INVALID_REQUEST"),
        req.__("FAQ_NOT_EXIST")
      );
    }

    try {
      let data = await Followersfollowing.updateOne(
        {
          _id: req.params._id,
        },
        { is_deleted: 1 }
      );

      if (data == null) return res.notFound({}, req.__("FAQ_NOT_EXIST"));

      return res.success(
        data,
        req.__("Followers & following_DELETE_SUCCESSFULLY")
      );
    } catch (err) {
      return res.json({ data: err });
    }
  }

  async approvedstatus(req, res, next) {
    if (!req.params._id) {
      return res.notFound(
        {},
        req.__("INVALID_REQUEST"),
        req.__("Followersfollowing_NOT_EXIST")
      );
    }

    try {
      let data = await Followersfollowing.findOne({
        _id: req.params._id,
      });
      if (data == null)
        return res.notFound({}, req.__("Followersfollowing_NOT_EXIST"));

      let updatedData = await Followersfollowing.updateOne(
        {
          _id: req.params._id,
        },
        {
          approved_status: 1,
        }
      );

      return res.success(
        data,
        req.__("Followersfollowing_Approved_STATUS_UPDATE_SUCCESSFULLY")
      );
    } catch (err) {
      return res.json({ data: err });
    }
  }
}
module.exports = new UserController();
