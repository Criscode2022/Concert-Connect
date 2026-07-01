import { useListMatches, getListMatchesQueryKey } from "@workspace/api-client-react";
import { AppLayout } from "@/components/layout/app-layout";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { MessageCircle, Music, Calendar } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function Matches() {
  const { data: matches, isLoading } = useListMatches();
  const [, setLocation] = useLocation();

  return (
    <AppLayout title="Mis Matches">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {isLoading && (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-card">
                <Skeleton className="w-14 h-14 rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && (!matches || matches.length === 0) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <MessageCircle className="w-10 h-10 text-primary/50" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Sin matches aún</h3>
            <p className="text-muted-foreground max-w-xs">
              Cuando marques que quieres ir a un concierto y otro usuario también lo haga, os conectaremos aquí.
            </p>
          </motion.div>
        )}

        {!isLoading && matches && matches.length > 0 && (
          <motion.div
            className="space-y-3"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.06 } },
              hidden: {},
            }}
          >
            {matches.map((match) => (
              <motion.div
                key={match.id}
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  visible: { opacity: 1, y: 0 },
                }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => setLocation(`/matches/${match.id}`)}
                className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-card cursor-pointer hover:border-primary/40 transition-all relative overflow-hidden"
              >
                <div className="relative flex-shrink-0">
                  <Avatar className="w-14 h-14">
                    <AvatarImage src={match.otherUser?.avatarUrl ?? undefined} />
                    <AvatarFallback className="bg-primary/20 text-primary font-bold text-lg">
                      {match.otherUser?.name?.[0]?.toUpperCase() ?? "?"}
                    </AvatarFallback>
                  </Avatar>
                  {(match.unreadCount ?? 0) > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center text-[10px] font-bold text-white">
                      {match.unreadCount}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-foreground truncate">
                      {match.otherUser?.name ?? "Usuario"}
                    </span>
                    {match.lastMessage && (
                      <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                        {format(new Date(match.lastMessage.createdAt), "HH:mm")}
                      </span>
                    )}
                  </div>

                  {match.event && (
                    <div className="flex items-center gap-1.5 text-xs text-primary/80 mb-1">
                      <Music className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{match.event.artistName}</span>
                      <span className="text-muted-foreground/60">·</span>
                      <Calendar className="w-3 h-3 flex-shrink-0" />
                      <span className="flex-shrink-0">
                        {format(new Date(match.event.date), "d MMM", { locale: es })}
                      </span>
                    </div>
                  )}

                  {match.lastMessage ? (
                    <p className="text-sm text-muted-foreground truncate">{match.lastMessage.content}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">Empieza la conversación</p>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </AppLayout>
  );
}
