const { Joi, common } = require('../../util/validations');
const { languages } = require('../../../../lib/i18n');

const requireId = Joi.object().keys({
    id: Joi.objectId()
        .valid()
        .optional().allow('')
});

const createtype = Joi.object().keys({
    //newPassword: common.password,
    search_product: Joi.string().regex(/^[a-zA-Z][a-zA-Z ]*$/)
    .required(),
        description: Joi.string().regex(/^[a-zA-Z][a-zA-Z ]*$/)
        // .alphanum()
        .required()
       
});








module.exports = {

    createtype,
    

};
