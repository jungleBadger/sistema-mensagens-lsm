"use strict";

import compression = require("compression");
import cookieParser = require("cookie-parser");
import debug from "debug";
import express = require("express");
import helmet = require("helmet");
import * as fs from "fs";
import * as path from "path";
import * as http from "http";
import * as https from "https";
import morgan = require("morgan");

const app: express.Application = express();
const APP_PORT: number|string = process.env.APP_PORT || 3030;
const log: any = debug("app:main");
const httpLog: any = debug("app:endpoint");
let server: https.Server|http.Server;

import routes from "./routes/index";

app.use(compression());
app.use(cookieParser(process.env.APP_SECRET));

app.use(helmet({
    "contentSecurityPolicy": false
}));

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
                    "write": (msg: string) => httpLog(msg.trimEnd())
                }
            }
        )
    );
}
log("Plugins loaded");


app.use("/docs/js", express.static(path.join("..", "/docs/js")));
app.use("/docs/api", express.static(path.join("..", "/docs/api/swagger-ui-dist")));
log("Static routes loaded");


export async function run (CUSTOM_APP_PORT: number = 0) {


    if (process.env.LOCAL_HTTPS) {
        server = https.createServer({
            "hostname": "localhost",
            "agent": false,
            "key": fs.readFileSync("certificates/local/localhost-privkey.pem"),
            "cert": fs.readFileSync("certificates/local/localhost-cert.pem"),
            "rejectUnauthorized": false
        } as object, app);
    } else {
        server = http.createServer(app);
    }

    log(`${process.env.LOCAL_HTTPS ? "HTTPS" : "HTTP"} server created`);

    app.get("/", (req: express.Request, res: express.Response) => res.status(200).send(new Date()));

    server.listen(CUSTOM_APP_PORT || APP_PORT, function () {
        routes(app);
        log(`Server started at port: ${CUSTOM_APP_PORT || APP_PORT}`);
    });

    return server;
}
