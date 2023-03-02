const { Joi, common } = require('../../util/validations');
const { languages } = require('../../../../lib/i18n');

const create = Joi.object().keys({
    name: Joi.string()
    .required(),
    });

     const updateMembership = Joi.object().keys({
        name: Joi.string()
    .optional(),
     });



module.exports = {
    // requireId,
       create,
       updateMembership,
    
};
