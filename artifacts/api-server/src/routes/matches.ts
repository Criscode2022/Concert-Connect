import { Router } from "express";
import { db } from "@workspace/db";
import { matchesTable, usersTable, eventsTable, messagesTable, eventAttendeesTable } from "@workspace/db";
import { eq, or, and, desc, sql } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth";
import { userToJson } from "./users";

const router = Router();

async function enrichMatch(match: any, currentUserId: number) {
  const otherUserId = match.userId1 === currentUserId ? match.userId2 : match.userId1;
  const [otherUser, event, lastMessageRows, unreadRows, attendees] = await Promise.all([
    db.query.usersTable.findFirst({ where: eq(usersTable.id, otherUserId) }),
    db.query.eventsTable.findFirst({ where: eq(eventsTable.id, match.eventId) }),
    db.select().from(messagesTable).where(eq(messagesTable.matchId, match.id)).orderBy(desc(messagesTable.createdAt)).limit(1),
    db.select({ count: sql<number>`count(*)::int` }).from(messagesTable).where(
      and(eq(messagesTable.matchId, match.id), sql`sender_id != ${currentUserId}`)
    ),
    db.select().from(eventAttendeesTable).where(eq(eventAttendeesTable.eventId, match.eventId)),
  ]);

  const lastMessage = lastMessageRows[0] ?? null;
  const createdByUser = event ? await db.query.usersTable.findFirst({ where: eq(usersTable.id, event.createdByUserId) }) : null;
  const isAttending = attendees.some((a) => a.userId === currentUserId);

  const eventJson = event ? {
    id: event.id,
    title: event.title,
    artistName: event.artistName,
    venueName: event.venueName,
    venueAddress: event.venueAddress ?? null,
    date: event.date instanceof Date ? event.date.toISOString() : event.date,
    lat: event.lat,
    lng: event.lng,
    genre: event.genre ?? null,
    imageUrl: event.imageUrl ?? null,
    createdByUserId: event.createdByUserId,
    createdBy: createdByUser ? userToJson(createdByUser) : null,
    attendeesCount: attendees.length,
    isAttending,
    createdAt: event.createdAt instanceof Date ? event.createdAt.toISOString() : event.createdAt,
  } : null;

  return {
    id: match.id,
    eventId: match.eventId,
    event: eventJson,
    userId1: match.userId1,
    userId2: match.userId2,
    otherUser: otherUser ? userToJson(otherUser) : null,
    lastMessage: lastMessage ? messageToJson(lastMessage, null) : null,
    unreadCount: unreadRows[0]?.count ?? 0,
    createdAt: match.createdAt instanceof Date ? match.createdAt.toISOString() : match.createdAt,
  };
}

function messageToJson(m: any, senderClerkId: string | null) {
  return {
    id: m.id,
    matchId: m.matchId,
    senderId: m.senderId,
    senderClerkId: senderClerkId ?? "",
    content: m.content,
    createdAt: m.createdAt instanceof Date ? m.createdAt.toISOString() : m.createdAt,
  };
}

router.get("/matches", requireAuth, async (req, res) => {
  const user = (req as any).dbUser;
  const matches = await db
    .select()
    .from(matchesTable)
    .where(or(eq(matchesTable.userId1, user.id), eq(matchesTable.userId2, user.id)))
    .orderBy(desc(matchesTable.createdAt));

  const enriched = await Promise.all(matches.map((m) => enrichMatch(m, user.id)));
  res.json(enriched);
});

router.get("/matches/:matchId", requireAuth, async (req, res) => {
  const user = (req as any).dbUser;
  const match = await db.query.matchesTable.findFirst({
    where: eq(matchesTable.id, Number(req.params.matchId)),
  });
  if (!match) return res.status(404).json({ error: "Match not found" });
  if (match.userId1 !== user.id && match.userId2 !== user.id) {
    return res.status(403).json({ error: "Forbidden" });
  }
  const enriched = await enrichMatch(match, user.id);
  res.json(enriched);
});

router.get("/matches/:matchId/messages", requireAuth, async (req, res) => {
  const user = (req as any).dbUser;
  const matchId = Number(req.params.matchId);

  const match = await db.query.matchesTable.findFirst({ where: eq(matchesTable.id, matchId) });
  if (!match) return res.status(404).json({ error: "Match not found" });
  if (match.userId1 !== user.id && match.userId2 !== user.id) {
    return res.status(403).json({ error: "Forbidden" });
  }

  const msgs = await db
    .select()
    .from(messagesTable)
    .where(eq(messagesTable.matchId, matchId))
    .orderBy(messagesTable.createdAt);

  const senderIds = [...new Set(msgs.map((m) => m.senderId))];
  const senders = await Promise.all(
    senderIds.map((id) => db.query.usersTable.findFirst({ where: eq(usersTable.id, id) }))
  );
  const senderMap = Object.fromEntries(senders.filter(Boolean).map((u) => [u!.id, u!.clerkId]));

  res.json(msgs.map((m) => messageToJson(m, senderMap[m.senderId] ?? null)));
});

router.post("/matches/:matchId/messages", requireAuth, async (req, res) => {
  const user = (req as any).dbUser;
  const matchId = Number(req.params.matchId);
  const { content } = req.body;

  if (!content?.trim()) return res.status(400).json({ error: "Content required" });

  const match = await db.query.matchesTable.findFirst({ where: eq(matchesTable.id, matchId) });
  if (!match) return res.status(404).json({ error: "Match not found" });
  if (match.userId1 !== user.id && match.userId2 !== user.id) {
    return res.status(403).json({ error: "Forbidden" });
  }

  const [msg] = await db.insert(messagesTable).values({
    matchId,
    senderId: user.id,
    content: content.trim(),
  }).returning();

  res.status(201).json(messageToJson(msg, user.clerkId));
});

export default router;
