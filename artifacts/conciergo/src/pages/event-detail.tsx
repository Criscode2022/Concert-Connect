import { AppLayout } from "@/components/layout/app-layout";
import { useGetEvent, getGetEventQueryKey, useAttendEvent, useUnattendEvent } from "@workspace/api-client-react";
import { useParams } from "wouter";
import { Loader2, Calendar, MapPin, Users, Share2, Music } from "lucide-react";
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
      <AppLayout title="Detalles del Evento" showBack>
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </AppLayout>
    );
  }

  if (!event) {
    return (
      <AppLayout title="Evento no encontrado" showBack>
        <div className="p-8 text-center text-muted-foreground flex flex-col items-center gap-4 py-20">
          <Calendar className="w-12 h-12 stroke-[1]" />
          <p className="text-lg">No se pudo encontrar el evento.</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Detalles del Evento" showBack>
      <div className="w-full max-w-3xl mx-auto pb-24 md:pb-12 md:px-6 md:pt-6">
        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="bg-card md:border border-border md:rounded-3xl overflow-hidden shadow-sm"
        >
          <div className="relative w-full h-64 md:h-80 bg-muted">
            {event.imageUrl ? (
              <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-secondary flex items-center justify-center">
                <Music className="w-16 h-16 text-muted-foreground/40 stroke-[1]" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 md:bottom-8 md:left-8">
               {event.genre && (
                <Badge variant="outline" className="mb-4 bg-white/10 text-white border-white/20 backdrop-blur-md font-medium">
                  {event.genre}
                </Badge>
              )}
              <h1 className="text-3xl md:text-5xl font-serif text-white mb-2 tracking-tight leading-tight drop-shadow-md">{event.title}</h1>
              <p className="text-xl md:text-2xl text-white/90 font-medium drop-shadow-sm">{event.artistName}</p>
            </div>
          </div>

          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-muted p-3 rounded-2xl">
                    <Calendar className="w-6 h-6 text-foreground stroke-[1.5]" />
                  </div>
                  <div className="pt-0.5">
                    <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider mb-1">Fecha</p>
                    <p className="font-medium text-foreground text-lg">{format(new Date(event.date), "EEEE, d 'de' MMMM, yyyy", { locale: es })}</p>
                    <p className="text-muted-foreground">{format(new Date(event.date), "HH:mm")}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-muted p-3 rounded-2xl">
                    <MapPin className="w-6 h-6 text-foreground stroke-[1.5]" />
                  </div>
                  <div className="pt-0.5">
                    <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider mb-1">Ubicación</p>
                    <p className="font-medium text-foreground text-lg">{event.venueName}</p>
                    {event.venueAddress && <p className="text-muted-foreground">{event.venueAddress}</p>}
                  </div>
                </div>
              </div>

              <div className="bg-background rounded-2xl p-6 border border-border flex flex-col items-center justify-center text-center">
                <div className="bg-primary/10 text-primary p-4 rounded-full mb-4">
                  <Users className="w-8 h-8 stroke-[1.5]" />
                </div>
                <h3 className="text-3xl font-serif mb-1">{event.attendeesCount || 0}</h3>
                <p className="text-muted-foreground font-medium">Asistentes confirmados</p>
              </div>
            </div>

            <div className="flex gap-4">
              <Button 
                className={`flex-1 h-14 text-base rounded-xl font-medium shadow-sm transition-all ${event.isAttending ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80' : 'bg-foreground text-background hover:bg-foreground/90'}`}
                onClick={toggleAttend}
                disabled={attendEvent.isPending || unattendEvent.isPending}
              >
                {event.isAttending ? "¡Vas a ir!" : "Quiero ir"}
              </Button>
              
              <Button variant="outline" size="icon" className="h-14 w-14 rounded-xl border-border bg-background hover:bg-muted">
                <Share2 className="w-5 h-5 stroke-[1.5]" />
              </Button>
            </div>
            
            <AnimatePresence>
              {event.isAttending && (
                <motion.div 
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginTop: 40 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  className="overflow-hidden"
                >
                  <h3 className="text-xl font-serif mb-4 flex items-center gap-2">
                    Compañeros sugeridos
                  </h3>
                  <div className="bg-background border border-border rounded-2xl p-8 text-center">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-muted-foreground stroke-[1.5]" />
                    </div>
                    <p className="text-foreground font-medium mb-1">Buscando compañeros ideales...</p>
                    <p className="text-sm text-muted-foreground max-w-sm mx-auto">Te conectaremos con otras personas que vayan a este concierto para que podáis hacer un plan.</p>
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