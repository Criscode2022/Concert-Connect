import { Router } from "express";
import { db } from "@workspace/db";
import { eventsTable, eventAttendeesTable, matchesTable, usersTable } from "@workspace/db";
import { eq, and, sql, desc } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth";
import { userToJson } from "./users";

const router = Router();

function eventToJson(event: any, createdBy: any, attendeesCount: number, isAttending: boolean) {
  return {
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
    createdBy: createdBy ? userToJson(createdBy) : null,
    attendeesCount,
    isAttending,
    createdAt: event.createdAt instanceof Date ? event.createdAt.toISOString() : event.createdAt,
  };
}

async function enrichEvent(event: any, currentUserId: number) {
  const [createdBy, attendees] = await Promise.all([
    db.query.usersTable.findFirst({ where: eq(usersTable.id, event.createdByUserId) }),
    db.select().from(eventAttendeesTable).where(eq(eventAttendeesTable.eventId, event.id)),
  ]);
  const isAttending = attendees.some((a) => a.userId === currentUserId);
  return eventToJson(event, createdBy, attendees.length, isAttending);
}

router.get("/events/stats", requireAuth, async (req, res) => {
  const [totalEvents, totalUsers, upcomingEvents, genreRows] = await Promise.all([
    db.select({ count: sql<number>`count(*)::int` }).from(eventsTable),
    db.select({ count: sql<number>`count(*)::int` }).from(usersTable),
    db.select({ count: sql<number>`count(*)::int` }).from(eventsTable).where(sql`date > now()`),
    db.select({
      genre: eventsTable.genre,
      count: sql<number>`count(*)::int`,
    }).from(eventsTable).groupBy(eventsTable.genre).orderBy(desc(sql`count(*)`)).limit(5),
  ]);

  res.json({
    totalEvents: totalEvents[0]?.count ?? 0,
    totalUsers: totalUsers[0]?.count ?? 0,
    upcomingEvents: upcomingEvents[0]?.count ?? 0,
    topGenres: genreRows.filter(r => r.genre).map(r => ({ genre: r.genre!, count: r.count })),
  });
});

router.get("/events", requireAuth, async (req, res) => {
  const user = (req as any).dbUser;
  const { genre } = req.query as { genre?: string };

  let query = db.select().from(eventsTable).orderBy(desc(eventsTable.date)).$dynamic();
  if (genre) {
    query = query.where(eq(eventsTable.genre, genre));
  }

  const events = await query.limit(50);
  const enriched = await Promise.all(events.map((e) => enrichEvent(e, user.id)));
  res.json(enriched);
});

router.post("/events", requireAuth, async (req, res) => {
  const user = (req as any).dbUser;
  const { title, artistName, venueName, venueAddress, date, lat, lng, genre, imageUrl } = req.body;

  const [event] = await db.insert(eventsTable).values({
    title,
    artistName,
    venueName,
    venueAddress: venueAddress ?? null,
    date: new Date(date),
    lat: Number(lat),
    lng: Number(lng),
    genre: genre ?? null,
    imageUrl: imageUrl ?? null,
    createdByUserId: user.id,
  }).returning();

  await db.insert(eventAttendeesTable).values({ eventId: event.id, userId: user.id }).onConflictDoNothing();

  const enriched = await enrichEvent(event, user.id);
  res.status(201).json(enriched);
});

router.get("/events/:eventId", requireAuth, async (req, res) => {
  const user = (req as any).dbUser;
  const event = await db.query.eventsTable.findFirst({
    where: eq(eventsTable.id, Number(req.params.eventId)),
  });
  if (!event) return res.status(404).json({ error: "Event not found" });
  const enriched = await enrichEvent(event, user.id);
  res.json(enriched);
});

router.delete("/events/:eventId", requireAuth, async (req, res) => {
  const user = (req as any).dbUser;
  const event = await db.query.eventsTable.findFirst({
    where: eq(eventsTable.id, Number(req.params.eventId)),
  });
  if (!event) return res.status(404).json({ error: "Event not found" });
  if (event.createdByUserId !== user.id) return res.status(403).json({ error: "Forbidden" });

  await db.delete(eventsTable).where(eq(eventsTable.id, event.id));
  res.status(204).send();
});

router.post("/events/:eventId/attend", requireAuth, async (req, res) => {
  const user = (req as any).dbUser;
  const eventId = Number(req.params.eventId);

  const event = await db.query.eventsTable.findFirst({ where: eq(eventsTable.id, eventId) });
  if (!event) return res.status(404).json({ error: "Event not found" });

  await db.insert(eventAttendeesTable).values({ eventId, userId: user.id }).onConflictDoNothing();

  const otherAttendees = await db
    .select()
    .from(eventAttendeesTable)
    .where(and(eq(eventAttendeesTable.eventId, eventId), sql`user_id != ${user.id}`));

  for (const attendee of otherAttendees) {
    const u1 = Math.min(user.id, attendee.userId);
    const u2 = Math.max(user.id, attendee.userId);
    await db.insert(matchesTable).values({ eventId, userId1: u1, userId2: u2 }).onConflictDoNothing();
  }

  const enriched = await enrichEvent(event, user.id);
  res.json(enriched);
});

router.delete("/events/:eventId/attend", requireAuth, async (req, res) => {
  const user = (req as any).dbUser;
  const eventId = Number(req.params.eventId);

  await db
    .delete(eventAttendeesTable)
    .where(and(eq(eventAttendeesTable.eventId, eventId), eq(eventAttendeesTable.userId, user.id)));

  res.status(204).send();
});

export default router;
