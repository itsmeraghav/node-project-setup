const defaultImgSize = 2097152;
const UploadConfig = Object.freeze({
    PROFILE_IMAGE: {
        MAX_SIZE: parseInt(process.env.maxProfileImageSize || defaultImgSize),
        MAX_FILES: 1,
        LOCATION: 'user/profile',
        EXTENSION: 'jpg'
    },
    TOPIC_IMAGE: {
        MAX_SIZE: parseInt(process.env.maxProfileImageSize || defaultImgSize),
        MAX_FILES: 1,
        LOCATION: 'topics',
        EXTENSION: 'jpg'
    },
    TOPIC_ICON: {
        MAX_SIZE: parseInt(process.env.maxTopicIconSize || defaultImgSize),
        MAX_FILES: 1,
        LOCATION: 'topics',
        EXTENSION: 'jpg'
    },
    CHAT_IMAGE: {
        MAX_SIZE: parseInt(defaultImgSize),
        MAX_FILES: 1,
        LOCATION: 'chat',
        EXTENSION: 'jpg'
    },
});

module.exports = UploadConfig;