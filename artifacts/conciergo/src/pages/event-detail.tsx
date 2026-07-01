import { AppLayout } from "@/components/layout/app-layout";
import { useGetEvent, getGetEventQueryKey, useAttendEvent, useUnattendEvent } from "@workspace/api-client-react";
import { useParams } from "wouter";
import { Loader2, Calendar, MapPin, Users, Share2, Music, Ticket } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { AnimatePresence, motion } from "framer-motion";

export default function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const eventId = parseInt(id, 10);
  
  const { data: event, isLoading } = useGetEvent(eventId, {
    query: { enabled: !!eventId, queryKey: getGetEventQueryKey(eventId) }
  });

  const queryClient = useQueryClient();
  const attendEvent = useAttendEvent();
  const unattendEvent = useUnattendEvent();

  const toggleAttend = () => {
    if (!event) return;
    
    if (event.isAttending) {
      unattendEvent.mutate({ eventId }, {
        onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetEventQueryKey(eventId) })
      });
    } else {
      attendEvent.mutate({ eventId }, {
        onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetEventQueryKey(eventId) })
      });
    }
  };

  if (isLoading) {
    return (
      <AppLayout title="El Cartel" showBack>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="bg-card border-2 border-foreground p-4 rounded-full shadow-[4px_4px_0px_0px_hsl(var(--foreground))] animate-spin-slow">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!event) {
    return (
      <AppLayout title="Bolo Perdido" showBack>
        <div className="p-8 text-center text-foreground flex flex-col items-center gap-6 py-24">
          <div className="bg-chart-4 border-2 border-foreground w-24 h-24 rounded-2xl flex items-center justify-center shadow-[4px_4px_0px_0px_hsl(var(--foreground))] transform rotate-6">
            <Ticket className="w-12 h-12 stroke-[2]" />
          </div>
          <p className="text-2xl font-serif font-bold uppercase tracking-wider">Este bolo ya no existe</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="El Cartel" showBack>
      <div className="w-full max-w-4xl mx-auto pb-32 md:pb-16 md:px-8 md:pt-10">
        <motion.div 
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: "spring", bounce: 0.3 }}
          className="bg-card md:border-2 border-foreground md:rounded-3xl overflow-hidden shadow-none md:shadow-[8px_8px_0px_0px_hsl(var(--foreground))]"
        >
          <div className="relative w-full h-72 md:h-96 bg-muted border-b-2 border-foreground overflow-hidden">
            {event.imageUrl ? (
              <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover scale-105" style={{ filter: 'contrast(1.1) saturate(1.2)' }} />
            ) : (
              <div className="w-full h-full bg-chart-5 flex items-center justify-center">
                <Music className="w-24 h-24 text-background/50 stroke-[2] transform -rotate-12" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            
            {/* Stamp decoration */}
            <div className="absolute top-6 right-6 border-4 border-primary text-primary px-4 py-2 rounded-xl transform rotate-12 font-bold font-serif text-xl tracking-widest uppercase opacity-90 backdrop-blur-md bg-black/20 mix-blend-screen">
              EN DIRECTO
            </div>

            <div className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10 z-10">
               {event.genre && (
                <Badge variant="outline" className="mb-4 bg-primary text-primary-foreground border-2 border-foreground font-bold uppercase tracking-widest text-sm shadow-[2px_2px_0px_0px_hsl(var(--foreground))] transform -rotate-1">
                  {event.genre}
                </Badge>
              )}
              <h1 className="text-4xl md:text-7xl font-serif font-bold text-white mb-2 tracking-tighter leading-[0.9] uppercase drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">{event.artistName}</h1>
              <p className="text-2xl md:text-3xl text-primary font-bold italic drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] max-w-2xl">{event.title}</p>
            </div>
          </div>

          <div className="p-6 md:p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <div className="space-y-6">
                <div className="flex items-start gap-5 bg-background p-4 rounded-2xl border-2 border-border">
                  <div className="bg-primary p-3 rounded-xl border-2 border-foreground shadow-[2px_2px_0px_0px_hsl(var(--foreground))] transform -rotate-3">
                    <Calendar className="w-6 h-6 text-primary-foreground stroke-[2.5]" />
                  </div>
                  <div className="pt-1">
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mb-1">Cuándo</p>
                    <p className="font-bold text-foreground text-xl uppercase leading-none mb-1">{format(new Date(event.date), "d 'de' MMMM", { locale: es })}</p>
                    <p className="text-muted-foreground font-medium">{format(new Date(event.date), "yyyy • HH:mm")}H</p>
                  </div>
                </div>

                <div className="flex items-start gap-5 bg-background p-4 rounded-2xl border-2 border-border">
                  <div className="bg-chart-4 p-3 rounded-xl border-2 border-foreground shadow-[2px_2px_0px_0px_hsl(var(--foreground))] transform rotate-3">
                    <MapPin className="w-6 h-6 text-foreground stroke-[2.5]" />
                  </div>
                  <div className="pt-1">
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mb-1">Dónde</p>
                    <p className="font-bold text-foreground text-xl uppercase leading-none mb-1">{event.venueName}</p>
                    {event.venueAddress && <p className="text-muted-foreground font-medium">{event.venueAddress}</p>}
                  </div>
                </div>
              </div>

              <div className="bg-background rounded-2xl p-6 border-2 border-foreground flex flex-col items-center justify-center text-center shadow-[4px_4px_0px_0px_hsl(var(--foreground))] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full pointer-events-none" />
                <div className="bg-primary text-primary-foreground p-4 rounded-full mb-4 border-2 border-foreground shadow-[2px_2px_0px_0px_hsl(var(--foreground))] transform -rotate-6 z-10">
                  <Users className="w-8 h-8 stroke-[2.5]" />
                </div>
                <h3 className="text-6xl font-serif font-bold text-foreground mb-1 leading-none z-10">{event.attendeesCount || 0}</h3>
                <p className="text-muted-foreground font-bold uppercase tracking-widest text-sm z-10">Ya están apuntados</p>
              </div>
            </div>

            <div className="flex gap-4">
              <Button 
                className={`flex-1 h-16 text-lg rounded-xl font-bold uppercase tracking-widest border-2 transition-all hover:-translate-y-1 hover:-translate-x-1 shadow-[4px_4px_0px_0px_hsl(var(--foreground))] hover:shadow-[6px_6px_0px_0px_hsl(var(--foreground))] ${event.isAttending ? 'bg-background text-foreground border-foreground' : 'bg-primary text-primary-foreground border-foreground'}`}
                onClick={toggleAttend}
                disabled={attendEvent.isPending || unattendEvent.isPending}
              >
                {event.isAttending ? "¡Vas a ir!" : "Me apunto"}
              </Button>
              
              <Button variant="outline" size="icon" className="h-16 w-16 rounded-xl border-2 border-foreground bg-background hover:bg-muted shadow-[4px_4px_0px_0px_hsl(var(--foreground))] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0px_0px_hsl(var(--foreground))] transition-all">
                <Share2 className="w-6 h-6 stroke-[2.5]" />
              </Button>
            </div>
            
            <AnimatePresence>
              {event.isAttending && (
                <motion.div 
                  initial={{ opacity: 0, height: 0, y: 20 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -20 }}
                  transition={{ type: "spring", bounce: 0.3 }}
                  className="overflow-hidden mt-10"
                >
                  <h3 className="text-2xl font-serif font-bold uppercase tracking-tight mb-4 flex items-center gap-3">
                    <span className="bg-primary w-3 h-3 rounded-full inline-block animate-pulse" />
                    Tus Compañeros
                  </h3>
                  <div className="bg-chart-3/10 border-2 border-chart-3/30 rounded-2xl p-8 text-center relative overflow-hidden">
                    <div className="w-20 h-20 bg-background border-2 border-foreground rounded-full flex items-center justify-center mx-auto mb-5 shadow-[4px_4px_0px_0px_hsl(var(--foreground))]">
                      <Users className="w-10 h-10 text-foreground stroke-[2]" />
                    </div>
                    <p className="text-foreground font-bold text-xl uppercase tracking-wider mb-2">Buscando el grupo ideal...</p>
                    <p className="text-base text-muted-foreground font-medium max-w-sm mx-auto">Te conectaremos con otras personas que vayan a este bolo para que podáis hacer un plan y disfrutarlo a tope.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
}