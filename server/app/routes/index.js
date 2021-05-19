"use strict";

const swaggerJSDoc = require("swagger-jsdoc")(require("../configs/swagger-integration"));
const handleExpressError = require("../helpers/errorHandler").handleExpressError;

const adminHandler = require("./partials/admin/_index");
const authHandler = require("./partials/auth/_index");
const brotherHandler = require("./partials/brother/_index");
const categoryHandler = require("./partials/category/_index");
const eventHandler = require("./partials/event/_index");
const googleHandler = require("./partials/google/_index");
const mainHandler = require("./partials/mainHandler");
const regularUserHandler = require("./partials/user/_index");
const locationHandler = require("./partials/location/_index");
const logsHandler = require("./partials/logs/_index");

module.exports = function (app) {
    app.get("/api-docs.json", function (req, res) {
        res.setHeader("Content-Type", "application/json");
        return res.send(swaggerJSDoc);
    });

    app.get(["/google4aa023a715102fc5", "/google4aa023a715102fc5.html"], (req, res) => {
    	return res.status(200).render("./_etc/google4aa023a715102fc5.html");
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
		brotherHandler
	);

	app.use(
		categoryHandler
	);

	app.use(
		eventHandler
	);

	app.use(
		googleHandler
	);

	app.use(
		regularUserHandler
	);

	app.use(
		locationHandler
	);

	app.use(
		logsHandler
	);

    app.use(
    	"/app",
		mainHandler
	);



	app.use((err, req, res, next) => {
		return err ? handleExpressError(err, res) : next()
	});

}

