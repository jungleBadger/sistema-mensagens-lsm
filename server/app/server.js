"use strict";

const compression = require("compression");
const cookieParser = require("cookie-parser");
const engines = require("consolidate");
const debug = require("debug");
const express = require("express");
const fs = require("fs");
const helmet = require("helmet");
const http = require("http");
const https = require("https");
const morgan = require("morgan");
const path = require("path");
const routes = require("./routes/index");

const app = express();
const APP_PORT = process.env.APP_PORT || 3030;
const log = debug("app:main");
const httpLog = debug("app:endpoint");

let server;

app.use(compression());
app.use(cookieParser(process.env.APP_SECRET));

app.use(helmet({
	"contentSecurityPolicy": false
}));

app.engine("html", engines.ejs);
app.set("view engine", "ejs");
app.set("views", path.join("..", "/client/"));
app.use(express.static(path.join("..", "/client/")));
app.use(express.urlencoded({
	"extended": true,
	"limit": "3mb"
}));
app.use(express.json());

if (httpLog.enabled) {
	app.use(
		morgan(
			"combined",
			{
				"stream": {
					"write": (msg) => httpLog(msg.trimEnd())
				}
			}
		)
	);
}
log("Plugins loaded");

app.use("/docs/js", express.static(path.join("..", "/docs/js")));
app.use("/docs/api", express.static(path.join("..", "/docs/api/swagger-ui-dist")));
log("Static routes loaded");

module.exports = async function run (CUSTOM_APP_PORT = 0) {
	if (process.env.LOCAL_HTTPS) {
		server = https.createServer({
			"hostname": "localhost",
			"agent": false,
			"key": fs.readFileSync("certificates/local/localhost-privkey.pem"),
			"cert": fs.readFileSync("certificates/local/localhost-cert.pem"),
			"rejectUnauthorized": false
		}, app);
	} else {
		server = http.createServer(app);
	}

	log(`${process.env.LOCAL_HTTPS ? "HTTPS" : "HTTP"} server created`);

	app.get("/", (req, res) => res.status(200).send(new Date()));

	server.listen(Number(CUSTOM_APP_PORT || APP_PORT), function () {
		routes(app);
		log(`Server started at port: ${CUSTOM_APP_PORT || APP_PORT}`);
	});

	return server;
}
