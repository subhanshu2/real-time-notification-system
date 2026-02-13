import { z } from "zod";
import { registry } from "../config/openapi.js";

export const registerSchema = z.object({
  name: z.string().min(2).openapi({ example: "Subhanshu" }),
  email: z.email().openapi({ example: "test@example.com" }),
  password: z.string().min(6).openapi({ example: "123456" }),
});
registry.register("RegisterRequest", registerSchema);


export const loginSchema = z.object({
  email: z.email().openapi({ example: "test@example.com" }),
  password: z.string().min(6).openapi({ example: "123456" }),
});
registry.register("LoginRequest", loginSchema);