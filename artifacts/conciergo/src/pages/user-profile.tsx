import { AppLayout } from "@/components/layout/app-layout";
import { useGetUser } from "@workspace/api-client-react";
import { useParams } from "wouter";
import { Loader2, Music, MapPin } from "lucide-react";
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
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </AppLayout>
    );
  }

  if (!user) {
    return (
      <AppLayout title="Perfil" showBack>
        <div className="p-8 text-center text-muted-foreground flex flex-col items-center gap-4 py-20">
          <p className="text-lg font-medium">No se encontró este perfil.</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Perfil de Usuario" showBack>
      <div className="max-w-2xl mx-auto px-4 py-8 pb-24 md:pb-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="bg-card border border-border rounded-3xl p-6 md:p-10 shadow-sm"
        >
          <div className="flex flex-col items-center gap-5 py-4 mb-8">
            <Avatar className="w-32 h-32 border-4 border-background shadow-md">
              <AvatarImage src={user.avatarUrl ?? undefined} />
              <AvatarFallback className="bg-secondary text-foreground text-4xl font-serif">
                {(user.name ?? "?")?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="text-center space-y-3">
              <h2 className="text-3xl font-serif font-normal text-foreground">{user.name}</h2>
              {user.city && (
                <p className="text-base text-muted-foreground flex items-center justify-center gap-1.5 font-medium">
                  <MapPin className="w-4 h-4 stroke-[1.5]" />
                  {user.city}
                </p>
              )}
              {user.bio && (
                <p className="text-base text-foreground/80 text-center max-w-md mx-auto leading-relaxed mt-4">{user.bio}</p>
              )}
            </div>
          </div>

          {user.musicGenres && user.musicGenres.length > 0 && (
            <div className="bg-background rounded-2xl p-6 border border-border">
              <div className="flex items-center gap-2 mb-4">
                <Music className="w-5 h-5 text-muted-foreground stroke-[1.5]" />
                <span className="text-base font-serif text-foreground">Géneros que escucha</span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {user.musicGenres.map((g) => (
                  <Badge key={g} variant="outline" className="px-3 py-1.5 text-sm font-medium bg-card border-border">
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