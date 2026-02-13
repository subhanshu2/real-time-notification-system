import { z } from "zod";
import { registry } from "../config/openapi.js";

export const createNotificationSchema = z.object({
  message: z.string().min(1).openapi({
    example: "Server maintenance",
  }),
  userId: z.uuid().optional().openapi({
    example: "optional-user-id",
  }),
});

registry.register("CreateNotificationRequest", createNotificationSchema);

export const PaginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(10),
});

registry.register("PaginationQuery", PaginationSchema);

export const IdParamSchema = z.object({
  id: z.uuid(),
});

registry.register("IdParam", IdParamSchema);
