
  const {
    models: { User, Discount },
  } = require("../../../../lib/models");
  var slug = require("slug");
  const multer = require("multer");
  const asyncParallel = require("async/parallel");
  var _ = require("lodash");
  const DATATABLE_DEFAULT_LIMIT = 10;
  const DATATABLE_DEFAULT_SKIP = 0;
 
  
  class UserController {
    async create(req, res, next) {
      let {search_dish } = req.body;
      try {
        var newRecord = new Discount(req.body);
        newRecord.slug = slug(search_dish, {
          replacement: "-",
          lower: true,
          charmap: slug.charmap,
        });
        return newRecord
          .save()
          .then((results) => {
            return res.success(results, req.__("Discount_CREATE_SUCCESSFULLY"));
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
            Discount.find(
              conditions,
              {
                _id: 1,
                search_dish: 1,
                status: 1,
                // is_edit: 1,
                // createdAt: 1,
                // updatedAt: 1,
              },
              { sort: { created_at: "desc" }, skip: skip, limit: limit },
              (err, result) => {
                callback(err, result);
              }
            );
          },
          records_filtered: function(callback) {
            Discount.countDocuments(conditions, (err, result) => {
              /* send success response */
              callback(err, result);
            });
          },
          records_total: function(callback) {
            Discount.countDocuments({ is_deleted: 0 }, (err, result) => {
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
          return res.success(data, req.__("Discount_LIST_GENREATED"));
        }
      );
    }
  
    async detail(req, res, next) {
      if (!req.params._id) {
        return res.notFound(
          {},
          req.__("INVALID_REQUEST"),
          req.__("Discount_NOT_EXIST")
        );
      }
  
      try {
        let data = await Discount.findOne(
          {
            _id: req.params._id,
          },
          {
            _id: 1,
            search_dish:1,
            status: 1,
            is_edit: 1,
            updatedAt: 1,
            createdAt:1,
            // modified_at: 1,
          }
        );
        if (data == null) return res.notFound({}, req.__("Discount_NOT_EXIST"));
  
        return res.success(data, req.__("Discount_DETAIL_SUCCESSFULLY"));
      } catch (err) {
        return res.json({ data: err });
      }
    }
  
    async delete(req, res, next) {
      if (!req.params._id) {
        return res.notFound(
          {},
          req.__("INVALID_REQUEST"),
          req.__("Discount_NOT_EXIST")
        );
      }
  
      try {
        let data = await Discount.updateOne(
          {
            _id: req.params._id,
          },
          { is_deleted: 1 }
        );
  
        if (data == null) return res.notFound({}, req.__("Discount_NOT_EXIST"));
  
        return res.success(data, req.__("Discount_DELETE_SUCCESSFULLY"));
      } catch (err) {
        return res.json({ data: err });
      }
    }
  
    async UpdateStatus(req, res, next) {
      if (!req.params._id) {
        return res.notFound(
          {},
          req.__("INVALID_REQUEST"),
          req.__("Discount_NOT_EXIST")
        );
      }
  
      try {
        let data = await Discount.findOne({
          _id: req.params._id,
        });
        if (data == null) return res.notFound({}, req.__("Discount_NOT_EXIST"));
  
        let updatedData = await Discount.updateOne(
          {
            _id: req.params._id,
          },
          {
            $set: {
              status: data.status == 1 ? 0 : 1,
            },
          }
        );
  
        return res.success(data, req.__("Discount_STATUS_UPDATE_SUCCESSFULLY"));
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
          req.__("Discount_NOT_EXIST")
        );
      }
      let data = req.body;
      let { user } = req;
      try {
        user = await Discount.findOne({
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
  
        if (data == null) return res.notFound({}, req.__("Discount_NOT_EXIST"));
  
        await Discount.findOneAndUpdate({ _id: req.params._id }, { ...data });
  
        return res.success(data, req.__("Discount_UPDATE_SUCCESSFULLY"));
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
            Discount.find(
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
          return res.success(data, req.__("Discount_LIST_DONE"));
        }
      );
    }
  
//   async getAdminSetting(req, res) {
//     let adminSetting = await Discount.findOne();
//     const userJson = {};
//     if (adminSetting) {
//       userJson.distanceRadius = adminSetting.distanceRadius;
//       userJson.maximum = adminSetting.maximum;
//       userJson.minimum = adminSetting.minimum;
//     }
//     return res.success(userJson, req.__("SETTING_INFORMATION"));
//   }
   }
  
  module.exports = new UserController();
  