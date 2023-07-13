const {
  models: { User, Grocery },
} = require("../../../../lib/models");
var slug = require("slug");
const asyncParallel = require("async/parallel");
var _ = require("lodash");
const DATATABLE_DEFAULT_LIMIT = 10;
const DATATABLE_DEFAULT_SKIP = 0;

class UserController {
  async create(req, res, next) {
    let { list_title } = req.body;
    try {
      var newRecord = new Grocery(req.body);
      return newRecord
        .save()
        .then((results) => {
          return res.success(results, req.__("Grocery_CREATE_SUCCESSFULLY"));
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
    var conditions = { is_deleted: false };
    asyncParallel(
      {
        data: function(callback) {
          Grocery.find(
            conditions,
            {},
            { sort: { created_at: "desc" }, skip: skip, limit: limit }
          )
            .populate("category", "_id name")
            .populate("brand", "_id name")
            .populate("unit", "_id name")
            .populate("discount", "_id name")
            .populate("marchent_id", "_id full_name")

            .exec((err, result) => {
              callback(err, result);
            });
        },
        records_filtered: function(callback) {
          Grocery.countDocuments(conditions, (err, result) => {
            /* send success response */
            callback(err, result);
          });
        },
        records_total: function(callback) {
          Grocery.countDocuments({ is_deleted: 0 }, (err, result) => {
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
        return res.success(data, req.__("Grocery_LIST_GENREATED"));
      }
    );
  }

  async detail(req, res, next) {
    if (!req.params._id) {
      return res.notFound(
        {},
        req.__("INVALID_REQUEST"),
        req.__("Grocery_NOT_EXIST")
      );
    }

    try {
      let data = await Grocery.findOne(
        {
          _id: req.params._id,
        },
        {}
      )
        .populate("category", "_id name")
        .populate("brand", "_id name")
        .populate("unit", "_id name")
        .populate("discount", "_id name")
        .populate("marchent_id", "_id full_name")
        .exec();
      if (data == null) return res.notFound({}, req.__("Grocery_NOT_EXIST"));

      return res.success(data, req.__("Grocery_DETAIL_SUCCESSFULLY"));
    } catch (err) {
      return res.json({ data: err });
    }
  }

  async delete(req, res, next) {
    if (!req.params._id) {
      return res.notFound(
        {},
        req.__("INVALID_REQUEST"),
        req.__("Grocery_NOT_EXIST")
      );
    }

    try {
      let data = await Grocery.updateOne(
        {
          _id: req.params._id,
        },
        { is_deleted: true }
      );

      if (data == null) return res.notFound({}, req.__("Grocery_NOT_EXIST"));

      return res.success(data, req.__("Grocery_DELETE_SUCCESSFULLY"));
    } catch (err) {
      return res.json({ data: err });
    }
  }

  async UpdateStatus(req, res, next) {
    if (!req.params._id) {
      return res.notFound(
        {},
        req.__("INVALID_REQUEST"),
        req.__("Grocery_NOT_EXIST")
      );
    }

    try {
      let data = await Grocery.findOne({
        _id: req.params._id,
      });
      if (data == null) return res.notFound({}, req.__("Grocery_NOT_EXIST"));

      let updatedData = await Grocery.updateOne(
        {
          _id: req.params._id,
        },
        {
          $set: {
            status: data.status == 1 ? 0 : 1,
          },
        }
      );

      return res.success(data, req.__("Grocery_STATUS_UPDATE_SUCCESSFULLY"));
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
        req.__("Grocery_NOT_EXIST")
      );
    }
    let data = req.body;
    let { user } = req;
    try {
      user = await Grocery.findOne({
        _id: req.params._id,
        // is_deleted: 0,
      });

      if (!user) {
        return res.notFound(
          {},
          req.__("INVALID_REQUEST"),
          req.__("USER_NOT_EXIST")
        );
      }

      if (data == null) return res.notFound({}, req.__("Grocery_NOT_EXIST"));

      await Grocery.findOneAndUpdate({ _id: req.params._id }, { ...data });

      return res.success(data, req.__("Grocery_UPDATE_SUCCESSFULLY"));
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
          Grocery.find(
            conditions,
            {
              //     _id: 0,
              // dish_title:1,
              // description: 1,
              // ingredients:1,
              // tags:1,
              // preparation_time:1,
              // dish_photo:1,
              // cost:1,
              // status: 1,
              // is_edit: 1,
              // slug: 1,
              // createdAt: 1,
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
        return res.success(data, req.__("Grocery_LIST_DONE"));
      }
    );
  }
}

module.exports = new UserController();
