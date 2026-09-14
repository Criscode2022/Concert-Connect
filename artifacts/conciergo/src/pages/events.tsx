import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { AppLayout } from "@/components/layout/app-layout";
import { EventsListSkeleton } from "@/components/events/events-skeleton";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useListEvents,
  useAttendEvent,
  useUnattendEvent,
} from "@workspace/api-client-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Plus,
  MapPin,
  Calendar as CalendarIcon,
  Users,
  Music,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { invalidateAfterAttendance } from "@/lib/queryClient";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

function eventImageUrls(events: { imageUrl?: string | null }[] | undefined) {
  if (!events) return null;
  return [
    ...new Set(
      events
        .map((event) => event.imageUrl)
        .filter((url): url is string => Boolean(url)),
    ),
  ];
}

function imagesAlreadyReady(events: { imageUrl?: string | null }[] | undefined) {
  const urls = eventImageUrls(events);
  if (!urls) return false;
  if (urls.length === 0) return true;
  return urls.every((src) => {
    const image = new Image();
    image.src = src;
    return image.complete;
  });
}

function useEventImagesReady(events: { imageUrl?: string | null }[] | undefined) {
  const [ready, setReady] = useState(() => imagesAlreadyReady(events));

  useEffect(() => {
    if (imagesAlreadyReady(events)) {
      setReady(true);
      return;
    }

    const urls = eventImageUrls(events);
    if (!urls) {
      setReady(false);
      return;
    }

    let cancelled = false;
    let settled = 0;
    const finish = () => {
      settled += 1;
      if (!cancelled && settled >= urls.length) {
        setReady(true);
      }
    };

    const timeout = window.setTimeout(() => {
      if (!cancelled) setReady(true);
    }, 2500);

    urls.forEach((src) => {
      const image = new Image();
      image.onload = finish;
      image.onerror = finish;
      image.src = src;
    });

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, [events]);

  return ready;
}

export default function Events() {
  const { isSignedIn } = useAuth();
  const { toast } = useToast();
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [, setLocation] = useLocation();
  const { data: events, isLoading, isError, error, refetch } = useListEvents();
  const imagesReady = useEventImagesReady(events);
  const showSkeleton = !isError && (isLoading || !imagesReady);

  const attendEvent = useAttendEvent();
  const unattendEvent = useUnattendEvent();

  const genres = useMemo(
    () => [...new Set(events?.filter((e) => e.genre).map((e) => e.genre!))].sort(),
    [events],
  );

  const filteredEvents = useMemo(
    () => (selectedGenre ? events?.filter((e) => e.genre === selectedGenre) : events),
    [events, selectedGenre],
  );

  const onAttendError = () => {
    toast({
      title: "No se pudo apuntar al bolo",
      description: "Vuelve a iniciar sesión e inténtalo de nuevo.",
      variant: "destructive",
    });
  };

  const toggleAttend = (
    e: React.MouseEvent,
    eventId: number,
    isAttending: boolean,
  ) => {
    e.preventDefault();
    if (isAttending) {
      unattendEvent.mutate(
        { eventId },
        {
          onSuccess: () => void invalidateAfterAttendance(),
          onError: onAttendError,
        },
      );
    } else {
      attendEvent.mutate(
        { eventId },
        {
          onSuccess: () => void invalidateAfterAttendance(),
          onError: onAttendError,
        },
      );
    }
  };

  const fab = isSignedIn ? (
    <Button
      className="w-16 h-16 rounded-full shadow-[4px_4px_0px_0px_hsl(var(--foreground))] hover:shadow-[6px_6px_0px_0px_hsl(var(--foreground))] hover:-translate-y-1 hover:-translate-x-1 transition-all p-0 bg-primary text-primary-foreground border-2 border-foreground"
      onClick={() => setLocation("/events/new")}
    >
      <Plus className="w-8 h-8 stroke-[3]" />
    </Button>
  ) : undefined;

  return (
    <AppLayout title="Eventos" fab={fab}>
      <div className="p-4 md:p-10 max-w-5xl mx-auto pb-32 md:pb-12">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-serif font-bold uppercase tracking-tighter mb-5 text-foreground">
            Cartelera
          </h1>

          {showSkeleton && (
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-8 w-20 rounded-lg border-2 border-foreground/15" />
              <Skeleton className="h-8 w-24 rounded-lg border-2 border-foreground/15" />
              <Skeleton className="h-8 w-16 rounded-lg border-2 border-foreground/15" />
            </div>
          )}

          {!showSkeleton && genres.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {genres.map((genre) => {
                const active = selectedGenre === genre;
                return (
                  <button
                    key={genre}
                    onClick={() => setSelectedGenre((g) => (g === genre ? null : genre))}
                    className={`cursor-pointer px-3 py-1.5 rounded-lg border-2 font-bold text-xs uppercase tracking-widest transition-all ${
                      active
                        ? "bg-primary border-foreground text-primary-foreground shadow-[3px_3px_0px_0px_hsl(var(--foreground))] -translate-y-0.5 -translate-x-0.5"
                        : "bg-card border-foreground text-foreground hover:bg-muted hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_hsl(var(--foreground))]"
                    }`}
                  >
                    {genre}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {isError ? (
          <div className="text-center py-16 px-4 bg-card border-2 border-destructive rounded-3xl">
            <h3 className="text-2xl font-serif font-bold uppercase mb-3">No se pudieron cargar los eventos</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              {error instanceof Error ? error.message : "La API no respondió. Revisa DATABASE_URL en Vercel."}
            </p>
            <Button onClick={() => void refetch()} className="rounded-xl h-12 px-6 font-bold uppercase">
              Reintentar
            </Button>
          </div>
        ) : showSkeleton ? (
          <EventsListSkeleton />
        ) : filteredEvents?.length === 0 ? (
          <div className="text-center py-24 px-4 bg-card border-2 border-dashed border-foreground/30 rounded-3xl">
            <div className="bg-background border-2 border-foreground w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[4px_4px_0px_0px_hsl(var(--foreground))] transform -rotate-3">
              <CalendarIcon className="w-10 h-10 text-foreground stroke-[2]" />
            </div>
            <h3 className="text-3xl font-serif font-bold uppercase mb-4">
              La pista está vacía
            </h3>
            <p className="text-lg font-medium text-muted-foreground mb-8 max-w-md mx-auto">
              Sé el primero en añadir un bolo a la ciudad y encuentra compañía.
            </p>
            <Button
              onClick={() => setLocation("/events/new")}
              className="rounded-xl h-14 px-8 bg-foreground text-background font-bold uppercase tracking-wide hover:-translate-y-1 hover:-translate-x-1 shadow-[4px_4px_0px_0px_hsl(var(--primary))] transition-all"
            >
              Añadir evento
            </Button>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
          >
            {filteredEvents?.map((event) => (
              <div key={event.id}>
                <Link href={`/events/${event.id}`}>
                  <div className="group block bg-card rounded-2xl border-2 border-foreground overflow-hidden cursor-pointer hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[8px_8px_0px_0px_hsl(var(--foreground))] transition-all flex flex-col h-full">
                    {/* Image */}
                    <div className="h-32 md:h-48 w-full bg-muted relative border-b-2 border-foreground overflow-hidden">
                      {event.imageUrl ? (
                        <img
                          src={event.imageUrl}
                          alt={event.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-chart-4 flex items-center justify-center transition-transform duration-700 group-hover:scale-105">
                          <Music className="w-12 h-12 text-foreground/50 stroke-[1.5]" />
                        </div>
                      )}

                      {/* Genre chip — top left of image */}
                      {event.genre && (
                        <button
                          className="absolute top-3 left-3 bg-primary text-primary-foreground border-2 border-foreground px-3 py-1 rounded-lg font-bold text-xs uppercase tracking-widest shadow-[2px_2px_0px_0px_hsl(var(--foreground))] transform -rotate-1 z-10 cursor-pointer hover:scale-105 transition-transform"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setSelectedGenre((g) => (g === event.genre ? null : event.genre!));
                          }}
                        >
                          {event.genre}
                        </button>
                      )}

                      {/* Date badge — top right */}
                      <div className="absolute top-3 right-3 bg-background border-2 border-foreground text-foreground px-3 py-1 rounded-lg font-bold text-sm shadow-[2px_2px_0px_0px_hsl(var(--foreground))] transform rotate-2 z-10">
                        {format(new Date(event.date), "d MMM", { locale: es }).toUpperCase()}
                      </div>
                    </div>

                    {/* Card body */}
                    <div className="p-3 md:p-5 flex-1 flex flex-col">
                      <div className="mb-auto">
                        <h3 className="text-lg md:text-2xl font-serif font-bold text-foreground uppercase tracking-tight leading-none mb-1 group-hover:text-primary transition-colors">
                          {event.artistName}
                        </h3>
                        <p className="text-sm md:text-base font-bold text-muted-foreground mb-2 truncate">
                          {event.title}
                        </p>

                        <div className="flex items-center text-sm font-bold text-foreground gap-3 flex-wrap">
                          <span className="flex items-center gap-1.5 bg-muted px-2.5 py-1 rounded-md border-2 border-transparent">
                            <MapPin className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span className="truncate">{event.venueName}</span>
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-5 pt-4 border-t-2 border-dashed border-border">
                        <div className="flex items-center gap-2">
                          <Users className="w-5 h-5 text-foreground stroke-[2]" />
                          <span className="text-sm font-bold uppercase tracking-wider">
                            {event.attendeesCount || 0}
                          </span>
                        </div>

                        {isSignedIn && (
                          <Button
                            size="sm"
                            className={`rounded-xl h-10 px-5 font-bold uppercase tracking-widest text-xs border-2 transition-all ${
                              event.isAttending
                                ? "bg-primary border-foreground text-primary-foreground shadow-[2px_2px_0px_0px_hsl(var(--foreground))]"
                                : "bg-background border-foreground text-foreground hover:bg-muted hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[2px_2px_0px_0px_hsl(var(--foreground))]"
                            }`}
                            onClick={(e) => toggleAttend(e, event.id, event.isAttending || false)}
                            disabled={attendEvent.isPending || unattendEvent.isPending}
                          >
                            {event.isAttending ? "Apuntado · Cancelar" : "Apuntarme"}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </motion.div>
        )}

      </div>
    </AppLayout>
  );
}
