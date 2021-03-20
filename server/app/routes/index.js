"use strict";

const swaggerJSDoc = require("swagger-jsdoc");
const swaggerIntegrationConfigs =  require("../configs/swagger-integration");

module.exports = function (app) {
    app.get("/api-docs.json", function (req, res) {
        res.setHeader("Content-Type", "application/json");
        return res.send(swaggerJSDoc(swaggerIntegrationConfigs));
    });

    app.get(["/admin", "/admin/", "/admin/*"],
        (req, res) => res.status(200).render("./admin_module/dist/index.html")
    );

    app.get(["/app", "/app/", "/app/*"],
        (req, res) => res.status(200).render("./main_module/dist/index.html")
    );
}

