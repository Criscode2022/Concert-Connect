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
      setMapError("Google Maps API key not configured.");
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
      pin.style.cssText = `
        background: ${event.isAttending ? "#8844ee" : "#1e1e3a"};
        border: 2px solid ${event.isAttending ? "#aa66ff" : "#4a4a70"};
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 0 12px ${event.isAttending ? "rgba(136,68,238,0.6)" : "rgba(0,0,0,0.5)"};
        cursor: pointer;
        font-size: 18px;
        transition: transform 0.15s;
      `;
      pin.textContent = "🎵";
      pin.title = event.title;

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
      <div className="relative w-full h-[calc(100dvh-120px)] md:h-[calc(100dvh-64px)]">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background z-10">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        {mapError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background z-10 gap-3">
            <MapPin className="w-12 h-12 text-muted-foreground" />
            <p className="text-muted-foreground text-center px-8">{mapError}</p>
          </div>
        )}

        <div ref={mapRef} className="w-full h-full" />

        <AnimatePresence>
          {selectedEvent && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute bottom-0 left-0 right-0 z-20 p-4"
            >
              <div className="bg-card border border-border rounded-2xl p-4 shadow-2xl max-w-lg mx-auto">
                <button
                  className="absolute top-6 right-6 text-muted-foreground hover:text-foreground transition-colors text-lg"
                  onClick={() => setSelectedEvent(null)}
                >
                  ✕
                </button>
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Music className="w-5 h-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-foreground truncate">{selectedEvent.artistName}</h3>
                    <p className="text-sm text-muted-foreground truncate">{selectedEvent.venueName}</p>
                  </div>
                </div>
                <div className="flex gap-3 text-sm text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {format(new Date(selectedEvent.date), "d MMM yyyy", { locale: es })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    {selectedEvent.attendeesCount} van
                  </span>
                  {selectedEvent.genre && <Badge variant="secondary" className="text-xs">{selectedEvent.genre}</Badge>}
                </div>
                <Button
                  className="w-full"
                  variant={selectedEvent.isAttending ? "outline" : "default"}
                  onClick={handleAttend}
                  disabled={attendEvent.isPending || unattendEvent.isPending}
                >
                  {attendEvent.isPending || unattendEvent.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
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
