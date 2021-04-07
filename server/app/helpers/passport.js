/**
 * Created by danielabrao on 5/20/17.
 **/
(function () {
	"use strict";
	/**
	 * Passport internal helper
	 * @ignore
	 * */
	const LocalStrategy = require("passport-local").Strategy;
	const security = require("./security");
	const passport = require("passport");


	module.exports = function (adminUser, platformUser, platformUsersAccountStatus, cloudFoundry, managedServiceInstances, watsonAssistantTokens) {

		passport.serializeUser(function (user, done) {
			done(null, user);
		});

		passport.deserializeUser(function (profile, done) {
			if (profile.updated && (Date.now() - profile.updated < 30000)) {
				return done(null, profile);
			} else {
				console.log(1)
				return done(null, profile);
			}

		});

		passport.use("admin-login", new LocalStrategy(
			function (username, password, done) {
				adminUser.queryAdminUser({
					"query": {
						"email": username,
						"role": "admin"
					},
					"projection": {
						"_id": 1,
						"password": 1,
						"role": 1,
						"email": 1,
						"name": 1

					},
					"strict": true
				}).then(user => {
					security.validateHash(
						password,
						user.password
					).then(() => {
						delete user.password;
						user.updated = Date.now();
						return done(null, user);
					}).catch(err => done(null, false, err))
				}).catch(err => done(null, false, err))
			}
		));


		passport.ensureAdminREST = (req, res, next) => {
			return req.user && req.user.role === "admin" ? next() : res.status(401).send("Not authorized");
		};

		passport.ensureAdmin = (req, res, next) => {
			return req.user && req.user.role === "admin" ? next() : res.redirect("/login");
		};

		return passport;
	};
}());