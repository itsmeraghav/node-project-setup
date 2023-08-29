const {
  models: { User, FavouriteDish },
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
      var newRecord = new FavouriteDish(req.body);

      return newRecord
        .save()
        .then((results) => {
          return res.success(
            results,
            req.__("FavouriteDish_CREATE_SUCCESSFULLY")
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

      if (filterObj?.user_id) {
        conditions["user_id"] = filterObj?.user_id;
      }
    }
    asyncParallel(
      {
        data: function(callback) {
          FavouriteDish.find(
            conditions,

            {},
            { sort: { created_at: "desc" }, skip: skip, limit: limit },
            (err, result) => {
              callback(err, result);
            }
          )
            .populate("user_id")
            .populate("dish_id", "dish_photo dish_title like view star")
            .exec();
        },
        records_filtered: function(callback) {
          FavouriteDish.countDocuments(conditions, (err, result) => {
            /* send success response */
            callback(err, result);
          });
        },
        records_total: function(callback) {
          FavouriteDish.countDocuments({ is_deleted: 0 }, (err, result) => {
            /* send success response */
            callback(err, result);
          });
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
        return res.success(data, req.__("FavouriteDish_LIST_GENREATED"));
      }
    );
  }

  async update(req, res, next) {
    if (!req.params._id) {
      return res.notFound(
        {},
        req.__("INVALID_REQUEST"),
        req.__("FavouriteDish_NOT_EXIST")
      );
    }
    let data = req.body;
    let { user } = req;
    try {
      user = await FavouriteDish.findOne({
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
        return res.notFound({}, req.__("FavouriteDish_NOT_EXIST"));

      await FavouriteDish.findOneAndUpdate(
        { _id: req.params._id },
        { ...data }
      );

      return res.success(data, req.__("FavouriteDish_UPDATE_SUCCESSFULLY"));
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
      let data = await FavouriteDish.updateOne(
        {
          _id: req.params._id,
        },
        { is_deleted: 1 }
      );

      if (data == null) return res.notFound({}, req.__("FAQ_NOT_EXIST"));

      return res.success(data, req.__("FavouriteDish_DELETE_SUCCESSFULLY"));
    } catch (err) {
      return res.json({ data: err });
    }
  }
  async UpdateApproveStatus(req, res, next) {
    if (!req.params._id) {
      return res.notFound(
        {},
        req.__("INVALID_REQUEST"),
        req.__("FavouriteDish_NOT_EXIST")
      );
    }

    try {
      let data = await FavouriteDish.findOne({
        _id: req.params._id,
      });
      if (data == null)
        return res.notFound({}, req.__("FavouriteDish_NOT_EXIST"));

      let updatedData = await FavouriteDish.updateOne(
        {
          _id: req.params._id,
        },
        {
          request_approve: 1,
        }
      );

      return res.success(
        data,
        req.__("FavouriteDish_STATUS_UPDATE_SUCCESSFULLY")
      );
    } catch (err) {
      return res.json({ data: err });
    }
  }
}
module.exports = new UserController();
