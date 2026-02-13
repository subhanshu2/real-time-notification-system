import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/appError.js";
import { Role } from "../generated/prisma/client.js";

export const requireRole = (role: Role) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError("Unauthorized", 401));
    }

    if (req.user.role !== role) {
      return next(new AppError("Forbidden", 403));
    }

    next();
  };
};