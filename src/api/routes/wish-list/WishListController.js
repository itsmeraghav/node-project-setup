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
  }
  module.exports = new UserController();
  