import { useEffect, useRef, useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { useListEvents, useAttendEvent, useUnattendEvent, getListEventsQueryKey } from "@workspace/api-client-react";
import { Loader2, Music, MapPin, Calendar, Users } from "lucide-react";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";
import { useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { es } from "date-fns/locale";

type Event = {
  id: number;
  title: string;
  artistName: string;
  venueName: string;
  venueAddress?: string | null;
  date: string;
  lat: number;
  lng: number;
  genre?: string | null;
  imageUrl?: string | null;
  attendeesCount: number;
  isAttending: boolean;
};

export default function EventMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const queryClient = useQueryClient();

  const { data: events, isLoading } = useListEvents();
  const attendEvent = useAttendEvent();
  const unattendEvent = useUnattendEvent();

  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      setMapError("Clave de API de Google Maps no configurada.");
      return;
    }

    setOptions({ key: apiKey, version: "weekly" });

    importLibrary("maps")
      .then(() => importLibrary("marker"))
      .then(() => setMapReady(true))
      .catch(() => setMapError("No se pudo cargar Google Maps."));
  }, []);

  useEffect(() => {
    if (!mapReady || !mapRef.current || mapInstance.current) return;

    mapInstance.current = new google.maps.Map(mapRef.current, {
      center: { lat: 40.4168, lng: -3.7038 },
      zoom: 6,
      mapId: "DEMO_MAP_ID",
      disableDefaultUI: false,
      zoomControl: true,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    });
  }, [mapReady]);

  useEffect(() => {
    if (!mapInstance.current || !events?.length) return;

    markersRef.current.forEach((m) => (m.map = null));
    markersRef.current = [];

    events.forEach((event) => {
      const pin = document.createElement("div");
      
      const bg = event.isAttending ? "hsl(15 75% 55%)" : "hsl(0 0% 100%)";
      const border = "hsl(20 15% 15%)"; // Always dark border for the gig poster vibe
      const shadow = "4px 4px 0px 0px hsl(20 15% 15%)";
      const color = event.isAttending ? "#fff" : "hsl(20 15% 15%)";
      
      pin.style.cssText = `
        background: ${bg};
        border: 2px solid ${border};
        border-radius: 12px;
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: ${shadow};
        cursor: pointer;
        transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s;
        color: ${color};
        transform: rotate(${(event.id % 5) - 2}deg);
      `;
      pin.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>`;
      pin.title = event.title;

      pin.addEventListener('mouseenter', () => {
        pin.style.transform = `scale(1.1) translateY(-4px) rotate(${(event.id % 5) - 2}deg)`;
        pin.style.boxShadow = `6px 6px 0px 0px hsl(20 15% 15%)`;
      });
      pin.addEventListener('mouseleave', () => {
        pin.style.transform = `scale(1) translateY(0) rotate(${(event.id % 5) - 2}deg)`;
        pin.style.boxShadow = shadow;
      });

      const eventSnapshot = event as Event;
      pin.addEventListener("click", () => setSelectedEvent(eventSnapshot));

      const marker = new google.maps.marker.AdvancedMarkerElement({
        map: mapInstance.current!,
        position: { lat: event.lat, lng: event.lng },
        content: pin,
        title: event.title,
        gmpClickable: true,
      });
      markersRef.current.push(marker);
    });
  }, [events, mapReady]);

  const handleAttend = () => {
    if (!selectedEvent) return;
    if (selectedEvent.isAttending) {
      unattendEvent.mutate(
        { eventId: selectedEvent.id },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListEventsQueryKey() });
            setSelectedEvent((e) => e ? { ...e, isAttending: false, attendeesCount: e.attendeesCount - 1 } : null);
          },
        }
      );
    } else {
      attendEvent.mutate(
        { eventId: selectedEvent.id },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListEventsQueryKey() });
            setSelectedEvent((e) => e ? { ...e, isAttending: true, attendeesCount: e.attendeesCount + 1 } : null);
          },
        }
      );
    }
  };

  return (
    <AppLayout title="Mapa de Bolos">
      <div className="relative w-full h-[calc(100dvh-72px)] md:h-[calc(100dvh)]">
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-10 gap-4">
            <div className="bg-card border-2 border-foreground w-16 h-16 rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_hsl(var(--foreground))] animate-bounce">
              <MapPin className="w-8 h-8 text-foreground stroke-[2]" />
            </div>
            <p className="font-bold uppercase tracking-widest text-sm">Cargando mapa...</p>
          </div>
        )}

        {mapError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background z-10 gap-6">
            <div className="bg-card border-2 border-foreground w-20 h-20 rounded-2xl flex items-center justify-center shadow-[4px_4px_0px_0px_hsl(var(--foreground))] transform rotate-3">
              <MapPin className="w-10 h-10 text-foreground stroke-[2]" />
            </div>
            <p className="text-foreground text-center px-8 font-bold text-xl uppercase max-w-sm">{mapError}</p>
          </div>
        )}

        <div ref={mapRef} className="w-full h-full" style={{}} />

        <AnimatePresence>
          {selectedEvent && (
            <motion.div
              initial={{ y: 50, opacity: 0, scale: 0.9, rotate: -2 }}
              animate={{ y: 0, opacity: 1, scale: 1, rotate: 0 }}
              exit={{ y: 50, opacity: 0, scale: 0.9, rotate: 2 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="absolute bottom-6 left-4 right-4 md:left-auto md:bottom-10 md:right-10 md:w-[420px] z-20"
            >
              <div className="bg-card border-2 border-foreground rounded-2xl p-6 shadow-[8px_8px_0px_0px_hsl(var(--foreground))] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full pointer-events-none" />
                
                <button
                  className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-xl bg-background border-2 border-foreground text-foreground hover:bg-muted hover:-translate-y-0.5 hover:shadow-[2px_2px_0px_0px_hsl(var(--foreground))] transition-all z-10"
                  onClick={() => setSelectedEvent(null)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
                <div className="flex items-start gap-5 mb-6 pr-12 relative z-10">
                  <div className="w-16 h-16 rounded-xl bg-chart-4 border-2 border-foreground flex items-center justify-center flex-shrink-0 shadow-[2px_2px_0px_0px_hsl(var(--foreground))] transform -rotate-3">
                    <Music className="w-8 h-8 text-foreground stroke-[2]" />
                  </div>
                  <div className="min-w-0 pt-1">
                    <h3 className="font-serif font-bold text-2xl uppercase leading-none text-foreground mb-2 truncate group-hover:text-primary transition-colors">{selectedEvent.artistName}</h3>
                    <p className="text-base font-bold text-muted-foreground truncate">{selectedEvent.venueName}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3 text-sm text-foreground font-bold mb-6 relative z-10">
                  <span className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded-lg border-2 border-transparent">
                    <Calendar className="w-4 h-4 stroke-[2.5]" />
                    {format(new Date(selectedEvent.date), "d MMM", { locale: es }).toUpperCase()}
                  </span>
                  <span className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded-lg border-2 border-transparent">
                    <Users className="w-4 h-4 stroke-[2.5]" />
                    {selectedEvent.attendeesCount} ASISTEN
                  </span>
                  {selectedEvent.genre && (
                    <Badge variant="outline" className="font-bold uppercase tracking-wider bg-background border-2 border-foreground shadow-[2px_2px_0px_0px_hsl(var(--foreground))] transform rotate-2">
                      {selectedEvent.genre}
                    </Badge>
                  )}
                </div>
                <Button
                  className={`w-full h-14 rounded-xl font-bold uppercase tracking-wider text-base border-2 transition-all shadow-[4px_4px_0px_0px_hsl(var(--foreground))] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0px_0px_hsl(var(--foreground))] relative z-10 ${selectedEvent.isAttending ? 'bg-background text-foreground border-foreground' : 'bg-primary border-foreground text-primary-foreground'}`}
                  onClick={handleAttend}
                  disabled={attendEvent.isPending || unattendEvent.isPending}
                >
                  {attendEvent.isPending || unattendEvent.isPending ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : selectedEvent.isAttending ? (
                    "¡Voy a este bolo! — Cancelar"
                  ) : (
                    "¡Me apunto!"
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
}