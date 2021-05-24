"use strict";

const swaggerJSDoc = require("swagger-jsdoc")(require("../configs/swagger-integration"));
const { handleExpressError, raiseError } = require("../helpers/errorHandler");

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


const multer = require("multer");
const fs = require("fs").promises;

const upload = multer(
	{
		fileFilter(req, file, cb) {
			if (file && (file.mimetype === "application/pdf" || file.mimetype.indexOf("audio") > -1)) {
				return cb(null, true);
			} else {
				return cb(
					raiseError(
						400,
						`Invalid file type ${file.mimetype}`
					)
				);
			}

		},
		"storage": multer.diskStorage({
			destination: async (req, file, cb) => {
				const initialPath = `uploads/eventos/${req.params.eventId}`;
				let completePath = file.originalname.indexOf(".pdf") > -1 ? `${initialPath}/mensagens/esbocos` : `${initialPath}/mensagens/audios`;
				try {
					// Check if folder exists
					await fs.stat(initialPath);
				} catch (e) {
					// If folder does not exist, create it
					await fs.mkdir(completePath, {"recursive": true});
				}

				try {
					// Check if file exists
					await fs.stat(`${completePath}/${file.originalname}`);

					// If file exists, return a conflict event
					return cb(
						raiseError(
						409,
						`File ${file.originalname} already exists in path ${completePath}`
						)
					);
				} catch (e) {
					//Otherwise, everything went fine
					return cb(null, completePath);
				}
			},
			filename: (req, file, cb) => {
				cb(null, file.originalname)
			}
		})
	}
);


module.exports = function (app) {
    app.get("/api-docs.json", function (req, res) {
        res.setHeader("Content-Type", "application/json");
        return res.send(swaggerJSDoc);
    });

    app.post(
    	"/test/upload/:eventId",
		(req, res) => {
			upload.fields(
				[
					{ "name": "message_audio", "maxCount": 1 },
					{ "name": "message_pdf", "maxCount": 1 }
				]
			)(req, res, (err) => {
				console.log(err);
				if (err) {
					return handleExpressError(err, res);
				}
				console.log(req.files);
				res.status(200).send("ok");
			});

		}
	)


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

