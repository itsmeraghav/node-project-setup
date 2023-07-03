const {
    models: { User, AddCart },
  } = require("../../../../lib/models");
  // var slug = require("slug");
  const asyncParallel = require("async/parallel");
  var _ = require("lodash");
const mongoose = require("mongoose");
  const DATATABLE_DEFAULT_LIMIT = 10;
  const DATATABLE_DEFAULT_SKIP = 0;
  
  class UserController {
    async create(req, res, next) {
      let { email} = req.body;
      try {
        var newRecord = new AddCart(req.body);
       
        return newRecord
          .save()
          .then((results) => {
            return res.success(results, req.__("AddCart_CREATE_SUCCESSFULLY"));
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
       
        if (filterObj?.user_id) {
          conditions["user_id"] = filterObj?.user_id;
        }
        
      }
      asyncParallel(
        {
          data: function(callback) {
            AddCart.find(
              conditions,
              {
               
              },
              { sort: { created_at: "desc" }, skip: skip, limit: limit }
              ).populate("cart_item.dish_id",)
              .populate("user_id",)
              .exec(
                (err, result) => {
                  callback(err, result);
                })
                
              ;
            },
          records_filtered: function(callback) {
            AddCart.countDocuments(conditions, (err, result) => {
              /* send success response */
              callback(err, result);
            });
          },
          records_total: function(callback) {
            AddCart.countDocuments({ is_deleted: 0 }, (err, result) => {
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
          return res.success(data, req.__("AddCart_LIST_GENREATED"));
        }
      );
    }
  
    async detail(req, res, next) {
      if (!req.params.user_id) {
        return res.notFound(
          {},
          req.__("INVALID_REQUEST"),
          req.__("AddCart_NOT_EXIST")
        );
      }
  
      try {
        let data = await AddCart.findOne(
          {
            user_id: req.params.user_id,
          },
          {
            // _id: 1,
            // username: 1,
            // email:1,
            // contact_number:1,
            // gender:1,
            // zipcode:1,
            // country: 1,
            // state:1,
            // city:1,
            // address:1,
            // about_me:1,
            // ethnicity:1,
            // language:1,
            // select_cuisines_detail:1,
            // other_service_offered:1,
            // status: 1,
            // is_edit: 1,
            // updatedAt: 1,
            // createdAt:1,
            // modified_at: 1,
          }
          
        ) .populate("cart_item.dish_id",)
          .populate("user_id",)
           .exec()
        if (data == null) return res.notFound({}, req.__("AddCart_NOT_EXIST"));
  
        return res.success(data, req.__("AddCart_DETAIL_SUCCESSFULLY"));
      } catch (err) {
        return res.json({ data: err });
      }
    }
  
    async delete(req, res, next) {
      if (!req.params._id) {
        return res.notFound(
          {},
          req.__("INVALID_REQUEST"),
          req.__("AddCart_NOT_EXIST")
        );
      }
  
      try {
        let data = await AddCart.updateOne(
          {
            _id: req.params._id,
          },
          { is_deleted: 1 }
        );
  
        if (data == null) return res.notFound({}, req.__("AddCart_NOT_EXIST"));
  
        return res.success(data, req.__("AddCart_DELETE_SUCCESSFULLY"));
      } catch (err) {
        return res.json({ data: err });
      }
    }
  
    async UpdateStatus(req, res, next) {
      if (!req.params._id) {
        return res.notFound(
          {},
          req.__("INVALID_REQUEST"),
          req.__("AddCart_NOT_EXIST")
        );
      }
  
      try {
        let data = await AddCart.findOne({
          _id: req.params._id,
        });
        if (data == null) return res.notFound({}, req.__("AddCart_NOT_EXIST"));
  
        let updatedData = await AddCart.updateOne(
          {
            _id: req.params._id,
          },
          {
            $set: {
              status: data.status == 1 ? 0 : 1,
            },
          }
        );
  
        return res.success(data, req.__("AddCart_STATUS_UPDATE_SUCCESSFULLY"));
      } catch (err) {
        console.log("asdas", err);
        return res.json({ data: err });
      }
    }
  
    async update(req, res, next) {

      if (!req.body?.user_id || !req.body?.dish_id || !req.body?.quantity) {
        return res.notFound(
          {},
          req.__("INVALID_REQUEST"),
          req.__("AddCart_NOT_EXIST")
        );
      }
//update query array object
      let cartResult = await AddCart.findOne({user_id: req.body.user_id,"cart_item": {$elemMatch:{dish_id:mongoose.Types.ObjectId(req.body.dish_id) }}});

  
      //if no card data exist send error response
      if (!cartResult) {
        return res.notFound(
          {},
          req.__("INVALID_REQUEST"),
          req.__("CART_NOT_EXIST")
        );
      };
//
      // Now update the Quantity;
      let updatecart = await AddCart.updateOne({user_id: req.body.user_id,"cart_item":{$elemMatch:{dish_id:mongoose.Types.ObjectId(req.body.dish_id) }}},{ $set: { "cart_item.$.quantity": req.body.quantity } });
      return res.success(updatecart, req.__("AddCart_UPDATE_SUCCESSFULLY"));
    }
  
    async dropdown(req, res, next) {
      /** Filteration value */
  
      var conditions = { is_deleted: 0, status: 1 };
      asyncParallel(
        {
          data: function(callback) {
            AddCart.find(
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
          return res.success(data, req.__("AddCart_LIST_DONE"));
        }
      );
    }
  

   }
  
  module.exports = new UserController();
  