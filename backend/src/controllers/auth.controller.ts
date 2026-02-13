import { Request, Response, NextFunction } from "express";
import { registerUser, loginUser } from "../services/auth.service.js";
import { registerSchema, loginSchema } from "../validators/auth.validator.js";
import type { RegisterUserDTO, LoginUserDTO } from "../dtos/auth.dto.js";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedData: RegisterUserDTO = registerSchema.parse(req.body);

    const user = await registerUser(validatedData);

    res.status(201).json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedData: LoginUserDTO = loginSchema.parse(req.body);

    const result = await loginUser(validatedData);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (err) {
    next(err);
  }
};