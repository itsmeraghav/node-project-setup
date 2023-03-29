const { Joi, common } = require('../../util/validations');
const { languages } = require('../../../../lib/i18n');

const create = Joi.object().keys({
    name: Joi.string() .required(),
    description: Joi.string() .required(),
    duration: Joi.date() .required(),
    features: Joi.array() .required(),
    price: Joi.number() .required(),
    bidding: Joi.number() .required(),
   
    singup_features: Joi.array() .required(),
   });
    

     const updateMembership = Joi.object().keys({
        name: Joi.string() .optional(),
        description: Joi.string() .optional(),
        duration: Joi.date() .optional(),
        features: Joi.array() .optional(),
        price: Joi.number() .optional(),
        bidding: Joi.number() .optional(),
        
        singup_features: Joi.array() .optional(),


     });

module.exports = {
       create,
       updateMembership,
    
};
