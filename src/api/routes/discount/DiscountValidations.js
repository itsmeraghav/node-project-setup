const { Joi, common } = require('../../util/validations');
const { languages } = require('../../../../lib/i18n');

const create = Joi.object().keys({
    search_dish: Joi.string().regex(/^[a-zA-Z][a-zA-Z ]*$/)
    .required(),
    });

     const updateDiscount = Joi.object().keys({
       search_dish: Joi.string().regex(/^[a-zA-Z][a-zA-Z ]*$/)
    .optional(),
     });




module.exports = {
       create,
     updateDiscount,
   
};
