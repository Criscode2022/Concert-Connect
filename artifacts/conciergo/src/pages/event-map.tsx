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
      // Use CSS vars from theme
      const bg = event.isAttending ? "hsl(15 75% 55%)" : "hsl(0 0% 100%)";
      const border = event.isAttending ? "hsl(15 75% 45%)" : "hsl(30 15% 90%)";
      const shadow = event.isAttending ? "rgba(238, 93, 38, 0.4)" : "rgba(0,0,0,0.1)";
      const color = event.isAttending ? "#fff" : "hsl(20 15% 15%)";
      
      pin.style.cssText = `
        background: ${bg};
        border: 2px solid ${border};
        border-radius: 50%;
        width: 44px;
        height: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px ${shadow};
        cursor: pointer;
        transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s;
        color: ${color};
      `;
      // SVG instead of emoji
      pin.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>`;
      pin.title = event.title;

      pin.addEventListener('mouseenter', () => {
        pin.style.transform = 'scale(1.1) translateY(-4px)';
        pin.style.boxShadow = `0 8px 16px ${shadow}`;
      });
      pin.addEventListener('mouseleave', () => {
        pin.style.transform = 'scale(1) translateY(0)';
        pin.style.boxShadow = `0 4px 12px ${shadow}`;
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
    <AppLayout title="Mapa de Conciertos">
      <div className="relative w-full h-[calc(100dvh-72px)] md:h-full">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background z-10">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        {mapError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background z-10 gap-4">
            <div className="bg-card border border-border w-16 h-16 rounded-full flex items-center justify-center">
              <MapPin className="w-8 h-8 text-muted-foreground stroke-[1.5]" />
            </div>
            <p className="text-muted-foreground text-center px-8 font-medium">{mapError}</p>
          </div>
        )}

        <div ref={mapRef} className="w-full h-full" />

        <AnimatePresence>
          {selectedEvent && (
            <motion.div
              initial={{ y: 20, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute bottom-6 left-4 right-4 md:left-auto md:right-8 md:w-[400px] z-20"
            >
              <div className="bg-card border border-border rounded-2xl p-5 shadow-xl">
                <button
                  className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  onClick={() => setSelectedEvent(null)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
                <div className="flex items-start gap-4 mb-5 pr-8">
                  <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                    <Music className="w-6 h-6 text-foreground stroke-[1.5]" />
                  </div>
                  <div className="min-w-0 pt-1">
                    <h3 className="font-serif text-xl leading-tight text-foreground truncate">{selectedEvent.artistName}</h3>
                    <p className="text-sm text-muted-foreground truncate">{selectedEvent.venueName}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 text-sm text-muted-foreground mb-6">
                  <span className="flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded-md">
                    <Calendar className="w-4 h-4 stroke-[1.5]" />
                    {format(new Date(selectedEvent.date), "d MMM yyyy", { locale: es })}
                  </span>
                  <span className="flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded-md">
                    <Users className="w-4 h-4 stroke-[1.5]" />
                    {selectedEvent.attendeesCount} asisten
                  </span>
                  {selectedEvent.genre && <Badge variant="outline" className="font-normal">{selectedEvent.genre}</Badge>}
                </div>
                <Button
                  className={`w-full h-11 rounded-xl font-medium transition-all ${selectedEvent.isAttending ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80' : 'bg-primary text-primary-foreground hover:bg-primary/90'}`}
                  onClick={handleAttend}
                  disabled={attendEvent.isPending || unattendEvent.isPending}
                >
                  {attendEvent.isPending || unattendEvent.isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : selectedEvent.isAttending ? (
                    "Ya voy — Cancelar"
                  ) : (
                    "Quiero ir"
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