const passportJWT = require("passport-jwt");
const mongoose = require("mongoose");

const JWTStrategy = passportJWT.Strategy;
const { ExtractJwt } = passportJWT;
const Admins = mongoose.model("Admins");

const { jwtSecret } = require("./keys");

module.exports = new JWTStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken("jwt"),
    secretOrKey: jwtSecret,
  },
  (jwtPayload, done) => {
    Admins.findOne({ _id: jwtPayload.user._id }, (err, user) => {
      if (err) {
        return done(true, null);
      } else {
        return done(false, user);
      }
    });
  }
);
