const {
  models: { User, CartCheckout },
} = require("../../../../lib/models");
var slug = require("slug");
const multer = require("multer");
const asyncParallel = require("async/parallel");
var _ = require("lodash");
const DATATABLE_DEFAULT_LIMIT = 10;
const DATATABLE_DEFAULT_SKIP = 0;

class UserController {
  async create(req, res, next) {
    let {  } = req.body;
    try {
      var newRecord = new CartCheckout(req.body);
      return newRecord
        .save()
        .then((results) => {
          return res.success(
            results,
            req.__("CartCheckout_CREATE_SUCCESSFULLY")
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
   
      if (filterObj?.cx_id) {
        conditions["cx_id"] = filterObj?.cx_id;
      }
     
    }
    asyncParallel(
      {
        data: function(callback) {
          CartCheckout.find(
            conditions,
            {
              
            },
            { sort: { created_at: "desc" }, skip: skip, limit: limit }
          )
            .populate("chef_id",)
            .populate("cx_id",)
            .populate("dish_id",)
            .populate("country_id",)
            .populate("state_id",)
            .exec((err, result) => {
              callback(err, result);
            })  ;
        },
        records_filtered: function(callback) {
          CartCheckout.countDocuments(conditions, (err, result) => {
            /* send success response */
            callback(err, result);
          });
        },
        records_total: function(callback) {
          CartCheckout.countDocuments({ is_deleted: 0 }, (err, result) => {
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
        return res.success(data, req.__("CartCheckout_LIST_GENREATED"));
      }
    );
  }

  async detail(req, res, next) {
    if (!req.params._id) {
      return res.notFound(
        {},
        req.__("INVALID_REQUEST"),
        req.__("CartCheckout_NOT_EXIST")
      );
    }

    try {
      let data = await CartCheckout.findOne(
        {
          _id: req.params._id,
        },
        {
          
        }
      ) 
    
      .exec()
      if (data == null)
        return res.notFound({}, req.__("CartCheckout_NOT_EXIST"));

      return res.success(data, req.__("CartCheckout_DETAIL_SUCCESSFULLY"));
    } catch (err) {
      return res.json({ data: err });
    }
  }

  async delete(req, res, next) {
    if (!req.params._id) {
      return res.notFound(
        {},
        req.__("INVALID_REQUEST"),
        req.__("CartCheckout_NOT_EXIST")
      );
    }

    try {
      let data = await CartCheckout.updateOne(
        {
          _id: req.params._id,
        },
        { is_deleted: 1 }
      );

      if (data == null)
        return res.notFound({}, req.__("CartCheckout_NOT_EXIST"));

      return res.success(data, req.__("CartCheckout_DELETE_SUCCESSFULLY"));
    } catch (err) {
      return res.json({ data: err });
    }
  }

  async UpdateStatus(req, res, next) {
    if (!req.params._id) {
      return res.notFound(
        {},
        req.__("INVALID_REQUEST"),
        req.__("CartCheckout_NOT_EXIST")
      );
    }
    try {
      let data = await CartCheckout.findOne({
        _id: req.params._id,
      });
      if (data == null)
        return res.notFound({}, req.__("CartCheckout_NOT_EXIST"));

      let updatedData = await CartCheckout.updateOne(
        {
          _id: req.params._id,
        },
        {
          status: data.status == 1 ? 0 : 1,
        }
      );

      return res.success(
        updatedData,
        req.__("CartCheckout_STATUS_UPDATE_SUCCESSFULLY")
      );
    } catch (err) {
   
      return res.json({ data: err });
    }
  }

  async update(req, res, next) {
    if (!req.params._id) {
      return res.notFound(
        {},
        req.__("INVALID_REQUEST"),
        req.__("CartCheckout_NOT_EXIST")
      );
    }
    let data = req.body;
    let { user } = req;
    try {
      user = await CartCheckout.findOne({
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
        return res.notFound({}, req.__("CartCheckout_NOT_EXIST"));

      await CartCheckout.findOneAndUpdate({ _id: req.params._id }, { ...data });

      return res.success(data, req.__("CartCheckout_UPDATE_SUCCESSFULLY"));
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
          CartCheckout.find(
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
        return res.success(data, req.__("CartCheckout_LIST_DONE"));
      }
    );
  }

  
}

module.exports = new UserController();
