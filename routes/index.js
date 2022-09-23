var router = require('express').Router();

module.exports = function() {
    router.use('/api', require('./api')());
    return router;
}
