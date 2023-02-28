const HttpResponseCode = {
    OK: 200,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    FORCE_UPDATE: 426,
    FORCE_LOGOUT: 440,
    SERVER_ERROR: 500,
    SERVER_MAINTAINANCE: 503,
    
};

const Response = {
    success(data = null, message = '', title = '') {
        this.status(HttpResponseCode.OK).send({
            success: true,
            data,
            message,
            title
        });
    },
    warn(data = null, message = '', title = '') {
        this.status(HttpResponseCode.OK).send({
            success: false,
            data,
            message,
            title
        });
    },
    badRequest(data = null, message = '',  title = '') {
        this.status(HttpResponseCode.BAD_REQUEST).send({
            success: false,
            data,
            message,
            title
        });
    },
    unauthorized(data = null, message = '',  title = '') {
        this.status(HttpResponseCode.UNAUTHORIZED).send({
            success: false,
            data,
            message,
            title
        });
    },
    forbidden(data = null, message = '',  title = '') {
        this.status(HttpResponseCode.FORBIDDEN).send({
            success: false,
            data,
            message,
            title
        });
    },
    notFound(data = null, message = '',  title = '') {
        this.status(HttpResponseCode.NOT_FOUND).send({
            success: false,
            data,
            message,
            title
        });
    },
    forceUpdate(data = null, message = '',  title = '') {
        this.status(HttpResponseCode.FORCE_UPDATE).send({
            success: false,
            data,
            message,
            title
        });
    },
    forceLogout(data = null, message = '',  title = '') {
        this.status(HttpResponseCode.FORCE_LOGOUT).send({
            success: false,
            data,
            message,
            title
        });
    },
    maintainance(data = null, message = '',  title = '') {
        this.status(HttpResponseCode.SERVER_MAINTAINANCE).send({
            success: false,
            data,
            message,
            title
        });
    },
    serverError(data = null, message = '',  title = '', /** @type Error */ err = null) {
        // eslint-disable-next-line no-console
        if (err) console.error('Server-Error: ', err);
        this.status(HttpResponseCode.SERVER_ERROR).send({
            success: false,
            data,
            message,
            title
        });
    }
};

module.exports.HttpResponseCode = HttpResponseCode;
module.exports.Response = Response;
