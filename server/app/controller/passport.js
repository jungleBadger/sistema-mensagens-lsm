"use strict";
/**
 * Passport internal controller
 * @ignore
 * */

const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const checkPassword = require("../helpers/user/userCommon").checkPassword;
const { retrieveByEmail, retrieveById } = require("../helpers/user/userCRUD");

passport.serializeUser(function (user, done) {
	done(null, user);
});

passport.deserializeUser(async function (profile, done) {
	if (profile.updated && (Date.now() - profile.updated < 90000)) {
		return done(null, profile);
	} else {
		try {
			let user = await retrieveById(
				profile.id,
				["ID", "ADMINISTRADOR", "EMAIL_CONFIRMADO"]
			);
			return done(null, {
				"id": user.ID,
				"isAdmin": user.ADMINISTRADOR,
				"isConfirmed": user.EMAIL_CONFIRMADO,
				"updated": Date.now()
			});
		} catch (e) {
			return done(e);
		}
	}
});

passport.use(
	"local",
	new LocalStrategy(
		{
			"usernameField": "email"
		},
		async (username, password, done) => {
			try {

				let user = await retrieveByEmail(
					username,
					["ID", "ADMINISTRADOR", "SENHA", "EMAIL_CONFIRMADO"]
				);

				return done(
					null,
					await checkPassword(username, password, user.SENHA) ?
						{
							"id": user.ID,
							"isAdmin": user.ADMINISTRADOR,
							"isConfirmed": user.EMAIL_CONFIRMADO,
							"updated": Date.now()
						} :
						false
				);

			} catch (e) {
				return done(e);
			}

		}
	)
);

module.exports = passport;