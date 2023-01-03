require("dotenv/config");
const passport = require("passport");
const { User } = require("../../schemas/user");
const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;

// Set up the JWT strategy
passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.ACCESS_TOKEN,
    },
    function (jwtPayload, cb) {
      // Find the user in the database based on the JWT payload
      User.find({ Email: jwtPayload.Email }, function (err, user, info) {
        if (err) {
          return cb(err);
        }
        if (!user) {
          return cb(null, false);
        }
        return cb(null, user);
      });
    }
  )
);
