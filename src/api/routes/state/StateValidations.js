const { Joi, common } = require('../../util/validations');
const { languages } = require('../../../../lib/i18n');

const create = Joi.object().keys({
    name: Joi.string().regex(/^[a-zA-Z][a-zA-Z ]*$/)
    .required(),
    country: Joi.string().required(),
    });



// const requireId = Joi.object().keys({
//     id: Joi.objectId()
//         .valid()
//         .optional().allow('')
// });




     const updateState = Joi.object().keys({
       name: Joi.string().regex(/^[a-zA-Z][a-zA-Z ]*$/)
    .optional(),


     });


// con
// const updateDestination = Joi.object().keys({
//     latitude: Joi.number()
//         .required(),
//     longitude: Joi.number()
//         .required(),
//     deviceTime: Joi.number()
//         .optional(),
//     placemark: Joi.string()
//         .required(),
//     address: Joi.string()
//         .required(),
//     locationSharing: Joi.boolean()
//         .required()
// });

// const getNearByList = Joi.object().keys({
//     latitude: Joi.number()
//         .required(),
//     longitude: Joi.number()
//         .required(),
//     radius: Joi.number()
//         .required()
// });


// const profileComplete = Joi.object().keys({
//     notificationStatus: Joi.boolean().required()
// });

module.exports = {
    // requireId,
       create,
     updateState,
    // updateDestination,
    // getNearByList,
    // profileComplete
};
