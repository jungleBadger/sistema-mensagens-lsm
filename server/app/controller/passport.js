"use strict";
/**
 * Passport internal controller
 * @ignore
 * */

const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;

module.exports = function (ssoConfigs) {
	passport.serializeUser(function (user, done) {
		done(null, user);
	});

	passport.deserializeUser(async function (profile, done) {
		if (profile.updated && (Date.now() - profile.updated < 90000)) {
			return done(null, profile);
		} else {
			// fetch user profile and revalidate it
			profile.updated = Date.now();
			return done(null, profile);
		}
	});

	passport.use(
		"regular",
		new LocalStrategy(
			(username, password, callback) => {

			}
		)
	);


	return passport;
};