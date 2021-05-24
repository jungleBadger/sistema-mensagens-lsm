/*jslint node: true, nomen:true*/
/*env:node*/
(function () {
	"use strict";
	require("dotenv");
	const gulp = require("gulp");
	const packageJson = require("./package.json");
	const workboxBuild = require("workbox-build");
	const argv = require("yargs").argv;
	const cond = require("gulp-cond");
	const fs = require("fs");
	const fse = require("fs-extra");
	const cssnano = require("cssnano");
	const cache = require("gulp-cache");
	const postcss = require("gulp-postcss");
	const sourcemaps = require("gulp-sourcemaps");
	const sass = require("gulp-sass");
	const eslint = require("gulp-eslint");
	const plumber = require("gulp-plumber");
	const path = require("path");
	const log = require("fancy-log");
	const colors = require("ansi-colors");
	const webpack = require("webpack");
	const tailwindcss = require("tailwindcss");
	const tailwindColors = require("tailwindcss/colors");
	const childProcess = require("child_process");
	const purgecss = require("@fullhuman/postcss-purgecss");

	let currentContext = "";
	let modulePath;
	let isProd;

	process.env.NODE_ENV = argv.prod ? "production" : "development";
	isProd = process.env.NODE_ENV === "production" || process.NODE_ENV === "production";

	let methods = {
		"errorHandler": function errorHandler (module, error, stack) {
			log(colors.red("ERROR FOUND BUILDING THIS ARTIFACT:"), colors.yellow(module));
			log(stack);
			log(error);
			return error;
		},
		"runWebpack": function (modulePath, isProdBuild, isWatcherEnabled) {
			log(`webpack ${isProdBuild ? "--env.production --env.NODE_ENV=production" : "--env.NODE_ENV=development"} ${isWatcherEnabled ? "--env.ENABLE_WATCH" : ""}`);
			log(`Webpack building module ${modulePath}`);
			log(`Build type: ${isProdBuild ? "production" : "development"}`);
			log(`Watcher enabled: ${isWatcherEnabled ? "yes" : "no"}`);

			const compiler = webpack(
				require("./" + modulePath + "/webpack.config.js")({
					"NODE_ENV": isProdBuild ? "production" : "development",
					"production": isProdBuild
				})
			);

			if (isWatcherEnabled) {
				compiler.watch({}, (err, stats) => {
					if (err) {
						console.log(err);
					} else {
						console.log(`Built at: ${new Date()}`);
						console.log(stats.toJson("minimal"));
					}
				});
			} else {
				compiler.run((err, stats) => {
					if (err) {
						console.log(err);
					} else {
						console.log(stats.toJson("minimal"));
					}
				});
			}
		}
	};

	gulp.task("lint", function (done) {
		modulePath = currentContext || `${argv.module || argv.m || currentContext || "main"}_module`;
		return gulp.src(
			[
				`${modulePath}/src/js/**/*.js`,
				`${modulePath}/src/js/**/*.vue`
			]
		).pipe(eslint({
			"fix": true
		}))
			.pipe(eslint.format())
			.pipe(eslint.failAfterError())
			.on("success", function () {
				done();
			})
			.on("error", function (error) {
				methods.errorHandler("lint", error, "Check the logs to see where it fails");
				done(error);
			});
	});

	gulp.task("generate-sw", function (done) {

		fs.readdir("./", function (err, files) {
			Promise.all(
				files.map(file => {
					return new Promise((resolve) => {
						if (file !== "node_modules" && file.indexOf("_module") > -1) {
							let moduleId = file.split("_")[0];
							let modulePath = [moduleId + "_module"].join();
							log(`${colors.blue("SERVICE WORKER MODULE:")} ${moduleId} ${colors.blue("BUILD TYPE:")} ${process.env.NODE_ENV}`);

							workboxBuild.generateSW({
								"swDest": path.join(`service-worker-${moduleId}.js`),
								"modifyURLPrefix": {
									"": `${moduleId}_module/`
								},
								"globDirectory": modulePath,
								"mode": isProd ? "production" : "development",
								"cacheId": [packageJson.name, moduleId, process.env.NODE_ENV].join("_"),
								"clientsClaim": true,
								"maximumFileSizeToCacheInBytes": 6 * 1024 * 1024,
								"cleanupOutdatedCaches": true,
								"skipWaiting": true,
								"runtimeCaching": [{
									"urlPattern": "https://fonts.googleapis.com/css2?family=Montserrat:wght@300&family=Source+Sans+Pro&display=swap",
									"handler": "CacheFirst",
									"options": {
										"cacheName": "google-fonts-stylesheets",
										"expiration": {
											"maxEntries": 5,
											"maxAgeSeconds": 60 * 60 * 24 * 365
										}
									}
								}],
								"globPatterns": [
									"dist/css/*.css",
									"dist/css/*.map",
									"dist/js/*.js"
								]
							}).then(({
								count,
								size,
								warnings
							}) => {
								// Optionally, log any warnings and details.
								warnings.forEach(console.warn);
								console.log(`${count} files will be precached, totaling ${size} bytes.`);
								done();
							});

						} else {
							return resolve();
						}
					});
				})
			).then(() => {
				done();
			}).catch(err => {
				done(err);
			});
		});

	});

	gulp.task("css", function () {
		modulePath = currentContext || `${argv.module || argv.m || currentContext || "main"}_module`;
		if (isProd) {
			fse.remove(modulePath + "/dist/css/style.css.map");
		}

		console.log(modulePath);
		return gulp.src([
			`${modulePath}/src/css/*.css`,
			`${modulePath}/src/css/*.scss`
		])
			.pipe(plumber())
			.pipe(sass().on("error", sass.logError))
			.pipe(
				postcss(
					[
						tailwindcss(
							{
								"options": {
									"keyframes": true
								},
								"darkMode": "class",
								"theme": {
									"fontFamily": {
										"sans": ["'Source Sans Pro'", "sans-serif;"]
									},
									"extend": {
										"colors": {
											"inherit": "inherit",
											"litepie-primary": tailwindColors.lightBlue, // color system for light mode,
											"litepie-secondary": tailwindColors.coolGray  // color system for light mode
										}
									}
								},
								"variants": {
									"extend": {
										"opacity": ["disabled"],
										"backgroundColor": ["active"],
										"cursor": ["disabled"],
										"textOpacity": ["disabled"],
										"textColor": ["disabled"]
									}
								},
								"plugins": [
									require("@tailwindcss/forms")
								]
							}
						)
					].concat(
						isProd ? [
							purgecss({
								"content": [
									`./${modulePath}/src/index.ejs`,
									`./${modulePath}/src/js/components/**/*.vue`,
									"./_etc/shared_components/**/*.vue",
									"./node_modules/litepie-datepicker/dist/*.js"
								],
								defaultExtractor (content) {
									const contentWithoutStyleBlocks = content.replace(/<style[^]+?<\/style>/gi, "");
									return contentWithoutStyleBlocks.match(/[A-Za-z0-9-_/:]*[A-Za-z0-9-_/]+/g) || [];
								},
								"whitelist": [],
								"whitelistPatterns": [/-(leave|enter|appear)(|-(to|from|active))$/, /^(?!(|.*?:)cursor-move).+-move$/, /^router-link(|-exact)-active$/]
							}),
							cssnano
						] : []
					)
				)
			)
			.pipe(cond(!isProd, sourcemaps.init({ "loadMaps": true })))
			.pipe(cond(!isProd, sourcemaps.write("./")))
			.pipe(gulp.dest(modulePath + "/dist/css/"));
	});

	gulp.task("watch-css", function (done) {
		modulePath = currentContext || `${argv.module || argv.m || currentContext || "main"}_module`;
		if (argv.w || argv.watch) {
			log(colors.blue("Gulp watching CSS changes"));
			gulp.watch([
				modulePath + "/src/css/*.css",
				modulePath + "/src/css/*.scss"
			], gulp.parallel("css"));
		}

		done();
	});

	gulp.task("bundle-code", async function () {
		let enableWatcher = argv.w || argv.watch;
		modulePath = currentContext || `${argv.module || argv.m || currentContext || "main"}_module`;
		return methods.runWebpack(
			modulePath, isProd, enableWatcher
		);
	});

	gulp.task("build", gulp.parallel("lint", "css", "bundle-code"));

	gulp.task("build-all", async function iterateOverModules (done) {
		await cache.clearAll();
		fs.readdir("./", function (err, files) {
			Promise.all(
				files.map(file => {
					return new Promise((resolve, reject) => {
						if (file !== "node_modules" && file.indexOf("_module") > -1) {
							let module = file.split("_")[0];
							log(`${colors.blue("MODULE:")} ${module} ${colors.blue("BUILD TYPE:")} ${process.env.NODE_ENV}`);
							childProcess.exec(
								`gulp build -m ${module} ${isProd ? "--prod" : ""}`,
								function (error, data) {
									log(data);
									if (error) {
										log(colors.red(`Module [${module}] errored`));
										log(error);
										console.log(error.toString());
										return reject(error);
									} else {
										log(colors.green(`Module [${module}] built successfully`));
										return resolve();
									}
								}
							);
						} else {
							return resolve();
						}
					});
				})
			).then(() => {
				done();
			}).catch(err => {
				done(err);
			});
		});
	});

	process.on("exit", function (code) {
		log("About to exit with code:", code);
	});

}());
