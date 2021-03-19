"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    "swaggerDefinition": {
        "info": {
            "title": "IBM EPM Platform",
            "version": "1.0.0"
        },
        "contact": {
            "name": "EPM Platform support",
            "url": "https://github.ibm.com/epm/platform/issues",
            "email": "dcerag@br.ibm.com"
        },
        "components": {
            "securitySchemes": {
                "ApiKeyAuth": {
                    "type": "apiKey",
                    "in": "query",
                    "name": "key"
                }
            }
        },
        "servers": [{
                "url": "https://epm-platform-beta.mybluemix.net",
                "description": "Staging server"
            }, {
                "url": "https://epm-platform.mybluemix.net",
                "description": "Production server"
            }],
        "tags": [],
        "openapi": "3.0.2"
    },
    "apis": [
        "app/src/routes/**/*.ts"
    ]
};
