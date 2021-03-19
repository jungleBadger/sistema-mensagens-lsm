"use strict";

import swaggerJSDoc from "swagger-jsdoc";
import swaggerIntegrationConfigs from "../configs/swagger-integration";

import { Application, Request, Response } from "express";

export default function (app: Application) {
    app.get("/api-docs.json", function (req: Request, res: Response) {
        res.setHeader("Content-Type", "application/json");
        return res.send(swaggerJSDoc(swaggerIntegrationConfigs));
    });
}
