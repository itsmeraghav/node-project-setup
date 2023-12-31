const {
  models: { User, LiveFeed },
} = require("../../../../lib/models");
// var slug = require("slug");
const multer = require("multer");
const asyncParallel = require("async/parallel");
var _ = require("lodash");
const DATATABLE_DEFAULT_LIMIT = 10;
const DATATABLE_DEFAULT_SKIP = 0;

class UserController {
  async create(req, res, next) {
    let {} = req.body;
    try {
      var newRecord = new LiveFeed(req.body);

      return newRecord
        .save()
        .then((results) => {
          return res.success(
            results,
            req.__("Dish_ADD_ON_LiveFeed_SUCCESSFULLY")
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
      if (filterObj?.chef_id) {
        conditions["chef_id"] = filterObj?.chef_id;
      }
    }

    asyncParallel(
      {
        data: function(callback) {
          LiveFeed.find(
            conditions,

            {},

            { sort: { created_at: "desc" }, skip: skip, limit: limit }
          )
            .populate("chef_id", "_id full_name upload_profile")
            .populate(
              "dish_id",
              "_id dish_title dish_photo description cost discount_amount"
            )
            .populate("likes.user_id", "_id full_name")
            .populate("comments.user_id", "_id full_name")

            .exec((err, result) => {
              callback(err, result);
            });
        },
        records_filtered: function(callback) {
          LiveFeed.countDocuments(conditions, (err, result) => {
            /* send success response */
            callback(err, result);
          });
        },
        records_total: function(callback) {
          LiveFeed.countDocuments({ is_deleted: 0 }, (err, result) => {
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
        return res.success(data, req.__("LiveFeed_LIST_GENREATED"));
      }
    );
  }

  async useractivitylist(req, res, next) {
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
      likes: {
        $elemMatch: { user_id: req.body.user_id },
      },
    };

    asyncParallel(
      {
        data: function(callback) {
          LiveFeed.find(
            conditions,

            {},

            { sort: { created_at: "desc" }, skip: skip, limit: limit }
          )
            .populate("chef_id", "_id full_name upload_profile")
            .populate(
              "dish_id",
              "_id dish_title dish_photo description cost discount_amount"
            )
            .populate("likes.user_id", "_id full_name")
            .populate("comments.user_id", "_id full_name")

            .exec((err, result) => {
              callback(err, result);
            });
        },
        records_filtered: function(callback) {
          LiveFeed.countDocuments(conditions, (err, result) => {
            /* send success response */
            callback(err, result);
          });
        },
        records_total: function(callback) {
          LiveFeed.countDocuments({ is_deleted: 0 }, (err, result) => {
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
        return res.success(
          data,
          req.__("User activity LiveFeed_LIST_GENREATED")
        );
      }
    );
  }

  async detail(req, res, next) {
    if (!req.params._id) {
      return res.notFound(
        {},
        req.__("INVALID_REQUEST"),
        req.__("Post_NOT_EXIST")
      );
    }

    try {
      let data = await LiveFeed.findOne(
        {
          _id: req.params._id,
        },
        {
          // modified_at: 1,
        }
      );
      if (data == null) return res.notFound({}, req.__("post_NOT_EXIST"));

      return res.success(data, req.__("Post_DETAIL_SUCCESSFULLY"));
    } catch (err) {
      return res.json({ data: err });
    }
  }

  async delete(req, res, next) {
    if (!req.params._id) {
      return res.notFound(
        {},
        req.__("INVALID_REQUEST"),
        req.__("Post_NOT_EXIST")
      );
    }

    try {
      let data = await LiveFeed.updateOne(
        {
          _id: req.params._id,
        },
        { is_deleted: 1 }
      );

      if (data == null) return res.notFound({}, req.__("Post_NOT_EXIST"));

      return res.success(data, req.__("LiveFeed_DELETE_SUCCESSFULLY"));
    } catch (err) {
      return res.json({ data: err });
    }
  }

  async UpdateStatus(req, res, next) {
    if (!req.params._id) {
      return res.notFound(
        {},
        req.__("INVALID_REQUEST"),
        req.__("Post_NOT_EXIST")
      );
    }

    try {
      let data = await LiveFeed.findOne({
        _id: req.params._id,
      });
      if (data == null) return res.notFound({}, req.__("Post_NOT_EXIST"));

      let updatedData = await LiveFeed.updateOne(
        {
          _id: req.params._id,
        },
        {
          $set: {
            status: data.status == 1 ? 0 : 1,
          },
        }
      );

      return res.success(data, req.__("Post_STATUS_UPDATE_SUCCESSFULLY"));
    } catch (err) {
      console.log("asdas", err);
      return res.json({ data: err });
    }
  }

  async update(req, res, next) {
    if (!req.params._id) {
      return res.notFound(
        {},
        req.__("INVALID_REQUEST"),
        req.__("Post_NOT_EXIST")
      );
    }
    let data = req.body;
    let { user } = req;
    try {
      user = await LiveFeed.findOne({
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

      if (data == null) return res.notFound({}, req.__("Post_NOT_EXIST"));

      await LiveFeed.findOneAndUpdate({ _id: req.params._id }, { ...data });

      return res.success(data, req.__("Post_UPDATE_SUCCESSFULLY"));
    } catch (err) {
      return res.json({ data: err });
    }
  }

  async dropdown(req, res, next) {
    /** Filteration value */

    var conditions = { is_deleted: 0, status: 1 };
    asyncParallel(
      {
        data: function(callback) {
          LiveFeed.find(
            conditions,
            {
              // _id: 1,
              // username: 1,
              // status: 1,
              // is_edit: 1,
              //  created_at: 1,
              //  modified_at: 1,
            },
            { sort: { created_at: "desc" } },
            (err, result) => {
              callback(err, result);
            }
          );
        },
      },
      function(err, results) {
        if (err) return res.json({ data: err });

        let data = {
          records: results && results.data ? results.data : [],
        };
        return res.success(data, req.__("LiveFeed_LIST_DONE"));
      }
    );
  }
}

module.exports = new UserController();
