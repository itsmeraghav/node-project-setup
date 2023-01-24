const {
    models: { User, MasterTable },
  } = require("../../../../lib/models");
  var slug = require("slug");
  const asyncParallel = require("async/parallel");
  var _ = require("lodash");
  const DATATABLE_DEFAULT_LIMIT = 10;
  const DATATABLE_DEFAULT_SKIP = 0;
  
  class UserController {
    async create(req, res, next) {
      let { title} = req.body;
      try {
        var newRecord = new MasterTable(req.body);
        newRecord.slug = slug(title, {
          replacement: "-",
          lower: true,
          charmap: slug.charmap,
        });
        return newRecord
          .save()
          .then((results) => {
            return res.success(results, req.__("MasterTable_CREATE_SUCCESSFULLY"));
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
            MasterTable.find(
              conditions,
              {
                _id: 1,
                title: 1,
                status: 1,
                is_edit: 1,
                slug: 1,
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
            MasterTable.countDocuments(conditions, (err, result) => {
              /* send success response */
              callback(err, result);
            });
          },
          records_total: function(callback) {
            MasterTable.countDocuments({ is_deleted: 0 }, (err, result) => {
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
          return res.success(data, req.__("MasterTable_LIST_GENREATED"));
        }
      );
    }
  
    async detail(req, res, next) {
      if (!req.params.slug) {
        return res.notFound(
          {},
          req.__("INVALID_REQUEST"),
          req.__("MasterTable_NOT_EXIST")
        );
      }
  
      try {
        let data = await MasterTable.findOne(
          {
            slug: req.params.slug,
          },
          {
            _id: 0,
            title: 1,
            status: 1,
            is_edit: 1,
            slug: 1,
            // created_at: 1,
            // modified_at: 1,
          }
        );
        if (data == null) return res.notFound({}, req.__("MasterTable_NOT_EXIST"));
  
        return res.success(data, req.__("MasterTable_DETAIL_SUCCESSFULLY"));
      } catch (err) {
        return res.json({ data: err });
      }
    }
  
    async delete(req, res, next) {
      if (!req.params.slug) {
        return res.notFound(
          {},
          req.__("INVALID_REQUEST"),
          req.__("MasterTable_NOT_EXIST")
        );
      }
  
      try {
        let data = await MasterTable.updateOne(
          {
            slug: req.params.slug,
          },
          { is_deleted: 1 }
        );
  
        if (data == null) return res.notFound({}, req.__("MasterTable_NOT_EXIST"));
  
        return res.success(data, req.__("MasterTable_DELETE_SUCCESSFULLY"));
      } catch (err) {
        return res.json({ data: err });
      }
    }
  
    async UpdateStatus(req, res, next) {
      if (!req.params.slug) {
        return res.notFound(
          {},
          req.__("INVALID_REQUEST"),
          req.__("MasterTable_NOT_EXIST")
        );
      }
  
      try {
        let data = await MasterTable.findOne({
          slug: req.params.slug,
        });
        if (data == null) return res.notFound({}, req.__("MasterTable_NOT_EXIST"));
  
        let updatedData = await MasterTable.updateOne(
          {
            slug: req.params.slug,
          },
          {
            $set: {
              status: data.status == 1 ? 0 : 1,
            },
          }
        );
  
        return res.success(data, req.__("MasterTable_STATUS_UPDATE_SUCCESSFULLY"));
      } catch (err) {
        console.log("asdas", err);
        return res.json({ data: err });
      }
    }
  
    async update(req, res, next) {
      if (!req.params.slug) {
        return res.notFound(
          {},
          req.__("INVALID_REQUEST"),
          req.__("MasterTable_NOT_EXIST")
        );
      }
      let data = req.body;
      let { user } = req;
      try {
        user = await MasterTable.findOne({
          slug: req.params.slug,
          // is_deleted: 0,
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
  
        if (data == null) return res.notFound({}, req.__("MasterTable_NOT_EXIST"));
  
        await MasterTable.findOneAndUpdate({ slug: req.params.slug }, { ...data });
  
        return res.success(data, req.__("MasterTable_UPDATE_SUCCESSFULLY"));
      } catch (err) {
        return res.json({ data: err });
      }
    }
  
    async listAll(req, res, next) {
      /** Filteration value */
  
      var conditions = { is_deleted: 0, status: 1 };
      asyncParallel(
        {
          data: function(callback) {
            MasterTable.find(
              conditions,
              {
                _id: 1,
                title: 1,
                status: 1,
                is_edit: 1,
                slug: 1,
                // created_at: 1,
                // modified_at: 1,
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
          return res.success(data, req.__("MasterTable_LIST_DONE"));
        }
      );
    }
  
    async getAdminSetting(req, res) {
      let adminSetting = await MasterTable.findOne();
      const userJson = {};
      if (adminSetting) {
        userJson.distanceRadius = adminSetting.distanceRadius;
        userJson.maximum = adminSetting.maximum;
        userJson.minimum = adminSetting.minimum;
      }
      return res.success(userJson, req.__("SETTING_INFORMATION"));
    }
  }
  
  module.exports = new UserController();
  