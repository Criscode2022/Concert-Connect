import { useListMatches, getListMatchesQueryKey } from "@workspace/api-client-react";
import { AppLayout } from "@/components/layout/app-layout";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { MessageCircle, Music, Calendar } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

export default function Matches() {
  const { data: matches, isLoading } = useListMatches();
  const [, setLocation] = useLocation();

  return (
    <AppLayout title="Conexiones">
      <div className="max-w-3xl mx-auto px-4 py-8 md:py-10 pb-24 md:pb-10">
        <div className="mb-8">
          <h2 className="text-3xl font-serif tracking-tight mb-2">Tus Conexiones</h2>
          <p className="text-muted-foreground">Habla con las personas con las que has coincidido para ir a conciertos.</p>
        </div>

        {isLoading && (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-5 p-5 rounded-2xl border border-border bg-card">
                <Skeleton className="w-16 h-16 rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-2.5">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-4 w-56" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && (!matches || matches.length === 0) && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 text-center border border-border border-dashed rounded-3xl bg-card/50"
          >
            <div className="w-20 h-20 rounded-full bg-background border border-border flex items-center justify-center mb-6 shadow-sm">
              <MessageCircle className="w-8 h-8 text-muted-foreground stroke-[1.5]" />
            </div>
            <h3 className="text-2xl font-serif text-foreground mb-3">No hay conexiones aún</h3>
            <p className="text-muted-foreground max-w-sm text-lg leading-relaxed">
              Cuando indiques que quieres ir a un concierto y otro usuario también lo haga, os conectaremos aquí.
            </p>
          </motion.div>
        )}

        {!isLoading && matches && matches.length > 0 && (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.05 } },
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
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setLocation(`/matches/${match.id}`)}
                className="flex items-center gap-4 p-5 rounded-2xl border border-border bg-card cursor-pointer hover:border-primary/40 hover:shadow-sm transition-all relative overflow-hidden group"
              >
                <div className="relative flex-shrink-0">
                  <Avatar className="w-16 h-16 border-2 border-background shadow-sm">
                    <AvatarImage src={match.otherUser?.avatarUrl ?? undefined} />
                    <AvatarFallback className="bg-secondary text-foreground font-serif text-xl">
                      {match.otherUser?.name?.[0]?.toUpperCase() ?? "?"}
                    </AvatarFallback>
                  </Avatar>
                  {(match.unreadCount ?? 0) > 0 && (
                    <span className="absolute -top-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground border-2 border-card">
                      {match.unreadCount}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-serif text-lg text-foreground truncate group-hover:text-primary transition-colors">
                      {match.otherUser?.name ?? "Usuario"}
                    </span>
                    {match.lastMessage && (
                      <span className="text-xs text-muted-foreground font-medium">
                        {format(new Date(match.lastMessage.createdAt), "HH:mm")}
                      </span>
                    )}
                  </div>

                  {match.event && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium mb-2 bg-muted/50 w-fit px-2 py-1 rounded-md">
                      <Music className="w-3.5 h-3.5" />
                      <span className="truncate max-w-[120px]">{match.event.artistName}</span>
                      <span className="mx-0.5 opacity-50">·</span>
                      <Calendar className="w-3.5 h-3.5" />
                      <span className="flex-shrink-0">
                        {format(new Date(match.event.date), "d MMM", { locale: es })}
                      </span>
                    </div>
                  )}

                  {match.lastMessage ? (
                    <p className={`text-sm truncate ${match.unreadCount ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                      {match.lastMessage.content}
                    </p>
                  ) : (
                    <p className="text-sm text-primary/70 font-medium italic">Inicia la conversación...</p>
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