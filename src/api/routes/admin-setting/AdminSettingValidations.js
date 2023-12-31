const { Joi, common } = require('../../util/validations');
const { languages } = require('../../../../lib/i18n');

const requireId = Joi.object().keys({
    id: Joi.objectId()
        .valid()
        .optional().allow('')
});

const updatePassword = Joi.object().keys({
    currentPassword: Joi.string().required(),
    //newPassword: common.password,
    newPassword: Joi.string()
        .min(8)
        .max(20)
        .required(),
    confirmPassword: Joi.string()
        .required()
        .valid(Joi.ref('newPassword'))
        .error(([error]) => {
            const { locale } = error.options;
            const language = languages[locale];
            return {
                message: language.validation.custom.sameAs(error.context.key, 'newPassword'),
            };
        }),
});

const addTopic = Joi.object().keys({
    topicId: Joi.objectId()
        .valid()
        .required(),
    subTopicId: Joi.objectId()
        .valid()
        .required(),
    status: Joi.boolean()
        .required(),
    //.valid(['active', 'inactive']),
    level: Joi.string()
        .required()
        .valid(['advanced', 'novice']),

});


const updateProfile = Joi.object().keys({
    name: Joi.string()
        .required()

});

const updateDestination = Joi.object().keys({
    latitude: Joi.number()
        .required(),
    longitude: Joi.number()
        .required(),
    deviceTime: Joi.number()
        .optional(),
    placemark: Joi.string()
        .required(),
    address: Joi.string()
        .required(),
    locationSharing: Joi.boolean()
        .required()
});

const getNearByList = Joi.object().keys({
    latitude: Joi.number()
        .required(),
    longitude: Joi.number()
        .required(),
    radius: Joi.number()
        .required()
});


const profileComplete = Joi.object().keys({
    notificationStatus: Joi.boolean().required()
});

module.exports = {
    requireId,
    updatePassword,
    addTopic,
    updateProfile,
    updateDestination,
    getNearByList,
    profileComplete
};
