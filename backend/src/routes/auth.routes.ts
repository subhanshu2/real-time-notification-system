import { Router } from "express";
import { register, login } from "../controllers/auth.controller.js";
import { registry } from "../config/openapi.js";
import { registerSchema, loginSchema } from "../validators/auth.validator.js";

const router = Router();

registry.registerPath({
  method: "post",
  path: "/api/auth/register",
  tags: ["Auth"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: registerSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: "User registered successfully",
    },
  },
});
router.post("/register", register);


registry.registerPath({
  method: "post",
  path: "/api/auth/login",
  tags: ["Auth"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: loginSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Login successful",
    },
    401: {
      description: "Invalid credentials",
    },
  },
});
router.post("/login", login);

export default router;