import bcrypt from "bcrypt";
import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/appError.js";
import { signToken } from "../utils/jwt.js";
import type { RegisterUserDTO, LoginUserDTO } from "../dtos/auth.dto.js";

export const registerUser = async (data: RegisterUserDTO) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new AppError("Email already registered", 400);
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
    },
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
};

export const loginUser = async (data: LoginUserDTO) => {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  const isMatch = await bcrypt.compare(data.password, user.password);

  if (!isMatch) {
    throw new AppError("Invalid credentials", 401);
  }

  const token = signToken({
    id: user.id,
    role: user.role,
  });

  return { token };
};