import { AppLayout } from "@/components/layout/app-layout";
import { useMatchesQuery } from "@/hooks/use-matches-query";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { MessageCircle, Music, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function Matches() {
  const { isPending: authPending } = useAuth();
  const { data: matches, isLoading, isFetching, isError, refetch } = useMatchesQuery();
  const [, setLocation] = useLocation();
  const showSkeleton = authPending || (isLoading && !matches);

  return (
    <AppLayout title="Conexiones">
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 pb-24 md:pb-12">
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-serif font-bold uppercase tracking-tighter mb-4 text-foreground">
            Conexiones
          </h1>
          <p className="text-lg font-medium text-muted-foreground border-l-4 border-primary pl-4">Habla con las personas con las que has coincidido para ir a bolos.</p>
        </div>

        {showSkeleton && (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-5 p-5 rounded-2xl border-2 border-border bg-card">
                <Skeleton className="w-16 h-16 rounded-xl flex-shrink-0" />
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-4 w-56" />
                </div>
              </div>
            ))}
          </div>
        )}

        {isError && !showSkeleton && (
          <div className="mb-6 rounded-2xl border-2 border-destructive bg-card p-5 flex items-center justify-between gap-4">
            <p className="font-bold text-foreground">No se pudieron cargar las conexiones.</p>
            <Button
              type="button"
              variant="outline"
              className="border-2 border-foreground font-bold uppercase tracking-wider"
              onClick={() => void refetch()}
            >
              Reintentar
            </Button>
          </div>
        )}

        {!showSkeleton && isFetching && matches && matches.length > 0 && (
          <div className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            Actualizando
          </div>
        )}

        {!showSkeleton && !isError && (!matches || matches.length === 0) && (
          <motion.div
            initial={{ opacity: 0, y: 16, rotate: 1 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            className="flex flex-col items-center justify-center py-24 px-6 text-center border-2 border-foreground border-dashed rounded-3xl bg-card relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full pointer-events-none" />
            <div className="w-24 h-24 rounded-2xl bg-background border-2 border-foreground flex items-center justify-center mb-8 shadow-[4px_4px_0px_0px_hsl(var(--foreground))] transform -rotate-3 z-10">
              <MessageCircle className="w-10 h-10 text-foreground stroke-[2]" />
            </div>
            <h3 className="text-3xl font-serif font-bold uppercase text-foreground mb-4 z-10">El backstage está vacío</h3>
            <p className="text-muted-foreground font-medium text-lg leading-relaxed max-w-md mx-auto z-10">
              Apúntate a eventos y cuando otro fan haga lo mismo, podréis hablar por aquí para hacer planes.
            </p>
          </motion.div>
        )}

        {!showSkeleton && matches && matches.length > 0 && (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.05 } },
              hidden: {},
            }}
          >
            {matches.map((match, i) => (
              <motion.div
                key={match.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                whileHover={{ y: -4, x: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setLocation(`/matches/${match.id}`)}
                className="flex items-center gap-5 p-5 rounded-2xl border-2 border-foreground bg-card cursor-pointer shadow-[4px_4px_0px_0px_hsl(var(--foreground))] hover:shadow-[8px_8px_0px_0px_hsl(var(--foreground))] hover:border-primary transition-all relative overflow-hidden group"
              >
                <div className="relative flex-shrink-0">
                  <Avatar className="w-20 h-20 border-2 border-foreground shadow-[2px_2px_0px_0px_hsl(var(--foreground))] rounded-xl transform rotate-3 group-hover:rotate-6 transition-transform">
                    <AvatarImage src={match.otherUser?.avatarUrl ?? undefined} className="object-cover rounded-lg" />
                    <AvatarFallback className="bg-primary text-primary-foreground font-serif font-bold text-2xl rounded-lg">
                      {match.otherUser?.name?.[0]?.toUpperCase() ?? "?"}
                    </AvatarFallback>
                  </Avatar>
                  {(match.unreadCount ?? 0) > 0 && (
                    <span className="absolute -top-3 -right-3 w-8 h-8 bg-chart-5 rounded-full flex items-center justify-center text-sm font-bold text-white border-2 border-foreground shadow-[2px_2px_0px_0px_hsl(var(--foreground))] animate-bounce">
                      {match.unreadCount}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0 py-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-serif font-bold text-xl uppercase text-foreground truncate group-hover:text-primary transition-colors tracking-tight">
                      {match.otherUser?.name ?? "Fan"}
                    </span>
                    {match.lastMessage && (
                      <span className="text-xs text-muted-foreground font-bold border-2 border-border px-2 py-0.5 rounded-md">
                        {format(new Date(match.lastMessage.createdAt), "HH:mm")}
                      </span>
                    )}
                  </div>

                  {match.event && (
                    <div className="flex items-center gap-2 text-xs text-foreground font-bold mb-3 bg-muted px-2.5 py-1.5 rounded-lg border-2 border-transparent w-fit">
                      <Music className="w-4 h-4 stroke-[2.5]" />
                      <span className="truncate max-w-[140px] uppercase tracking-wider">{match.event.artistName}</span>
                    </div>
                  )}

                  {match.lastMessage ? (
                    <p className={`text-sm truncate ${match.unreadCount ? 'text-foreground font-bold' : 'text-muted-foreground font-medium'}`}>
                      {match.lastMessage.content}
                    </p>
                  ) : (
                    <p className="text-sm text-primary font-bold italic">¡Di hola para quedar!</p>
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