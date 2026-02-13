import { z } from "zod";
import { createNotificationSchema } from "../validators/notification.validator.js";
import { Notification } from "../generated/prisma/client.js";


export interface NotificationResponse {
  success: boolean;
  notifications: Notification[];
  total: number;
  unreadCount: number;
  page: number;
  limit: number;
}

export interface IdParams {
  id: string;
}

export type CreateNotificationDTO = z.infer<
  typeof createNotificationSchema
>;