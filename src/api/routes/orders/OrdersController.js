const {
  models: { User, Orders },
} = require("../../../../lib/models");
var slug = require("slug");
const multer = require("multer");
const asyncParallel = require("async/parallel");
var _ = require("lodash");
const { randomNumeric,randomNumericfororder } = require("../../util/common");
const DATATABLE_DEFAULT_LIMIT = 10;
const DATATABLE_DEFAULT_SKIP = 0;

class UserController {
  async create(req, res, next) {
    let { user_id } = req.body;
    try {
      var newRecord = new Orders(req.body);
      newRecord.order_id = randomNumericfororder(10);
      newRecord.order_date = new Date();
      return newRecord
        .save()
        .then((results) => {
          return res.success(
            results,
            req.__("Order_CREATE_SUCCESSFULLY")
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
  
    let filterObj = req.body.filter ? req.body.filter : null;
    if (filterObj) {
      //apply filter
      if (filterObj?.order_id) {
        conditions["order_id"] = filterObj?.order_id;
      }
      if (filterObj?.cx_id) {
        conditions["cx_id"] = filterObj?.cx_id;
      }
      if (filterObj?.created_by) {
        conditions["created_by"] = filterObj?.created_by;
      }
    }
    asyncParallel(
      {
        data: function(callback) {
          Orders.find(
            conditions,
            {
              
            },
            { sort: { created_at: "desc" }, skip: skip, limit: limit }
          )
            .populate("created_by", "_id full_name upload_profile ")
            .populate("cx_id", "_id full_name upload_profile ")
            .exec((err, result) => {
              callback(err, result);
            })  ;
        },
        records_filtered: function(callback) {
          Orders.countDocuments(conditions, (err, result) => {
            /* send success response */
            callback(err, result);
          });
        },
        records_total: function(callback) {
          Orders.countDocuments({ is_deleted: 0 }, (err, result) => {
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
        return res.success(data, req.__("Orders_LIST_GENREATED"));
      }
    );
  }

  async detail(req, res, next) {
    if (!req.params._id) {
      return res.notFound(
        {},
        req.__("INVALID_REQUEST"),
        req.__("Orders_NOT_EXIST")
      );
    }

    try {
      let data = await Orders.findOne(
        {
          _id: req.params._id,
        },
        {
          
        }
      );
      if (data == null)
        return res.notFound({}, req.__("Orders_NOT_EXIST"));

      return res.success(data, req.__("Orders_DETAIL_SUCCESSFULLY"));
    } catch (err) {
      return res.json({ data: err });
    }
  }

  async delete(req, res, next) {
    if (!req.params._id) {
      return res.notFound(
        {},
        req.__("INVALID_REQUEST"),
        req.__("Orders_NOT_EXIST")
      );
    }

    try {
      let data = await Orders.updateOne(
        {
          _id: req.params._id,
        },
        { is_deleted: 1 }
      );

      if (data == null)
        return res.notFound({}, req.__("Orders_NOT_EXIST"));

      return res.success(data, req.__("Orders_DELETE_SUCCESSFULLY"));
    } catch (err) {
      return res.json({ data: err });
    }
  }

  async UpdateStatus(req, res, next) {
    if (!req.params._id) {
      return res.notFound(
        {},
        req.__("INVALID_REQUEST"),
        req.__("Orders_NOT_EXIST")
      );
    }
    try {
      let data = await Orders.findOne({
        _id: req.params._id,
      });
      if (data == null)
        return res.notFound({}, req.__("Orders_NOT_EXIST"));

      let updatedData = await Orders.updateOne(
        {
          _id: req.params._id,
        },
        {
          order_status:req.body.order_status
        }
      );

      return res.success(
        updatedData,
        req.__("Orders_STATUS_UPDATE_SUCCESSFULLY")
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
        req.__("Orders_NOT_EXIST")
      );
    }
    let data = req.body;
    let { user } = req;
    try {
      user = await Orders.findOne({
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
        return res.notFound({}, req.__("Orders_NOT_EXIST"));

      await Orders.findOneAndUpdate({ _id: req.params._id }, { ...data });

      return res.success(data, req.__("Orders_UPDATE_SUCCESSFULLY"));
    } catch (err) {
      return res.json({ data: err });
    }
  }

  async dropdown(req, res, next) {
    /** Filteration value */

    var conditions = { is_deleted: 0,  };
    asyncParallel(
      {
        data: function(callback) {
          Orders.find(
            conditions,
            {
             
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
        return res.success(data, req.__("Orders_LIST_DONE"));
      }
    );
  }

  
}

module.exports = new UserController();
