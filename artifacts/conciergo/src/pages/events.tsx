import { AppLayout } from "@/components/layout/app-layout";
import { useListEvents, useAttendEvent, useUnattendEvent, getListEventsQueryKey } from "@workspace/api-client-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Plus, MapPin, Calendar as CalendarIcon, Users } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function Events() {
  const [search, setSearch] = useState("");
  const [, setLocation] = useLocation();
  const { data: events, isLoading } = useListEvents({ genre: search || undefined });
  const queryClient = useQueryClient();

  const attendEvent = useAttendEvent();
  const unattendEvent = useUnattendEvent();

  const toggleAttend = (e: React.MouseEvent, eventId: number, isAttending: boolean) => {
    e.preventDefault();
    if (isAttending) {
      unattendEvent.mutate({ eventId }, {
        onSuccess: () => queryClient.invalidateQueries({ queryKey: getListEventsQueryKey() })
      });
    } else {
      attendEvent.mutate({ eventId }, {
        onSuccess: () => queryClient.invalidateQueries({ queryKey: getListEventsQueryKey() })
      });
    }
  };

  return (
    <AppLayout title="Eventos">
      <div className="p-4 md:p-8 max-w-4xl mx-auto pb-24 md:pb-8">
        <div className="mb-8 flex gap-3 items-center">
          <Input 
            placeholder="Buscar por género..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 h-12 bg-card rounded-xl border-border"
          />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-card rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : events?.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-card border border-border w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CalendarIcon className="w-8 h-8 text-muted-foreground stroke-[1.5]" />
            </div>
            <h3 className="text-2xl font-serif mb-3">No hay eventos</h3>
            <p className="text-muted-foreground mb-8">Sé el primero en añadir un concierto a la ciudad.</p>
            <Button onClick={() => setLocation("/events/new")} className="rounded-xl h-11 px-6 bg-foreground text-background hover:bg-foreground/90">Añadir evento</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {events?.map((event, index) => (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
                key={event.id}
              >
                <Link href={`/events/${event.id}`}>
                  <div className="group block bg-card rounded-2xl border border-border overflow-hidden cursor-pointer hover:border-primary/30 transition-colors">
                    <div className="h-40 w-full bg-muted relative">
                      {event.imageUrl ? (
                        <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      ) : (
                        <div className="w-full h-full bg-secondary flex items-center justify-center transition-transform duration-700 group-hover:scale-105">
                           <CalendarIcon className="w-8 h-8 text-muted-foreground/50 stroke-[1]" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-4 left-5 right-5">
                        <h3 className="text-2xl font-serif text-white truncate drop-shadow-sm">{event.title}</h3>
                        <p className="text-sm text-white/90 font-medium truncate drop-shadow-sm">{event.artistName}</p>
                      </div>
                    </div>
                    
                    <div className="p-5">
                      <div className="flex items-center text-sm text-muted-foreground mb-4 gap-4">
                        <span className="flex items-center gap-1.5">
                          <CalendarIcon className="w-4 h-4 stroke-[1.5]" />
                          {format(new Date(event.date), "d MMM, yyyy", { locale: es })}
                        </span>
                        <span className="flex items-center gap-1.5 truncate">
                          <MapPin className="w-4 h-4 stroke-[1.5]" />
                          <span className="truncate">{event.venueName}</span>
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-muted-foreground stroke-[1.5]" />
                          <span className="text-sm font-medium">{event.attendeesCount || 0} asisten</span>
                        </div>
                        
                        <Button 
                          variant={event.isAttending ? "secondary" : "default"}
                          size="sm"
                          className={`rounded-lg h-9 px-4 font-medium transition-all ${event.isAttending ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-card border border-border text-foreground hover:bg-muted"}`}
                          onClick={(e) => toggleAttend(e, event.id, event.isAttending || false)}
                          disabled={attendEvent.isPending || unattendEvent.isPending}
                        >
                          {event.isAttending ? "¡Voy a ir!" : "Quiero ir"}
                        </Button>
                      </div>
                      {event.genre && (
                        <Badge variant="outline" className="mt-4 bg-background font-normal rounded-md border-border text-muted-foreground">
                          {event.genre}
                        </Badge>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        <Button 
          className="fixed bottom-20 md:bottom-8 right-4 md:right-8 w-14 h-14 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all p-0 bg-primary text-primary-foreground"
          onClick={() => setLocation("/events/new")}
        >
          <Plus className="w-6 h-6 stroke-[2]" />
        </Button>
      </div>
    </AppLayout>
  );
}