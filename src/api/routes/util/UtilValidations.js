const { Joi, patterns } = require("../../util/validations");

const uploadFile = Joi.object().keys({
  files: Joi.object({
    filename: Joi.string().required(),
    path: Joi.string().required(),
    headers: Joi.object({
      "content-disposition": Joi.string().required(),
      "content-type": Joi.string()
        .valid(["image/jpeg"])
        .required(),
    }).required(),
    bytes: Joi.number().required(),
  }),
});

module.exports = {
  uploadFile,
};
