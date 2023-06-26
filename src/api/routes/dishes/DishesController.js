const {
    models: { User, Dishes,MasterTable },
  } = require("../../../../lib/models");
  var slug = require("slug");
  const asyncParallel = require("async/parallel");
  var _ = require("lodash");
  const DATATABLE_DEFAULT_LIMIT = 10;
  const DATATABLE_DEFAULT_SKIP = 0;
  
  class UserController {
    async create(req, res, next) {
      let { dish_title } = req.body;
      try {
        var newRecord = new Dishes(req.body);
        // newRecord.slug = slug(dish_title, {
        //   replacement: "-",
        //   lower: true,
        //   charmap: slug.charmap,
        // })
        return newRecord
          .save()
          .then((results) => {
            return res.success(results, req.__("Dishes_CREATE_SUCCESSFULLY"));

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
      var conditions = { isDeleted: false };
      let filterObj = req.body.filter ? req.body.filter : null;
      if (filterObj) {
        //apply filter 
        if (filterObj?. dish_title) {
          conditions["dish_title"] = filterObj?. dish_title;
        }     
        if (filterObj?. spice_level) {
          conditions["spice_level"] = filterObj?. spice_level;
        }
        if (filterObj?. food_type) {
          conditions["food_type"] = filterObj?. food_type;
        }
        if (filterObj?. cuisine_type) {
          conditions["cuisine_type"] = filterObj?. cuisine_type;
        }
        if (filterObj?.cost) {
          conditions["cost"] = filterObj?.cost;
        }
        if (filterObj?.user_id) {
          conditions["user_id"] = filterObj?.user_id;
        }
        if (filterObj?.today_speciality) {
          conditions["today_speciality"] = filterObj?.today_speciality;
        }
        if (filterObj?.weekly_speciality) {
          conditions["weekly_speciality"] = filterObj?.weekly_speciality;
        }
      }

      asyncParallel(
        {
          data: function(callback) {
            Dishes.find(
              conditions,
              {
               
              },
              { sort: { created_at: "desc" }, skip: skip, limit: limit }
              ).populate("spice_level","_id name")
              .populate("cuisine_type","_id name")
              .populate("food_type","_id name")
              .populate("sample_interval","_id name")
              .populate("weekly_speciality","_id name")
              .populate("discount_type","_id name")
              .populate("user_id","_id full_name")
              .exec(
                (err, result) => {
                  callback(err, result);
                })
              ;
            },
          records_filtered: function(callback) {
            Dishes.countDocuments(conditions, (err, result) => {
              /* send success response */
              callback(err, result);
            });
          },
          records_total: function(callback) {
            Dishes.countDocuments({ is_deleted: 0 }, (err, result) => {
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
          return res.success(data, req.__("Dishes_LIST_GENREATED"));
        }
      );
    }

    async detail(req, res, next) {
      if (!req.params._id) {
        return res.notFound(
          {},
          req.__("INVALID_REQUEST"),
          req.__("Dishes_NOT_EXIST")
        );
      }
  
      try {
        let data = await Dishes.findOne(
          {
            _id: req.params._id,
          }
          ,
      
          {
            // _id: 0,
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
            
          }
       
        ) .populate("spice_level","_id name")
        .populate("cuisine_type","_id name")
        .populate("food_type","_id name")
        .populate("sample_interval","_id name")
        .populate("weekly_speciality","_id name")
        .populate("discount_type","_id name")
        .populate("user_id","_id full_name")
        .exec()
        if (data == null) return res.notFound({}, req.__("Dishes_NOT_EXIST"));
  
        return res.success(data, req.__("Dishes_DETAIL_SUCCESSFULLY"));
      } catch (err) {
        return res.json({ data: err });
      }
    }
  

    async delete(req, res, next) {
      if (!req.params._id) {
        return res.notFound(
          {},
          req.__("INVALID_REQUEST"),
          req.__("Dishes_NOT_EXIST")
        );
      }
  
      try {
        let data = await Dishes.updateOne(
          {
            _id: req.params._id,
          },
          {isDeleted: true }
        );
  
        if (data == null) return res.notFound({}, req.__("Dishes_NOT_EXIST"));
  
        return res.success(data, req.__("Dishes_DELETE_SUCCESSFULLY"));
      } catch (err) {
        return res.json({ data: err });
      }
    }

    async UpdateStatus(req, res, next) {
      if (!req.params._id) {
        return res.notFound(
          {},
          req.__("INVALID_REQUEST"),
          req.__("Dishes_NOT_EXIST")
        );
      }
  
      try {
        let data = await Dishes.findOne({
          _id: req.params._id,
        });
        if (data == null) return res.notFound({}, req.__("Dishes_NOT_EXIST"));
  
        let updatedData = await Dishes.updateOne(
          {
            _id: req.params._id,
          },
          {
            $set: {
              status: data.status == 1 ? 0 : 1,
            },
          }
        );
  
        return res.success(data, req.__("Dishes_STATUS_UPDATE_SUCCESSFULLY"));
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
          req.__("Dishes_NOT_EXIST")
        );
      }
      let data = req.body;
      let { user } = req;
      try {
        user = await Dishes.findOne({
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
  
        if (user.isSuspended) {
          return res.notFound(
            "",
            req.__("YOUR_ACCOUNT_SUSPENDED"),
            req.__("ACCOUNT_SUSPENDED")
          );
        }
  
        if (data == null) return res.notFound({}, req.__("Dishes_NOT_EXIST"));
  
        await Dishes.findOneAndUpdate({ _id: req.params._id }, { ...data });
  
        return res.success(data, req.__("Dishes_UPDATE_SUCCESSFULLY"));
      } catch (err) {
        return res.json({ data: err });
      }
    }

    async dropdown(req, res, next) {
      /** Filteration value */
  
      var conditions = { isDeleted: 0, status: 1 };
      asyncParallel(
        {
          data: function(callback) {
            Dishes.find(
              conditions,
               {
                _id: 0,
            dish_title:1,
            description: 1,
            ingredients:1,
            tags:1,
            preparation_time:1,
            dish_photo:1,
            cost:1,
            status: 1,
            is_edit: 1,
            slug: 1,
            createdAt: 1,
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
          return res.success(data, req.__("Dishes_LIST_DONE"));
        }
      );
    }
    
  }
  
  module.exports = new UserController();
  