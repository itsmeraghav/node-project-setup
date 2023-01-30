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

// const addTopic = Joi.object().keys({
//     topicId: Joi.objectId()
//         .valid()
//         .required(),
//     subTopicId: Joi.objectId()
//         .valid()
//         .required(),
//     status: Joi.boolean()
//         .required(),
//     //.valid(['active', 'inactive']),
//     level: Joi.string()
//         .required()
//         .valid(['advanced', 'novice']),

// });


const updateProfile = Joi.object().keys({
    search_product: Joi.string().regex(/^[a-zA-Z][a-zA-Z ]*$/)
    .required(),
    product_title: Joi.string().regex(/^[a-zA-Z][a-zA-Z ]*$/)
    .required(),
    description: Joi.string().regex(/^[a-zA-Z][a-zA-Z ]*$/)
    .required(),
    tags: Joi.string()
    .required(),
    ingredients: Joi.string().regex(/^[a-zA-Z][a-zA-Z ]*$/)
    .required(),
    spice_level: Joi.string()
    .required(),
    product_photos: Joi.number()
    .required(),
    type: Joi.number()
    .required(),
    
    

});

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


const profileComplete = Joi.object().keys({
    notificationStatus: Joi.boolean().required()
});

module.exports = {

    createtype,



    // requireId,
    // updatePassword,
    // addTopic,
    updateProfile,
    // updateDestination,
    // getNearByList,
    // profileComplete
};
