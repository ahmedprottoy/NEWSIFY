// authentication
const jwt = require("jsonwebtoken");

function validToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader.split(" ")[1];

  if (token == null) res.sendStatus(400).send("Token Isnt Present");
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      res.status(400).send("Token Invalid");
    } else {
      req.user = user;
      next();
    }
  });
}

module.exports = validToken;
