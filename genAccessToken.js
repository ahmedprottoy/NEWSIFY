const jwt = require("jsonwebtoken");

function generateAccessToken(userName) {
  return jwt.sign(userName, process.env.ACCESS_TOKEN_SECRET, {});
}

module.exports = generateAccessToken;
