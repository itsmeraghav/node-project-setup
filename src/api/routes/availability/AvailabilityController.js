
const {
    models: { User, Availability },
  } = require("../../../../lib/models");
  var slug = require("slug");
  const multer = require("multer");
  const asyncParallel = require("async/parallel");
  var _ = require("lodash");
  const DATATABLE_DEFAULT_LIMIT = 10;
  const DATATABLE_DEFAULT_SKIP = 0;
 
  
  class UserController {
    async create(req, res, next) {
      let { user_id} = req.body;
      try {
        var newRecord = new Availability(req.body);
        // newRecord.slug = slug(name, {
        //   replacement: "-",
        //   lower: true,
        //   charmap: slug.charmap,
        // });
        return newRecord
          .save()
          .then((results) => {
            return res.success(results, req.__("Availability_CREATE_SUCCESSFULLY"));
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
            Availability.find(
              conditions,
              {
                // _id: 1,
                // name: 1,
                // status: 1,
                // is_edit: 1,
                // createdAt: 1,
                // updatedAt: 1,
              },
              { sort: { created_at: "desc" }, skip: skip, limit: limit })
              .populate("weekly_speciality","_id name availability")
              .populate("user_id","_id full_name ")
 


              .exec(
                (err, result) => {
                  callback(err, result);
                })
              ;
            },
          records_filtered: function(callback) {
            Availability.countDocuments(conditions, (err, result) => {
              /* send success response */
              callback(err, result);
            });
          },
          records_total: function(callback) {
            Availability.countDocuments({ is_deleted: 0 }, (err, result) => {
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
          return res.success(data, req.__("Availability_LIST_GENREATED"));
        }
      );
    }
  
    async detail(req, res, next) {
      if (!req.params._id) {
        return res.notFound(
          {},
          req.__("INVALID_REQUEST"),
          req.__("Availability_NOT_EXIST")
        );
      }
  
      try {
        let data = await Availability.findOne(
          {
            _id: req.params._id,
          },
          {
            _id: 1,
            name:1,
            designation:1,
            date:1,
            status: 1,
            is_edit: 1,
            updatedAt: 1,
            createdAt:1,
            // modified_at: 1,
          }
        );
        if (data == null) return res.notFound({}, req.__("Availability_NOT_EXIST"));
  
        return res.success(data, req.__("Availability_DETAIL_SUCCESSFULLY"));
      } catch (err) {
        return res.json({ data: err });
      }
    }
  
    async delete(req, res, next) {
      if (!req.params._id) {
        return res.notFound(
          {},
          req.__("INVALID_REQUEST"),
          req.__("Availability_NOT_EXIST")
        );
      }
  
      try {
        let data = await Availability.updateOne(
          {
            _id: req.params._id,
          },
          { is_deleted: 1 }
        );
  
        if (data == null) return res.notFound({}, req.__("Availability_NOT_EXIST"));
  
        return res.success(data, req.__("Availability_DELETE_SUCCESSFULLY"));
      } catch (err) {
        return res.json({ data: err });
      }
    }
  
    async UpdateStatus(req, res, next) {
      if (!req.params._id) {
        return res.notFound(
          {},
          req.__("INVALID_REQUEST"),
          req.__("Availability_NOT_EXIST")
        );
      }
  
      try {
        let data = await Availability.findOne({
          _id: req.params._id,
        });
        if (data == null) return res.notFound({}, req.__("Availability_NOT_EXIST"));
  
        let updatedData = await Availability.updateOne(
          {
            _id: req.params._id,
          },
          {
            $set: {
              status: data.status == 1 ? 0 : 1,
            },
          }
        );
  
        return res.success(data, req.__("Availability_STATUS_UPDATE_SUCCESSFULLY"));
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
          req.__("Availability_NOT_EXIST")
        );
      }
      let data = req.body;
      let { user } = req;
      try {
        user = await Availability.findOne({
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
  
        if (data == null) return res.notFound({}, req.__("Availability_NOT_EXIST"));
  
        await Availability.findOneAndUpdate({ _id: req.params._id }, { ...data });
  
        return res.success(data, req.__("Availability_UPDATE_SUCCESSFULLY"));
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
            Availability.find(
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
          return res.success(data, req.__("Availability_LIST_DONE"));
        }
      );
    }
  
//   async getAdminSetting(req, res) {
//     let adminSetting = await Availability.findOne();
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
  