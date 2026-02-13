import { Router } from "express";
import {
  create,
  getMyNotifications,
  markRead,
  remove,
} from "../controllers/notification.controller.js";
import { requireRole } from "../middlewares/role.middleware.js";
import { Role } from "../generated/prisma/client.js";
import { authMiddleware } from "../middlewares/auth.middlewares.js";
import { registry } from "../config/openapi.js";
import { createNotificationSchema, IdParamSchema, PaginationSchema } from "../validators/notification.validator.js";


const router = Router();

registry.registerPath({
  method: "post",
  path: "/api/notifications",
  tags: ["Notifications"],
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        "application/json": {
          schema: createNotificationSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: "Notification created",
    },
    403: {
      description: "Forbidden",
    },
  },
});
router.post(
  "/",
  authMiddleware,
  requireRole(Role.ADMIN),
  create
);



registry.registerPath({
  method: "get",
  path: "/api/notifications",
  tags: ["Notifications"],
  security: [{ bearerAuth: [] }],
  request: {
    query: PaginationSchema,
  },
  responses: {
    200: {
      description: "List of user notifications",
    },
  },
});
router.get("/", authMiddleware, getMyNotifications);


registry.registerPath({
  method: "patch",
  path: "/api/notifications/{id}/read",
  tags: ["Notifications"],
  security: [{ bearerAuth: [] }],
  request: {
    params: IdParamSchema,
  },
  responses: {
    200: {
      description: "Notification marked as read",
    },
    404: {
      description: "Notification not found",
    },
  },
});
router.patch("/:id/read", authMiddleware, markRead);


registry.registerPath({
  method: "delete",
  path: "/api/notifications/{id}",
  tags: ["Notifications"],
  security: [{ bearerAuth: [] }],
  request: {
    params: IdParamSchema,
  },
  responses: {
    200: {
      description: "Notification deleted",
    },
    404: {
      description: "Notification not found",
    },
  },
});
router.delete("/:id", authMiddleware, remove);

export default router;