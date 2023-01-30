const {
    models: { User, OtherServices },
  } = require("../../../../lib/models");
  var slug = require("slug");
  const asyncParallel = require("async/parallel");
  var _ = require("lodash");
  const DATATABLE_DEFAULT_LIMIT = 10;
  const DATATABLE_DEFAULT_SKIP = 0;
  
  class UserController {
   
    async changepassword(req, res, next) {
        const { password, oldpassword, newpassword, confirmpassword } = req.body;
            if (!req.params._id) {
              return res.notFound(
                {},
                req.__("INVALID_REQUEST"),
                req.__("USER_NOT_EXIST")
              );
            }
            try {
                      let user = await User.findOne({
                        _id: req.params._id,
                        isDeleted: false,
                      });
                      if (!user) {
                        return res.badRequest({}, req.__("USER_NOT_EXISTS"));
                      }
                      const passwordMatched = await user.comparePassword(oldpassword);
                            if (!passwordMatched) {
                              return res.warn({}, req.__("CURRENT_PASSWORD_NOT_MATCH"));
                            }

                            user.newpassword = newpassword;

                            user.confirmpassword = confirmpassword;

                            if(newpassword != confirmpassword ){
                                return res.warn({}, req.__("CONFIRM_PASSWORD_NOT_MATCHED"))
                            }
                                  const userSave = await user.save();
                            
                                  if (!userSave) return res.badRequest({}, req.__("NOT_SAVED"));
                            
                                  res.success({}, req.__("PASSWORD_CHANGED"));
                                } catch (err) {
                                  return next(err);
                                }
                              }
                        }
  
                    module.exports = new UserController();
                    




