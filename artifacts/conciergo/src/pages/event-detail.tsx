import { AppLayout } from "@/components/layout/app-layout";
import { useGetEvent, getGetEventQueryKey, useAttendEvent, useUnattendEvent } from "@workspace/api-client-react";
import { useParams } from "wouter";
import { Loader2, Calendar, MapPin, Users, Share2 } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";

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
      <AppLayout title="Event Details" showBack>
        <div className="flex items-center justify-center h-full pt-20">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </AppLayout>
    );
  }

  if (!event) {
    return (
      <AppLayout title="Event Not Found" showBack>
        <div className="p-8 text-center text-muted-foreground">
          Event could not be found.
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Event Details" showBack>
      <div className="w-full max-w-2xl mx-auto pb-24">
        <div className="relative w-full h-64 md:h-80 bg-muted">
          {event.imageUrl ? (
            <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
              <span className="text-6xl opacity-50">🎵</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        </div>

        <div className="px-6 -mt-12 relative z-10">
          {event.genre && (
            <Badge variant="secondary" className="mb-3 bg-primary/20 text-primary border-primary/20">
              {event.genre}
            </Badge>
          )}
          
          <h1 className="text-3xl font-extrabold mb-1">{event.title}</h1>
          <p className="text-xl text-foreground/80 font-medium mb-6">{event.artistName}</p>

          <div className="space-y-4 mb-8 bg-card rounded-xl p-5 border border-border">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-2 rounded-full">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">{format(new Date(event.date), "EEEE, MMMM d, yyyy")}</p>
                <p className="text-sm text-muted-foreground">{format(new Date(event.date), "h:mm a")}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-2 rounded-full">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">{event.venueName}</p>
                {event.venueAddress && <p className="text-sm text-muted-foreground">{event.venueAddress}</p>}
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-2 rounded-full">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">{event.attendeesCount || 0} attending</p>
                <p className="text-sm text-muted-foreground">Looking for a group</p>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button 
              className={`flex-1 h-14 text-lg font-medium shadow-lg transition-all ${event.isAttending ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80' : 'bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02]'}`}
              onClick={toggleAttend}
              disabled={attendEvent.isPending || unattendEvent.isPending}
            >
              {event.isAttending ? "You're Going!" : "I Want To Go"}
            </Button>
            
            <Button variant="outline" size="icon" className="h-14 w-14 rounded-xl border-border bg-card">
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
          
          {event.isAttending && (
            <div className="mt-12">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Matched Companions
              </h3>
              <div className="bg-card border border-border rounded-xl p-8 text-center text-muted-foreground">
                <p>We're looking for your perfect concert buddy.</p>
                <p className="text-sm mt-2">Matches will appear here soon!</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}