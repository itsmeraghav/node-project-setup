const {
  models: { User, WishList },
} = require("../../../../lib/models");
var slug = require("slug");
const multer = require("multer");
const asyncParallel = require("async/parallel");
var _ = require("lodash");
const DATATABLE_DEFAULT_LIMIT = 10;
const DATATABLE_DEFAULT_SKIP = 0;

class UserController {
  async create(req, res, next) {
    let { name } = req.body;
    try {
      var newRecord = new WishList(req.body);
      newRecord.slug = slug(name, {
        replacement: "-",
        lower: true,
        charmap: slug.charmap,
      });
      return newRecord
        .save()
        .then((results) => {
          return res.success(results, req.__("WishList_CREATE_SUCCESSFULLY"));
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
        req.__("WishList_NOT_EXIST")
      );
    }
    let data = req.body;
    let { user } = req;
    try {
      user = await WishList.findOne({
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

      if (data == null) return res.notFound({}, req.__("WishList_NOT_EXIST"));

      await WishList.findOneAndUpdate({ _id: req.params._id }, { ...data });

      return res.success(data, req.__("WishList_UPDATE_SUCCESSFULLY"));
    } catch (err) {
      return res.json({ data: err });
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
    let filterObj = req.body.filter ? req.body.filter : null;
    if (filterObj) {
      //apply filter
      if (filterObj?.item_name) {
        conditions["item_name"] = filterObj?.item_name;
      }
    }
    asyncParallel(
      {
        data: function(callback) {
          WishList.find(
            conditions,
            {
              _id: 1,
              name:1,
              item_name: 1,
              status: 1,
              is_edit: 1,
              createdAt: 1,
              updatedAt: 1,
            },
            { sort: { created_at: "desc" }, skip: skip, limit: limit },
            (err, result) => {
              callback(err, result);
            }
          );
        },
        records_filtered: function(callback) {
          WishList.countDocuments(conditions, (err, result) => {
            /* send success response */
            callback(err, result);
          });
        },
        records_total: function(callback) {
          WishList.countDocuments({ is_deleted: 0 }, (err, result) => {
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
        return res.success(data, req.__("WishList_LIST_GENREATED"));
      }
    );
  }
  async detail(req, res, next) {
    if (!req.params._id) {
      return res.notFound(
        {},
        req.__("INVALID_REQUEST"),
        req.__("WishList_NOT_EXIST")
      );
    }

    try {
      let data = await WishList.findOne(
        {
          _id: req.params._id,
        },
        {
          _id: 0,
          name: 1,
          item_name: 1,
          status: 1,
          type: 1,
          is_edit: 1,
          updatedAt: 1,
          createdAt: 1,
          // modified_at: 1,
        }
      );
      if (data == null) return res.notFound({}, req.__("WishList_NOT_EXIST"));

      return res.success(data, req.__("WishList_DETAIL_SUCCESSFULLY"));
    } catch (err) {
      return res.json({ data: err });
    }
  }

  async delete(req, res, next) {
    if (!req.params._id) {
      return res.notFound(
        {},
        req.__("INVALID_REQUEST"),
        req.__("WishList_NOT_EXIST")
      );
    }

    try {
      let data = await WishList.updateOne(
        {
          _id: req.params._id,
        },
        { is_deleted: 1 }
      );

      if (data == null) return res.notFound({}, req.__("WishList_NOT_EXIST"));

      return res.success(data, req.__("WishList_DELETE_SUCCESSFULLY"));
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
          WishList.find(
            conditions,
            {
              _id: 1,
              name: 1,
              item_name: 1,
              status: 1,
              is_edit: 1,
              slug: 1,
              created_at: 1,
              modified_at: 1,
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
        return res.success(data, req.__("WishList_LIST_DONE"));
      }
    );
  }
}

module.exports = new UserController();
