const jwt = require("jsonwebtoken");
const randomstring = require("randomstring");

const getPlatform = (req) => req.headers["x-testing-platform"];
const getLanguage = (req) => req.headers["accept-language"];
const generateToken = (payload) => jwt.sign(payload, process.env.JWT_SECRET);

const randomAlphabetic = (length) => {
  return randomstring.generate({
    length: length,
    charset: "alphabetic",
  });
};

const randomNumeric = (length) => {
  return randomstring.generate({
    length: length,
    charset: "numeric",
  });
};
const randomuniqe = (length) => {
  return randomstring.generate({
    length: length,
    charset: "numeric",
  });
};

module.exports = {
  getPlatform,
  getLanguage,
  generateToken,
  randomAlphabetic,
  randomNumeric,
  randomuniqe,
};
