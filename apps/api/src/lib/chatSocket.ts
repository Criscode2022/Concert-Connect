import { Server } from "socket.io";
import type { Server as HttpServer } from "http";
import { verifyToken } from "@clerk/backend";
import { db } from "@workspace/db";
import { matchesTable, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { logger } from "./logger";

let io: Server | null = null;

export function initChatSocket(httpServer: HttpServer): void {
  io = new Server(httpServer, {
    path: "/api/socket.io",
    cors: { origin: true, credentials: true },
  });

  io.use(async (socket, next) => {
    const { token, matchId } = socket.handshake.auth as {
      token?: string;
      matchId?: number;
    };

    if (!token || !matchId) {
      return next(new Error("Missing token or matchId"));
    }

    let clerkId: string;
    try {
      const payload = await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY,
      });
      clerkId = payload.sub;
    } catch {
      return next(new Error("Invalid token"));
    }

    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.clerkId, clerkId),
    });
    if (!user) return next(new Error("User not found"));

    const match = await db.query.matchesTable.findFirst({
      where: eq(matchesTable.id, Number(matchId)),
    });
    if (!match || (match.userId1 !== user.id && match.userId2 !== user.id)) {
      return next(new Error("Forbidden"));
    }

    socket.data.userId = user.id;
    socket.data.matchId = Number(matchId);
    next();
  });

  io.on("connection", (socket) => {
    const { matchId } = socket.data as { matchId: number };
    socket.join(`chat:${matchId}`);
    logger.info({ matchId, socketId: socket.id }, "WS client joined room");

    socket.on("disconnect", (reason) => {
      logger.info({ matchId, socketId: socket.id, reason }, "WS client left room");
    });
  });
}

export function broadcastMessage(matchId: number, message: object): void {
  if (!io) return;
  io.to(`chat:${matchId}`).emit("new_message", message);
}
