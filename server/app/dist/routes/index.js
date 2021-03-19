"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_integration_1 = __importDefault(require("../configs/swagger-integration"));
function default_1(app) {
    app.get("/api-docs.json", function (req, res) {
        res.setHeader("Content-Type", "application/json");
        return res.send(swagger_jsdoc_1.default(swagger_integration_1.default));
    });
}
exports.default = default_1;
