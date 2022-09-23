const { expressjwt: jwt } = require('express-jwt');
var secret = require('../config').secret;

function getTokenFromHeader(req) {
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token' ||
    req.headers.authorization && req.headers.authorization.split(' ')[0] === 'PMTC') {
    return req.headers.authorization.split(' ')[1];
  }

  return null;
}

var auth = { 
  required: jwt({
    secret: secret,
    algorithms: ['HS256'],
    requestProperty: 'payload',
    credentialsRequired: true,
    getToken: getTokenFromHeader
  }),
  optional: jwt({
    secret: secret,
    algorithms: ['HS256'],
    requestProperty: 'payload',
    credentialsRequired: true,
    getToken: getTokenFromHeader
  })
};

module.exports = auth;
