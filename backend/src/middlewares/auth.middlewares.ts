import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.js";
import { AppError } from "../utils/appError.js";

export const authMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AppError("Unauthorized", 401));
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token) as {
      id: string;
      role: string;
    };

    req.user = {
      id: decoded.id,
      role: decoded.role as any,
    };

    next();
  } catch {
    next(new AppError("Invalid or expired token", 401));
  }
};