const jwt = require('jsonwebtoken');
const {
    models: { User, Vendor,Provider },
} = require('../../../lib/models');

const { getPlatform } = require('./common');

const signToken = (user, platform) => {
    const payload = {
        sub: user._id,
        aud: platform,
        iat: user.authTokenIssuedAt
    };
    return jwt.sign(payload, process.env.JWT_SECRET);
};

const signTempToken = (user, platform) => {
    const payload = {
        id: user._id,
        sub: user._id,
        aud: platform
    };
    return jwt.sign(payload, process.env.JWT_SECRET_TEMP);
};

const verifyToken = (req, res, next) => {
   
    jwt.verify(req.headers['authorization'], process.env.JWT_SECRET, async (err, decoded) => {
        const platform = req.headers['x-testing-platform'];
        if (err || !decoded || !decoded.sub || decoded.aud !== platform ) {
            return res.unauthorized({}, req.__('UNAUTHORIZED'));
        }
       
        const user = await User.findOne({
            _id: decoded.sub,
            isDeleted: false,
            authTokenIssuedAt: decoded.iat
        });
        
        if (!user) {
            return res.unauthorized({}, req.__('UNAUTHORIZED'));
        } else if(user && user.isSuspended) {
            return res.forceLogout({}, req.__('UNAUTHORIZED'));
        }
        
        req.user = user;
        next();
    });
}

// Need to create admin verify Token funcetion 



module.exports = {
    signToken,
    signTempToken,
    verifyToken
};
