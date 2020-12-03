"use strict";

/*
 * Module dependencies.
 */

const mongoose = require("mongoose");
const jwt = require("./config/passportJWT");

const Admins = mongoose.model("Admins");

/**
 * Expose
 */

module.exports = function (passport) {
  // serialize and deserialize sessions
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => Admins.findOne({ _id: id }, done));

  // use these strategies
  passport.use(jwt);
};
