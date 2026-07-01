import { AppLayout } from "@/components/layout/app-layout";
import { useListEvents, useAttendEvent, useUnattendEvent, getListEventsQueryKey } from "@workspace/api-client-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Plus, MapPin, Calendar as CalendarIcon, Users } from "lucide-react";
import { format } from "date-fns";
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
    <AppLayout title="Events">
      <div className="p-4 max-w-3xl mx-auto pb-24">
        <div className="mb-6 flex gap-2">
          <Input 
            placeholder="Search by genre..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1"
          />
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-48 bg-card rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : events?.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <CalendarIcon className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No events found</h3>
            <p className="text-muted-foreground mb-6">Be the first to add an upcoming concert!</p>
            <Button onClick={() => setLocation("/events/new")}>Add Event</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {events?.map((event, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                key={event.id}
              >
                <Link href={`/events/${event.id}`}>
                  <div className="block bg-card hover:bg-muted/50 transition-colors rounded-2xl border border-border overflow-hidden cursor-pointer relative group">
                    <div className="h-32 w-full bg-muted relative">
                      {event.imageUrl ? (
                        <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                          <span className="text-4xl opacity-50">🎵</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                      <div className="absolute bottom-3 left-4 right-4">
                        <h3 className="text-xl font-bold text-foreground truncate">{event.title}</h3>
                        <p className="text-sm text-foreground/80 font-medium truncate">{event.artistName}</p>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <div className="flex items-center text-sm text-muted-foreground mb-2 gap-4">
                        <span className="flex items-center gap-1">
                          <CalendarIcon className="w-4 h-4" />
                          {format(new Date(event.date), "MMM d, yyyy")}
                        </span>
                        <span className="flex items-center gap-1 truncate">
                          <MapPin className="w-4 h-4" />
                          <span className="truncate">{event.venueName}</span>
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{event.attendeesCount || 0} attending</span>
                        </div>
                        
                        <Button 
                          variant={event.isAttending ? "secondary" : "default"}
                          size="sm"
                          className={event.isAttending ? "bg-primary/20 text-primary hover:bg-primary/30" : ""}
                          onClick={(e) => toggleAttend(e, event.id, event.isAttending || false)}
                          disabled={attendEvent.isPending || unattendEvent.isPending}
                        >
                          {event.isAttending ? "I'm Going!" : "I Want To Go"}
                        </Button>
                      </div>
                      {event.genre && (
                        <Badge variant="outline" className="mt-3 bg-background">
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
          className="fixed bottom-20 md:bottom-8 right-4 md:right-8 w-14 h-14 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all p-0"
          onClick={() => setLocation("/events/new")}
        >
          <Plus className="w-6 h-6" />
        </Button>
      </div>
    </AppLayout>
  );
}