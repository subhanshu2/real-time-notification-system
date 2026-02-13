import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/appError.js";
import { io } from "../server.js";

export const createNotification = async (
  message: string,
  senderId: string,
  userId?: string
) => {
  if (userId) {
    if (userId === senderId) {
      throw new AppError("Cannot send notification to yourself", 400);
    }
    const notification = await prisma.notification.create({
      data: {
        message,
        userId,
      },
    });
    io.to(userId).emit("notification", notification);
    return notification;
  }

  const users = await prisma.user.findMany({
    where: {
      id: {
        not: senderId,
      },
    },
    select: { id: true },
  });

  await prisma.notification.createMany({
    data: users.map((user) => ({
      message,
      userId: user.id,
    })),
  });

  users.forEach((user) => {
    io.to(user.id).emit("notification", {
      message,
    });
  });

  return { broadcastedTo: users.length };
};

export const getUserNotifications = async (
  userId: string,
  page: number,
  limit: number
) => {
  const skip = (page - 1) * limit;

  const [notifications, total, unreadCount] = await Promise.all([
    prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.notification.count({
      where: { userId },
    }),
    prisma.notification.count({
      where: { userId, isRead: false },
    }),
  ]);

  return {
    notifications,
    total,
    unreadCount,
    page,
    limit,
  };
};

export const markAsRead = async (notificationId: string, userId: string) => {
  const notification = await prisma.notification.findUnique({
    where: { id: notificationId },
  });

  if (!notification || notification.userId !== userId) {
    throw new AppError("Notification not found", 404);
  }

  return prisma.notification.update({
    where: { id: notificationId },
    data: { isRead: true },
  });
};

export const deleteNotification = async (
  notificationId: string,
  userId: string
) => {
  const notification = await prisma.notification.findUnique({
    where: { id: notificationId },
  });

  if (!notification || notification.userId !== userId) {
    throw new AppError("Notification not found", 404);
  }

  return prisma.notification.delete({
    where: { id: notificationId },
  });
};