const jwt = require("jsonwebtoken");
require("dotenv/config");
const Logger = require("../../logger/index");

const authentication = (req, res, next) => {
  if (
    req.headers === undefined ||
    req.headers === null ||
    req.headers["authorization"] === undefined ||
    req.headers["authorization"] === null
  ) {
    return res.status(403).send({
      error: true,
      message: "authorization not found!",
    });
  }
  const authHeader = req.headers["authorization"];
  const token = authHeader.split(" ");
  let bearerToken = token[1];
  if (bearerToken) {
    jwt.verify(bearerToken, process.env.ACCESS_TOKEN, (err, user) => {
      if (err)
        return res.status(401).send({
          error: true,
          message: "Token Not Valid!",
        });
      req.user = user;
      next();
    });
  } else {
    return res.status(403).send({
      error: true,
      message: "authorization not found!!!",
    });
  }
};

module.exports = authentication;
