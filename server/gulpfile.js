/*jslint node: true, nomen:true*/
/*env:node*/
(function () {
	"use strict";
	require("dotenv").config({"silent": true});
	const gulp = require("gulp");
	const argv = require("yargs").argv;
	const fse = require("fs-extra");
	const path = require("path");
	const log = require("fancy-log");
	const jsdoc = require("gulp-jsdoc3");
	const colors = require("ansi-colors");
	const replace = require("replace");
	const swagger = require("swagger-ui-dist");

	process.env.NODE_ENV = argv.prod ? "production" : "development";

	log(`STARTING GULP TASK AT ENVIRONMENT: ${process.env.NODE_ENV}`);

	gulp.task("generate-js-doc", function (cb) {
		let config = require("./jsdoc-config.json");
		gulp.src(["README.md", "app/**/*.js"], {read: false})
			.pipe(jsdoc(config, cb));
	});

	gulp.task("generate-swagger-doc", function (done) {
		const swaggerUiAssetPath = swagger.absolutePath();
		log(colors.green(`Replacing swagger route to ${colors.cyan("/api-docs.json")}`));
		replace({
			"regex": "http.*.json",
			"replacement": "/api-docs.json",
			"paths": [path.join(swaggerUiAssetPath, "index.html")],
			"recursive": false,
			"silent": true
		});

		fse.copy(swaggerUiAssetPath, "../docs/api/swagger-ui-dist", err => {
			if (err) {
				log(colors.red(err));
			}
			log(colors.blue("Swagger: API docs built and placed successfully"));
			done();
		});
	});

	process.on("exit", function (code) {
		log("About to exit with code:", code);
	});

}());
