import "dotenv/config";
import { z } from "zod";

import { OpenAPIRegistry, OpenApiGeneratorV3, extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);


export const registry = new OpenAPIRegistry();

registry.registerComponent("securitySchemes", "bearerAuth", {
  type: "http",
  scheme: "bearer",
  bearerFormat: "JWT",
});

export const generateOpenAPIDocument = () => {
  const generator = new OpenApiGeneratorV3(registry.definitions);

  return generator.generateDocument({
    openapi: "3.0.0",
    info: {
      title: "Real-Time Notification API",
      version: "1.0.0",
      description: "API documentation for Auth and Notifications service"
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT}`,
      },
    ],
  });
};