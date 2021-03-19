declare const _default: {
    swaggerDefinition: {
        info: {
            title: string;
            version: string;
        };
        contact: {
            name: string;
            url: string;
            email: string;
        };
        components: {
            securitySchemes: {
                ApiKeyAuth: {
                    type: string;
                    in: string;
                    name: string;
                };
            };
        };
        servers: {
            url: string;
            description: string;
        }[];
        tags: never[];
        openapi: string;
    };
    apis: string[];
};
export default _default;
//# sourceMappingURL=swagger-integration.d.ts.map