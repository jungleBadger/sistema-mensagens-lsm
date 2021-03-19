"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
const compression = require("compression");
const cookieParser = require("cookie-parser");
const debug_1 = __importDefault(require("debug"));
const express = require("express");
const helmet = require("helmet");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const http = __importStar(require("http"));
const https = __importStar(require("https"));
const morgan = require("morgan");
const app = express();
const APP_PORT = process.env.APP_PORT || 3030;
const log = debug_1.default("app:main");
const httpLog = debug_1.default("app:endpoint");
let server;
const index_1 = __importDefault(require("./routes/index"));
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
    app.use(morgan("combined", {
        "stream": {
            "write": (msg) => httpLog(msg.trimEnd())
        }
    }));
}
log("Plugins loaded");
app.use("/docs/js", express.static(path.join("..", "/docs/js")));
app.use("/docs/api", express.static(path.join("..", "/docs/api/swagger-ui-dist")));
log("Static routes loaded");
async function run(CUSTOM_APP_PORT = 0) {
    if (process.env.LOCAL_HTTPS) {
        server = https.createServer({
            "hostname": "localhost",
            "agent": false,
            "key": fs.readFileSync("certificates/local/localhost-privkey.pem"),
            "cert": fs.readFileSync("certificates/local/localhost-cert.pem"),
            "rejectUnauthorized": false
        }, app);
    }
    else {
        server = http.createServer(app);
    }
    log(`${process.env.LOCAL_HTTPS ? "HTTPS" : "HTTP"} server created`);
    app.get("/", (req, res) => res.status(200).send(new Date()));
    server.listen(CUSTOM_APP_PORT || APP_PORT, function () {
        index_1.default(app);
        log(`Server started at port: ${CUSTOM_APP_PORT || APP_PORT}`);
    });
    return server;
}
exports.run = run;
