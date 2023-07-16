const {
  models: { User, EventOrders },
} = require("../../../../lib/models");
var slug = require("slug");
const asyncParallel = require("async/parallel");
var _ = require("lodash");
const DATATABLE_DEFAULT_LIMIT = 10;
const DATATABLE_DEFAULT_SKIP = 0;

class UserController {
  async create(req, res, next) {
    let { name } = req.body;
    try {
      var newRecord = new EventOrders(req.body);

      return newRecord
        .save()
        .then((results) => {
          return res.success(
            results,
            req.__("EventOrders_CREATE_SUCCESSFULLY")
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
    var conditions = { is_deleted: 0 };
    asyncParallel(
      {
        data: function(callback) {
          EventOrders.find(
            conditions,
            {},
            { sort: { created_at: "desc" }, skip: skip, limit: limit },
            (err, result) => {
              callback(err, result);
            }
          );
        },
        records_filtered: function(callback) {
          EventOrders.countDocuments(conditions, (err, result) => {
            /* send success response */
            callback(err, result);
          });
        },
        records_total: function(callback) {
          EventOrders.countDocuments({ is_deleted: 0 }, (err, result) => {
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
        return res.success(data, req.__("EventOrders_LIST_GENREATED"));
      }
    );
  }

  async detail(req, res, next) {
    if (!req.params._id) {
      return res.notFound(
        {},
        req.__("INVALID_REQUEST"),
        req.__("EventOrders_NOT_EXIST")
      );
    }

    try {
      let data = await EventOrders.findOne(
        {
          _id: req.params._id,
        },
        {}
      );
      if (data == null)
        return res.notFound({}, req.__("EventOrders_NOT_EXIST"));

      return res.success(data, req.__("EventOrders_DETAIL_SUCCESSFULLY"));
    } catch (err) {
      return res.json({ data: err });
    }
  }

  async delete(req, res, next) {
    if (!req.params._id) {
      return res.notFound(
        {},
        req.__("INVALID_REQUEST"),
        req.__("EventOrders_NOT_EXIST")
      );
    }

    try {
      let data = await EventOrders.updateOne(
        {
          _id: req.params._id,
        },
        { is_deleted: 1 }
      );

      if (data == null)
        return res.notFound({}, req.__("EventOrders_NOT_EXIST"));

      return res.success(data, req.__("EventOrders_DELETE_SUCCESSFULLY"));
    } catch (err) {
      return res.json({ data: err });
    }
  }

  async UpdateStatus(req, res, next) {
    if (!req.params._id) {
      return res.notFound(
        {},
        req.__("INVALID_REQUEST"),
        req.__("EventOrders_NOT_EXIST")
      );
    }

    try {
      let data = await EventOrders.findOne({
        _id: req.params._id,
      });
      if (data == null)
        return res.notFound({}, req.__("EventOrders_NOT_EXIST"));

      let updatedData = await EventOrders.updateOne(
        {
          _id: req.params._id,
        },
        {
          $set: {
            status: data.status == 1 ? 0 : 1,
          },
        }
      );

      return res.success(
        data,
        req.__("EventOrders_STATUS_UPDATE_SUCCESSFULLY")
      );
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
        req.__("EventOrders_NOT_EXIST")
      );
    }
    let data = req.body;
    let { user } = req;
    try {
      user = await EventOrders.findOne({
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

      if (data == null)
        return res.notFound({}, req.__("EventOrders_NOT_EXIST"));

      await EventOrders.findOneAndUpdate(
        { slug: req.params.slug },
        { ...data }
      );

      return res.success(data, req.__("EventOrders_UPDATE_SUCCESSFULLY"));
    } catch (err) {
      return res.json({ data: err });
    }
  }

  async dropdown(req, res, next) {
    /** Filteration value */

    var conditions = { status: 1 };
    asyncParallel(
      {
        data: function(callback) {
          EventOrders.find(
            conditions,
            {},
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
        return res.success(data, req.__("EventOrders_LIST_DONE"));
      }
    );
  }
}

module.exports = new UserController();
