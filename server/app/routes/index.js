"use strict";

const swaggerJSDoc = require("swagger-jsdoc")(require("../configs/swagger-integration"));
const handleExpressError = require("../helpers/errorHandler").handleExpressError;

const adminHandler = require("./partials/admin/_index");
const authHandler = require("./partials/auth/_index");
const googleHandler = require("./partials/google/_index");
const mainHandler = require("./partials/mainHandler");
const regularUserHandler = require("./partials/user/_index");

module.exports = function (app) {
    app.get("/api-docs.json", function (req, res) {
        res.setHeader("Content-Type", "application/json");
        return res.send(swaggerJSDoc);
    });

    app.get("/", (req, res) => {
    	return res.redirect("/app");
	});

    app.use(
    	adminHandler
	);

	app.use(
		authHandler
	);

	app.use(
		googleHandler
	);

	app.use(
		regularUserHandler
	);

    app.use(
    	"/app",
		mainHandler
	);

	app.use((err, req, res, next) => err ? handleExpressError(err, res) : next());

}

