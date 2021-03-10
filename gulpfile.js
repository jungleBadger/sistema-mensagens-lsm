/*jslint node: true, nomen:true*/
/*env:node*/
(function () {
	"use strict";
	require("dotenv").config({"silent": true});
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
	const inquirer = require('inquirer');
	const path = require("path");
	const cssnext = require("postcss-cssnext");
	const log = require("fancy-log");
	const jsdoc = require("gulp-jsdoc3");
	const colors = require("ansi-colors");
	const replace = require("replace");
	const terminalLink = require("terminal-link");
	const webpack = require("webpack");
	const cssUglifier = [
		cssnano()
	];
	const childProcess = require("child_process");
	const vueModuleTemplates = require("./root/module_model/vue/index");
	const submoduleTemplates = require("./root/submodule_model/index");
	const md2json = require("md-2-json");

	let currentContext = "";
	let modulePath;
	let isProd;


	process.env.NODE_ENV = argv.prod ? "production" : "development";
	isProd = process.env.NODE_ENV === "production" || process.NODE_ENV === "production";

	let methods = {
		"errorHandler": function errorHandler(module, error, stack) {
			log(colors.red("ERROR FOUND BUILDING THIS ARTIFACT:"), colors.yellow(module));
			log(stack);
			log(error);
			return error;
		},
		"createFiles": function createFiles(files) {
			return Promise.all(files.map(function (file) {
				return new Promise(function (resolve, reject) {
					fse.outputFile(file.path, file.content || "", "utf-8", function (err) {
						if (err) {
							reject(err);
						} else {
							resolve("file saved");
						}
					});
				});
			}));
		},
		"appendFile": function appendFile(file) {
			return new Promise(function (resolve, reject) {
				fs.appendFile(file.path, file.content || "", "utf-8", function (err) {
					if (err) {
						reject(err);
					} else {
						resolve("file saved");
					}
				});
			});
		},
		"setCFManifest": function () {
			return fse.copy(path.join("root/manifests", isProd ? "manifest.prod.yml" : "manifest.dev.yml"), "manifest.yml", {
				"overwrite": true
			});
		},
		"runWebpack": function (modulePath, isProdBuild, isWatcherEnabled) {
			log(`webpack ${isProdBuild ? "--env.production --env.NODE_ENV=production" : "--env.NODE_ENV=development"} ${isWatcherEnabled ? "--env.ENABLE_WATCH" : ""}`);
			log(`Webpack building module ${modulePath}`);
			log(`Build type: ${isProdBuild ? "production" : "development"}`);
			log(`Watcher enabled: ${isWatcherEnabled ? 'yes' : 'no'}`);

			const compiler = webpack(
				require("./" + modulePath + "/webpack.config.js")({
					"NODE_ENV": isProdBuild ?  "production" : "development",
					"production": isProdBuild
				})
			)

			if (isWatcherEnabled) {
				compiler.watch({

				}, (err, stats) => {
					if (err) {
						console.log(err);
					} else {
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





			// let child = childProcess.spawn(
			// 	`webpack`,
			// 	[
			// 		isProdBuild ? "--env.production --env.NODE_ENV=production" : "--env.NODE_ENV=development",
			// 		isWatcherEnabled ? "--env.ENABLE_WATCH" : "",
			// 		`--env.maxChunks=${argv.maxChunks || 6}`
			// 	],
			// 	{
			// 		"cwd": modulePath,
			// 		"stdio": "pipe",
			// 		"shell": true
			// 	}
			// );
			//
			// child.stdout.on("data", (data) => {
			// 	log(data.toString());
			// 	// console.log(pristine && Array.isArray(data) ? data.toString() : `[${new Date().toLocaleTimeString()}] - wp build incremented`);
			// 	pristine = false;
			// });
			//
			// child.stderr.on("data", (data) => {
			// 	log(data.toString());
			// });
			//
			// child.on("close", (code) => {
			// 	console.log(`child process close all stdio with code ${code}`);
			// 	if (code) {
			// 		process.exit(code);
			// 	}
			// });

			// return child;
		}
	};


	gulp.task("doc", function (cb) {
		if (!isProd) {
			return cb();
		}
		let config = require("./jsdoc-config.json");
		gulp.src(["README.md", "./server/**/*.js", "./submodules_dev/**/server/**/*.js"], {read: false})
			.pipe(jsdoc(config, cb));
	});

	gulp.task("swagger-route", function (done) {
		if (!isProd) {
			return done();
		}
		const swaggerUiAssetPath = require("swagger-ui-dist").absolutePath();
		log(colors.green(`Replacing swagger route to ${colors.cyan("/api-docs.json")}`));
		replace({
			"regex": "http.*.json",
			"replacement": "/api-docs.json",
			"paths": [path.join(swaggerUiAssetPath, "index.html")],
			"recursive": false,
			"silent": true
		});

		fse.copy(swaggerUiAssetPath, "./docs/api/swagger-ui-dist", err => {
			if (err) {
				log(colors.red(err));
			}
			log(colors.blue("Swagger: API docs built and placed successfully"));
			done();
		});
	});

	gulp.task("set-manifest", function (done) {
		methods.setCFManifest().then(function () {
			done();
		}).catch(function (error) {
			methods.errorHandler("set-manifest", error, "Check the logs to see where it fails");
			done(error);
		});
	});

	gulp.task("lint", function (done) {
		modulePath = currentContext ? currentContext : ["client/" + (argv.module || argv.m || currentContext || "main") + "_module"].join();
		//@TODO Enable all submodules lint
		return gulp.src(
			(modulePath === "client/maixxn_module" ?
				[
					"./client/main_module/js/**/*.js",
					"./client/main_module/js/**/*.vue",
					"./submodules_dev/**/client/**/*.js",
					"./submodules_dev/**/client/**/*.vue"
				] :
				[`./${modulePath}/js/**/*.js`, `./${modulePath}/js/**/*.vue`]
			)
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

	gulp.task("lint:server", function () {
		return gulp.src(["./app.js", "./server/**/*.js", "./submodules_dev/**/server/*.js"])
			.pipe(eslint({
				"fix": true
			}))
			.pipe(eslint.format())
			.pipe(eslint.failAfterError())
			.on("error", function (error) {
				methods.errorHandler("lint:server", error, "Check the logs to see where it fails");
			})
	});


	gulp.task("generate-sw", function (done) {

		fs.readdir("./client", function (err, files) {
			Promise.all(
				files.map(file => {
					return new Promise((resolve, reject) => {
						if (fs.statSync(path.join("client")).isDirectory() && file.indexOf("_module") > -1) {
							let moduleId = file.split("_")[0];
							let modulePath =  ["client/" + moduleId + "_module"].join();
							log(`${colors.blue("SERVICE WORKER MODULE:")} ${moduleId} ${colors.blue("BUILD TYPE:")} ${process.env.NODE_ENV}`);


							workboxBuild.generateSW({
								"swDest": path.join("client", `service-worker-${moduleId}.js`),
								"modifyURLPrefix":  {
									"": `${moduleId}_module/`
								},
								"globDirectory": modulePath,
								"mode": isProd ? "production" : "development",
								"cacheId": [packageJson.name, moduleId, process.env.NODE_ENV].join("_"),
								"clientsClaim": true,
								"maximumFileSizeToCacheInBytes": 4 * 1024 * 1024,
								"cleanupOutdatedCaches": true,
								"skipWaiting": true,
								"runtimeCaching": [{
									"urlPattern": "https://fonts.googleapis.com/css?family=IBM+Plex+Sans:300,400,500,700|IBM+Plex+Mono:400,500,700|IBM+Plex+Serif:300,400,700&display=swap",
									"handler": "CacheFirst",
									"options": {
										"cacheName": 'google-fonts-stylesheets',
										"expiration": {
											"maxEntries": 5,
											"maxAgeSeconds": 60 * 60 * 24 * 365,
										},
										"cacheableResponse": {
											"statuses": [0, 200],
										},
									},
								}, {
									"urlPattern": "http://w3-pics.ibm.com/bluepages/photo/",
									"handler": "CacheFirst",
									"options": {
										"cacheName": 'intranet-picture',
										"expiration": {
											"maxAgeSeconds": 5 * 24 * 60 * 60, // 30 Days
										},
										"cacheableResponse": {
											"statuses": [0, 200],
										},
									},
								}],

								"globPatterns": [
									"dist/css/*.css",
									"dist/js/*.js",
								],
							}).then(({count, size, warnings}) => {
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
				done()
			}).catch(err => {
				done(err)
			});
		});






	});

	gulp.task("css", function () {
		modulePath = currentContext ? currentContext : ["client/" + (argv.module || argv.m || currentContext || "main") + "_module"].join();
		if (isProd) {
			fse.remove(modulePath + "/dist/css/style.css.map");
		}
		return gulp.src([
			modulePath + "/css/*.css",
			modulePath + "/css/*.scss"
		])
			.pipe(plumber())
			.pipe(cache(sass().on("error", sass.logError)))
			.pipe(postcss([
				cssnext({})
			]))
			.pipe(cond(!isProd, sourcemaps.init({"loadMaps": true})))
			.pipe(cond(isProd, postcss(cssUglifier)))
			.pipe(cond(!isProd, sourcemaps.write("./")))
			.pipe(gulp.dest(modulePath + "/dist/css/"));
	});

	gulp.task("watch-css", function (done) {
		modulePath = currentContext ? currentContext : ["client/" + (argv.module || argv.m || currentContext || "main") + "_module"].join();
		if (argv.w || argv.watch) {
			log(colors.blue("Gulp watching CSS changes"));
			gulp.watch([
				modulePath + "/css/*.css",
				modulePath + "/css/*.scss"
			], gulp.parallel("css"));
		}

		done();
	});

	gulp.task("bundle-code", async function () {
		let enableWatcher = argv.w || argv.watch;
		modulePath = currentContext ? currentContext : ["client/" + (argv.module || argv.m || currentContext || "main") + "_module"].join();

		return await methods.runWebpack(
			modulePath, isProd, enableWatcher
		);
	});

	gulp.task("build", gulp.parallel("lint", "css", "bundle-code", "watch-css"));

	gulp.task("build-all", gulp.parallel("lint:server", "doc", "swagger-route", function iterateOverModules(done) {
		cache.clearAll();
		fs.readdir("./client", function (err, files) {
			Promise.all(
				files.map(file => {
					return new Promise((resolve, reject) => {
						if (fs.statSync(path.join("client")).isDirectory() && file.indexOf("_module") > -1) {
							let module = file.split("_")[0];
							log(`${colors.blue("MODULE:")} ${module} ${colors.blue("BUILD TYPE:")} ${process.env.NODE_ENV}`);
							childProcess.exec(
								`gulp build -m ${module} ${isProd ? '--prod' : ''}`,
								function (error, data) {
									log(data);
									if (error) {
										log(colors.red(`Module [${module}] errored`));
										log(error);
										console.log(error.toString())
										return reject(error);
									} else {
										log(colors.green(`Module [${module}] built successfully`));
										return resolve();
									}
								},
							);
						} else {
							return resolve();
						}
					});
				})
			).then(() => {
				done()
			}).catch(err => {
				done(err)
			});
		});
	}));


	gulp.task("create-module", function (done) {
		let module = argv.m || argv.module;
		let override = argv.o || argv.override;
		if (!module) {
			log("Can't proceed without module parameter");
		} else {
			let targetPath = path.join("./client", module + "_module/");
			let cssPath = path.join(targetPath, "css");
			let jsPath = path.join(targetPath, "js");
			let componentPath = path.join(targetPath, "js", "components");



			if (fse.pathExistsSync(targetPath) && !override) {
				log("Module already exists. Run with -o flag to override");
			} else {
				methods.createFiles([{
					"path": path.join(targetPath, "index.ejs"),
					"content": vueModuleTemplates.HTMLTemplate(module)
				}, {
					"path": path.join(targetPath, "index.html"),
					"content": ""
				}, {
					"path": path.join(cssPath, "style.scss"),
					"content": vueModuleTemplates.CSSTemplate(module)
				}, {
					"path": path.join(jsPath, "main.js"),
					"content": vueModuleTemplates.JSTemplate(module)
				}, {
					"path": path.join(componentPath, "app.vue"),
					"content": vueModuleTemplates.VueTemplate(module)
				}, {
					"path": path.join(targetPath, "webpack.config.js"),
					"content": vueModuleTemplates.WebpackTemplate(module)
				}]).then(function (result) {
					log(result);
					done()
				}).catch(function (err) {
					done(err);
				});
			}
		}
	});

	gulp.task("create-submodule", function (done) {
		const validationRegex = new RegExp(/^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/);

		inquirer
			.prompt([
				{
					"type": "input",
					"name": "submoduleName",
					"message": `Insert the Submodule name. ${terminalLink("snake_case", "https://en.wikipedia.org/wiki/Snake_case")} required\n`,
					"validate": function(submoduleName){
						if (!submoduleName) {
							log("Submodule name can't be empty");
							return false;
						}
						if (!validationRegex.test(submoduleName)) {
							log("String violates the pattern: '^(?:@[a-z0-9-*~][a-z0-9-*._~]*/)?[a-z0-9-~][a-z0-9-._~]*$' ");
							return false;
						}
						if (fse.pathExistsSync(path.join(`./submodules_dev/${submoduleName}`))) {
							log(`Submodule ${submoduleName} already exists.`);
							return false
						}
						return true;
					}
				},
				{
					"type": "input",
					"name": "submoduleOwner",
					"message": "Insert the Submodule owner IBM Intranet ID (e.g user@ibm.com)\n",
					"validate": function(submoduleOwner) {
						if (!submoduleOwner) {
							log("Submodule owner string can't be empty");
							return false;
						}

						if (submoduleOwner.indexOf("ibm.com") <= -1) {
							log("Invalid IBM intranet ID basic pattern");
							return false;
						}
						return true;
					}

				},
				{
					"type": "input",
					"name": "codeOwners",
					"message": "Insert a list of CODEOWNERS GitHub handlers, separated by spaces\n",
					"default": "@dcerag @rafalima @blennox",
					"validate": function(codeOwnersString) {
						if (!codeOwnersString) {
							log("CODEOWNERS string can't be empty");
							return false;
						}
						if (codeOwnersString.split(" ").some(ownerString => ownerString[0] !== "@")) {
							log("All CODEOWNERS must be preceded by the `@` character");
							return false;
						}
						return true;
					}
				},
				{
					"type": "input",
					"name": "submoduleIcon",
					"message": `Select an icon to represent the submodule. ${terminalLink("Icon list", "https://fontawesome.com/icons?d=gallery&s=light")}\n`,
					"default": "puzzle-piece",
					"validate": function(submoduleIcon) {
						if (!submoduleIcon) {
							log("submoduleIcon string can't be empty");
							return false;
						}
						return true;
					}
				}
			])
			.then(answers => {
				let submoduleName = answers.submoduleName;
				let submoduleOwner = answers.submoduleOwner;
				let submoduleIcon = answers.submoduleIcon;
				let submoduleCodeOwnersString = answers.codeOwners;
				let targetPath = path.join(`./submodules_dev/${submoduleName}`);
				const submodulesDeclarationPath = "./client/main_module/js/submodules";
				const clientPath = path.join(targetPath, "client");
				const serverPath = path.join(targetPath, "server");
				const storeModelPath = "./root/submodule_model/client/store";
				const storePath = path.join(clientPath, "/store");
				const componentsPath = path.join(clientPath, "/components");
				const routesPath = path.join(clientPath, "/routes");
				const factoryPath = path.join(clientPath, "/factory");
				const i18nPath = path.join(clientPath, "/i18n");

				let submoduleMainScript = new submoduleTemplates.SubmoduleMainScript(submoduleName);
				let submoduleMainComponent = new submoduleTemplates.SubmoduleMainComponent(submoduleName);
				let submoduleRoutes = new submoduleTemplates.SubmoduleRoutes(submoduleName, submoduleIcon);
				let submoduleFactory = new submoduleTemplates.SubmoduleFactory(submoduleName);
				let submoduleEnglishMessages = new submoduleTemplates.SubmoduleEnglishMessages(submoduleName);
				let submoduleEndpoints = new submoduleTemplates.SubmoduleEndpoints(submoduleName);
				let submoduleCodeOwners = new submoduleTemplates.SubmoduleCodeOwners(submoduleName, submoduleCodeOwnersString);
				let SubmodulePackageJson = new submoduleTemplates.SubmodulePackageJson(submoduleName, submoduleCodeOwnersString, submoduleOwner);
				let SubmoduleReadme = new submoduleTemplates.SubmoduleReadme(submoduleName);
				let SubmoduleDotEnv = new submoduleTemplates.SubmoduleDotEnv(submoduleName);
				let SubmoduleChangelog = new submoduleTemplates.SubmoduleChangelog(submoduleName);

				Promise.all([
					methods.createFiles([{
						"path": path.join(clientPath, `${submoduleMainScript.fileName}.${submoduleMainScript.fileType}`),
						"content":submoduleMainScript.integrationString
					}, {
						"path": path.join(componentsPath, `${submoduleMainComponent.fileName}.${submoduleMainComponent.fileType}`),
						"content":submoduleMainComponent.integrationString
					}, {
						"path": path.join(routesPath, `${submoduleRoutes.fileName}.${submoduleRoutes.fileType}`),
						"content":submoduleRoutes.integrationString
					}, {
						"path": path.join(factoryPath, `${submoduleFactory.fileName}.${submoduleFactory.fileType}`),
						"content":submoduleFactory.integrationString
					}, {
						"path": path.join(i18nPath, `${submoduleEnglishMessages.fileName}.${submoduleEnglishMessages.fileType}`),
						"content":submoduleEnglishMessages.integrationString
					}, {
						"path": path.join(serverPath, `${submoduleEndpoints.fileName}.${submoduleEndpoints.fileType}`),
						"content":submoduleEndpoints.integrationString
					}, {
						"path": path.join(targetPath, `${SubmodulePackageJson.fileName}.${SubmodulePackageJson.fileType}`),
						"content":SubmodulePackageJson.integrationString
					}, {
						"path": path.join(targetPath, `${SubmoduleReadme.fileName}.${SubmoduleReadme.fileType}`),
						"content":SubmoduleReadme.integrationString
					}, {
						"path": path.join(targetPath, `${SubmoduleChangelog.fileName}.${SubmoduleChangelog.fileType}`),
						"content":SubmoduleChangelog.integrationString
					}, {
						"path": path.join(targetPath, `${SubmoduleDotEnv.fileName}`),
						"content":SubmoduleDotEnv.integrationString
					}]),
					methods.appendFile({
						"path": path.join("./", `${submoduleCodeOwners.fileName}`),
						"content":submoduleCodeOwners.integrationString
					})
				]).then(function (result) {
					let submoduleIntegration = new submoduleTemplates.SubmoduleClientIntegration(submoduleName);
					fse.copy(storeModelPath, storePath, (err) => {
						if (err) {
							done(err);
						} else {
							methods.createFiles([{
								"path": path.join(submodulesDeclarationPath, `${submoduleName}.${submoduleIntegration.fileType || 'js'}`),
								"content": submoduleIntegration.integrationString
							}]).then(function (result) {
								log(`Submodule ${submoduleName} successfully created. path: /submodules_dev/${submoduleName}`);
								done()
							}).catch(function (err) {
								done(err);
							});
						}
					})
				}).catch(function (err) {
					done(err);
				});
			})
			.catch(error => {
				log(error);
				done(error);
			});

	});

	gulp.task("help", function () {
		/*
		 params to doc
		 @ watch, alias w -> #build
		 @ prod -> #env
		 @ module, alias m -> #build
		 @ override, alias o -> #create-module
		 */

		log(colors.green("Task: build-all"), colors.magenta("#"));
		log(colors.green("Task: build"), colors.magenta("#"));
		log(colors.green("Task: lint"), colors.magenta("#"));
		log(colors.green("Task: lint:server"), colors.magenta("#"));
		log(colors.green("Task: js"), colors.magenta("#"));
		log(colors.green("Task: css"), colors.magenta("#"));
		log(colors.green("Task: generate-sw"), colors.magenta("#"));
		log(colors.green("Task: create-module"), colors.magenta("#"));
		log(colors.green("Task: images"), colors.magenta("#"));

	});

	gulp.task("process-md-files", async function(done) {
		let files = [{
			"name": "CHANGELOG",
			"path": "./CHANGELOG.md"
		}];

		await Promise.all(files.map( file => {
			fs.readFile(file.path, "utf8", async (err, data) => {
				if (err) throw err;

				fs.writeFile(`./docs/${file.name}.json`, JSON.stringify(md2json.parse(data)), (err) => {
					if (err) console.log(err);

					console.log(`File ${file.name} has been saved!`);
				});
			})
		}));

		done()
	});

	process.on("exit", function (code) {
		log("About to exit with code:", code);
	});

}());
