const { Joi, common } = require('../../util/validations');
const { languages } = require('../../../../lib/i18n');

const create = Joi.object().keys({
    name: Joi.string() .required(),
    description: Joi.string() .required(),
    duration: Joi.date() .required(),

    features: Joi.string() .required(),

    price: Joi.number() .required(),
    bidding: Joi.number() .required(),
    featured_membership: Joi.number() .required(),

    });
    
    


     const updateMembership = Joi.object().keys({
        name: Joi.string() .optional(),
        description: Joi.string() .optional(),
        duration: Joi.date() .optional(),
    
        features: Joi.string() .optional(),
    
        price: Joi.number() .optional(),
        bidding: Joi.number() .optional(),
        featured_membership: Joi.number() .optional(),
    

     });

module.exports = {
       create,
       updateMembership,
    
};
