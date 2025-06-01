import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import type { Express } from "express";
import dotenv from "dotenv";

dotenv.config();

const swaggerOptions: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "LeoCRM API",
      version: "1.0.0",
      description: "API documentation for LeoCRM",
    },
    servers: [
      {
        url: process.env.SWAGGER_URL, 
      },
    ],
    security: [
      {
        bearerAuth: [],
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
       
        Opportunity: {
          type: "object",
          properties: {
            _id: { type: "string", example: "6423ab12345abcde6789f012" },
            name: { type: "string", example: "Nuova opportunità cliente XYZ" },
            value: { type: "number", example: 15000 },
            stage: {
              type: "string",
              enum: ["nuova", "in corso", "vinta", "persa"],
              example: "nuova",
            },
            contact_id: { type: "string", example: "6423ab98765fghij54321abc" },
            user_id: { type: "string", example: "6423ab98765fghij54321def" },
            activities: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  description: {
                    type: "string",
                    example: "Chiamata di follow-up",
                  },
                  date: {
                    type: "string",
                    format: "date-time",
                    example: "2025-05-24T12:00:00Z",
                  },
                  status: {
                    type: "string",
                    enum: [
                      "In corso",
                      "Completata",
                      "Pianificata",
                      "In attesa",
                    ],
                    example: "Pianificata",
                  },
                },
                required: ["description"],
              },
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2025-05-20T10:30:00Z",
            },
          },
          required: ["name", "value"],
        },
        User: {
          type: "object",
          properties: {
            _id: { type: "string", example: "6423ab12345abcde6789f012" },
            username: { type: "string", example: "leonardo123" },
            firstName: { type: "string", example: "Leonardo" },
            lastName: { type: "string", example: "Rossi" },
            email: {
              type: "string",
              format: "email",
              example: "leo.rossi@example.com",
            },
            password: { type: "string", example: "hashed_password" },
            role: { type: "string", example: "admin" },
            termsCondition: { type: "boolean", example: true },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2025-05-20T10:30:00Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2025-05-21T10:30:00Z",
            },
          },
          required: [
            "username",
            "firstName",
            "lastName",
            "email",
            "password",
            "role",
          ],
        },
         Contact: {
          type: "object",
          properties: {
            _id: { type: "string", example: "6423ab12345abcde6789f012" },
            name: { type: "string", example: "Mario Rossi" },
            email: {
              type: "string",
              format: "email",
              example: "mario.rossi@example.com",
            },
            phone: { type: "string", example: "+391234567890" },
            user_id: { type: "string", example: "6423ab98765fghij54321abc" },
          },
          required: ["name", "email", "phone", "user_id"],
        },
      },
    },
  },
  // Da ricordare : api deve sempre stare fuori da definition
  apis: ["./routes/**/*.ts"],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export const setupSwagger = (app: Express): void => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
