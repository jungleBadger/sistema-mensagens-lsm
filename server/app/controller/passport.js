"use strict";
/**
 * Passport internal controller
 * @ignore
 * */

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const checkPassword = require("../helpers/user/userCommon").checkPassword;
const userCRUD = require("../helpers/user/userCRUD");
const { retrieveAccountProviderIdByName, retrieveLinkedAccount, linkAccount } = require("../helpers/user/thirdPartyAccount");
const SessionUser = require("../models/SessionUser");
const { generateHash } = require("../helpers/security");
const googleAuthConfigs = require("../configs/google-auth-configs");


passport.serializeUser(function (user, done) {
	done(null, user);
});

passport.deserializeUser(async function (req, profile, done) {

	if (profile.updated && (Date.now() - profile.updated < 90000)) {
		return done(null, profile);
	} else {
		try {
			let user = await userCRUD.retrieveById(
				profile.id,
				["ID", "ADMINISTRADOR", "EMAIL_CONFIRMADO"]
			);
			return done(
				null,
				new SessionUser(
					user.ID,
					user.ADMINISTRADOR,
					user.EMAIL_CONFIRMADO
				)
			);
		} catch (e) {
			req.logout();
			req.session = null;
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

				let user = await userCRUD.retrieveByEmail(
					username,
					["ID", "ADMINISTRADOR", "SENHA", "EMAIL_CONFIRMADO"]
				);

				return done(
					null,
					await checkPassword(username, password, user.SENHA) ?
						new SessionUser(
							user.ID,
							user.ADMINISTRADOR,
							user.EMAIL_CONFIRMADO
						) :
						false
				);

			} catch (e) {
				return done(e);
			}

		}
	)
);

passport.use(
	"google",
	new GoogleStrategy(
		googleAuthConfigs,
		async (req, accessToken, refreshToken, profile, done) => {

			let requestAction = req.session.requestAction;
			let providerEmail = profile._json.email;
			let displayName = profile.displayName || profile._json.name;
			let pictureURL = profile._json.picture;
			req.session.requestAction = undefined;

			let [mainAccountUser, linkedAccount] = await Promise.all([
				userCRUD.retrieveByEmail(
					providerEmail,
					["ID", "ADMINISTRADOR", "EMAIL_CONFIRMADO"],
					true
				),
				retrieveLinkedAccount(
					await retrieveAccountProviderIdByName("google-oauth-2"),
					profile._json.email,
					true
				)
			]);


			if (requestAction === "signup") {

				// @SECTION Google signup

				if (linkedAccount) {

					// Account already linked to another account - 409 error
					return done(
						{
							"status": 409,
							"message": "Account already linked.",
							"redirect": "/auth/signup"
						}
					);

				} else if (mainAccountUser && !linkedAccount) {
					// Account already exists as main - link accounts
					try {
						await linkAccount(
							mainAccountUser.ID,
							1,
							providerEmail,
							pictureURL
						);
					} catch (e) {
						return done(
							{
								"status": e.status || 500,
								"message": e.message || e || "Unknown error",
								"redirect": "/auth/signup"
							}
						);
					}

					return done(
						null,
						new SessionUser(
							mainAccountUser.ID,
							mainAccountUser.ADMINISTRADOR,
							mainAccountUser.EMAIL_CONFIRMADO
						)
					);


				} else if (!mainAccountUser && !linkedAccount) {

					// Account do not exist
					// Create main account
					// link account

					try {
						let newUser = await userCRUD.create(
							providerEmail,
							await generateHash(Date.now() + "lsm"),
							displayName
						);

						await linkAccount(
							newUser.ID,
							1,
							providerEmail,
							pictureURL
						);

						await userCRUD.updateAccountConfirmation(
							providerEmail
						);

						return done(
							null,
							new SessionUser(
								newUser.ID,
								false,
								true
							)
						);



					} catch (e) {
						return done(
							{
								"status": e.status || 500,
								"message": e.message || e || "Unknown error",
								"redirect": "/auth/signup"
							}
						);
					}
				}



			} else {

				// @SECTION Google login

				if (mainAccountUser && linkedAccount) {
					// Account is linked - grab main account user info and return success

					return done(
						null,
						new SessionUser(
							mainAccountUser.ID,
							mainAccountUser.ADMINISTRADOR,
							mainAccountUser.EMAIL_CONFIRMADO
						)
					);

				} else if (mainAccountUser && !linkedAccount) {

					// Account not linked - link accounts and return success
					await linkAccount(
						mainAccountUser.ID,
						1,
						providerEmail,
						pictureURL
					);

					return done(
						null,
						new SessionUser(
							mainAccountUser.ID,
							mainAccountUser.ADMINISTRADOR,
							mainAccountUser.EMAIL_CONFIRMADO
						)
					);


				} else {
					// Account does not exist - 404 error
					return done(
						{
							"status": 404,
							"message": "Account does not exist.",
							"redirect": "/auth/login"
						}
					);
				}
			}
		}
	)
);

module.exports = passport;