//authentication
const jwt = require("jsonwebtoken");

function validToken(req, res, next) {
  // remove below two comments to check from frontend

  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

//   const token = req.headers["x-access-token"];

  if (token == null) {
    res.sendStatus(400).send("Token Isn't Present");
    return;
  } else
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        res.status(400).send("Token Invalid");
        return;
      } else {
        req.user = user;
        next();
      }
    });
}

module.exports = validToken;
