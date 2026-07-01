import { AppLayout } from "@/components/layout/app-layout";
import { useGetUser } from "@workspace/api-client-react";
import { useParams } from "wouter";
import { Loader2, Music, MapPin, User as UserIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export default function UserProfile() {
  const { userId } = useParams<{ userId: string }>();
  
  const { data: user, isLoading } = useGetUser(userId, {
    query: { enabled: !!userId }
  });
  
  if (isLoading) {
    return (
      <AppLayout title="Perfil" showBack>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="bg-card border-2 border-foreground p-4 rounded-full shadow-[4px_4px_0px_0px_hsl(var(--foreground))] animate-spin-slow">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!user) {
    return (
      <AppLayout title="Perfil Perdido" showBack>
        <div className="p-8 text-center text-foreground flex flex-col items-center gap-6 py-24">
          <div className="bg-chart-4 border-2 border-foreground w-24 h-24 rounded-2xl flex items-center justify-center shadow-[4px_4px_0px_0px_hsl(var(--foreground))] transform rotate-6">
            <UserIcon className="w-12 h-12 stroke-[2]" />
          </div>
          <p className="text-2xl font-serif font-bold uppercase tracking-wider">Este fan no existe</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title={`Backstage de ${user.name}`} showBack>
      <div className="max-w-3xl mx-auto px-4 py-10 pb-24 md:pb-10">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
          className="bg-card border-2 border-foreground rounded-3xl p-8 md:p-12 shadow-[8px_8px_0px_0px_hsl(var(--foreground))] relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-bl-full pointer-events-none" />
          
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 py-4 mb-10 relative z-10">
            <Avatar className="w-40 h-40 border-2 border-foreground shadow-[4px_4px_0px_0px_hsl(var(--foreground))] rounded-2xl transform rotate-3">
              <AvatarImage src={user.avatarUrl ?? undefined} className="object-cover rounded-xl" />
              <AvatarFallback className="bg-chart-3 text-background text-6xl font-serif font-bold rounded-xl">
                {(user.name ?? "?")?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="text-center md:text-left space-y-4 pt-2">
              <h2 className="text-4xl font-serif font-bold uppercase tracking-tight text-foreground leading-none">{user.name}</h2>
              {user.city && (
                <p className="text-lg text-foreground font-bold uppercase tracking-wider flex items-center justify-center md:justify-start gap-2 bg-muted w-fit mx-auto md:mx-0 px-4 py-1.5 rounded-lg border-2 border-border">
                  <MapPin className="w-5 h-5 stroke-[2.5]" />
                  {user.city}
                </p>
              )}
              {user.bio && (
                <p className="text-lg text-foreground font-medium max-w-lg leading-relaxed mt-4 border-l-4 border-primary pl-4 text-left">{user.bio}</p>
              )}
            </div>
          </div>

          {user.musicGenres && user.musicGenres.length > 0 && (
            <div className="bg-background rounded-2xl p-8 border-2 border-foreground shadow-[4px_4px_0px_0px_hsl(var(--foreground))] relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-foreground text-background p-2 rounded-lg transform -rotate-3">
                  <Music className="w-6 h-6 stroke-[2]" />
                </div>
                <span className="text-2xl font-serif font-bold uppercase tracking-tight text-foreground">Setlist Habitual</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {user.musicGenres.map((g) => (
                  <Badge key={g} variant="outline" className="px-4 py-2 text-sm font-bold uppercase tracking-wider bg-card border-2 border-foreground shadow-[2px_2px_0px_0px_hsl(var(--foreground))] transition-all">
                    {g}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AppLayout>
  );
}