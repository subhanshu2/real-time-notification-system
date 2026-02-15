import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/appError.js";
import { io } from "../server.js";


const emitWithRetry = async (
  userId: string,
  payload: any,
  maxRetries = 3
): Promise<void> => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const delivered = await new Promise<boolean>((resolve) => {
      io.to(userId)
        .timeout(5000)
        .emit(
          "notification",
          payload,
          (err: Error | null, response: any) => {
            if (err) return resolve(false);
            const ackData = Array.isArray(response)
              ? response[0]
              : response;

            if (ackData?.status === "received") {
              return resolve(true);
            }

            resolve(false);
          }
        );
    });

    if (delivered) {
      console.log(
        `Notification delivered to ${userId} on attempt ${attempt}`
      );
      return;
    }

    console.warn(
      `Attempt ${attempt} failed for ${userId}. Retrying...`
    );

    await new Promise((res) => setTimeout(res, 2000));
  }

  console.error(
    `Failed to deliver notification to ${userId} after ${maxRetries} attempts`
  );
};

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
    emitWithRetry(userId, notification);

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

  const notifications = await prisma.notification.findMany({
    where: {
      message,
      userId: {
        in: users.map((u) => u.id),
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: users.length,
  });

  notifications.forEach((notification) => {
    const room = io.sockets.adapter.rooms.get(notification.userId);

    if (room && room.size > 0) {
      emitWithRetry(notification.userId, notification);
    }
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