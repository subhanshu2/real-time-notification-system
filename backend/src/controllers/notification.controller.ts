import { Request, Response, NextFunction } from "express";
import {
  createNotification,
  getUserNotifications,
  markAsRead,
  deleteNotification,
} from "../services/notification.service.js";
import {
  createNotificationSchema,
  IdParamSchema,
  PaginationSchema,
} from "../validators/notification.validator.js";

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {

    const validated = createNotificationSchema.parse(req.body);

    const result = await createNotification(
      validated.message,
      req.user!.id,
      validated.userId
    );

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const getMyNotifications = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page, limit } = PaginationSchema.parse(req.query);

    const result = await getUserNotifications(
      req.user!.id,
      page,
      limit
    );

    res.json({
      success: true,
      ...result,
    });
  } catch (err) {
    next(err);
  }
};

export const markRead = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = IdParamSchema.parse(req.params);

    const result = await markAsRead(id, req.user!.id);

    res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const remove = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = IdParamSchema.parse(req.params);
    await deleteNotification(id, req.user!.id);

    res.json({
      success: true,
      message: "Notification deleted",
    });
  } catch (err) {
    next(err);
  }
};