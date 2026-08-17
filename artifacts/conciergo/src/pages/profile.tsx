import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { useGetMe, useUpdateMe, getGetMeQueryKey } from "@workspace/api-client-react";
import { useAuth } from "@/hooks/use-auth";
import { authClient } from "@/lib/auth";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { LogOut, Check, Music, MapPin, Loader2, Edit2, User as UserIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

const GENRES = [
  "Rock", "Pop", "Indie", "Electrónica", "Jazz", "Hip-Hop",
  "Metal", "R&B", "Reggaeton", "Clásica", "Flamenco", "Folk",
  "Punk", "Soul", "Blues", "Country",
];

export default function Profile() {
  const { data: user, isLoading } = useGetMe();
  const { user: authUser } = useAuth();
  const queryClient = useQueryClient();
  const updateMe = useUpdateMe();
  const { toast } = useToast();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [city, setCity] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  const displayName = user?.name ?? authUser?.name ?? "";

  useEffect(() => {
    if (user) {
      setName(user.name ?? authUser?.name ?? "");
      setBio(user.bio ?? "");
      setCity(user.city ?? "");
      setSelectedGenres(user.musicGenres ?? []);
    } else if (authUser?.name) {
      setName(authUser.name);
    }
  }, [user, authUser?.name]);

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const handleSave = () => {
    updateMe.mutate(
      { data: { name, bio, city, musicGenres: selectedGenres } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
          setEditing(false);
          toast({ title: "Perfil actualizado correctamente" });
        },
        onError: () => {
          toast({ title: "Error al guardar el perfil", variant: "destructive" });
        },
      }
    );
  };

  const handleSignOut = () => {
    void authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = basePath || "/";
        },
      },
    });
  };

  if (isLoading) {
    return (
      <AppLayout title="Mi Perfil">
        <div className="max-w-xl mx-auto px-4 py-12 space-y-8">
          <div className="flex flex-col items-center gap-5">
            <Skeleton className="w-40 h-40 rounded-2xl border-2 border-foreground" />
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-6 w-64" />
          </div>
          <Skeleton className="h-40 w-full rounded-3xl border-2 border-foreground" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Backstage">
      <div className="max-w-3xl mx-auto px-4 py-10 pb-24 md:pb-10">
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-serif font-bold uppercase tracking-tighter mb-4 text-foreground">
            Tu Backstage
          </h1>
          <p className="text-lg font-medium text-muted-foreground border-l-4 border-primary pl-4 mx-auto md:mx-0 max-w-md text-left">Aquí es donde te preparas antes de salir al foso. Completa tu info para encontrar mejor compañía.</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
          className="bg-card border-2 border-foreground rounded-3xl p-8 md:p-12 shadow-[8px_8px_0px_0px_hsl(var(--foreground))] relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-chart-4/10 rounded-bl-full pointer-events-none" />
          
          {/* Avatar + name */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 py-4 mb-10 relative z-10">
            <Avatar className="w-40 h-40 border-2 border-foreground shadow-[4px_4px_0px_0px_hsl(var(--foreground))] rounded-2xl transform -rotate-3">
              <AvatarImage src={authUser?.image ?? user?.avatarUrl ?? undefined} className="object-cover rounded-xl" />
              <AvatarFallback className="bg-primary text-primary-foreground text-6xl font-serif font-bold rounded-xl">
                {(displayName || "?")[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>

            {!editing && (
              <div className="text-center md:text-left space-y-4 pt-2">
                <h2 className="text-2xl md:text-4xl font-serif font-bold uppercase tracking-tight text-foreground leading-none break-all">{displayName || "Sin nombre"}</h2>
                {user?.city && (
                  <p className="text-lg text-foreground font-bold uppercase tracking-wider flex items-center justify-center md:justify-start gap-2 bg-muted w-fit mx-auto md:mx-0 px-4 py-1.5 rounded-lg border-2 border-border">
                    <MapPin className="w-5 h-5 stroke-[2.5]" />
                    {user.city}
                  </p>
                )}
                {user?.bio && (
                  <p className="text-lg text-foreground font-medium max-w-lg leading-relaxed mt-4 border-l-4 border-primary pl-4 text-left">{user.bio}</p>
                )}
              </div>
            )}
          </div>

          {/* Genres display (when not editing) */}
          {!editing && user?.musicGenres && user.musicGenres.length > 0 && (
            <div className="mb-12 bg-background rounded-2xl p-8 border-2 border-foreground shadow-[4px_4px_0px_0px_hsl(var(--foreground))] relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-foreground text-background p-2 rounded-lg transform rotate-3">
                  <Music className="w-6 h-6 stroke-[2]" />
                </div>
                <span className="text-2xl font-serif font-bold uppercase tracking-tight text-foreground">Setlist Habitual</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {user.musicGenres.map((g) => (
                  <Badge key={g} variant="outline" className="px-4 py-2 text-sm font-bold uppercase tracking-wider bg-card border-2 border-foreground shadow-[2px_2px_0px_0px_hsl(var(--foreground))] hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_hsl(var(--foreground))] transition-all">
                    {g}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Edit form */}
          {editing && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8 mb-12 bg-background p-8 rounded-2xl border-2 border-foreground shadow-[4px_4px_0px_0px_hsl(var(--foreground))] relative z-10"
            >
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-foreground block mb-3">Nombre en el cartel</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre o alias"
                  className="h-14 rounded-xl bg-card border-2 border-border focus:border-foreground focus:shadow-[4px_4px_0px_0px_hsl(var(--foreground))] font-bold text-lg transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-foreground block mb-3">Sede Base (Ciudad)</label>
                <Input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Madrid, Barcelona..."
                  className="h-14 rounded-xl bg-card border-2 border-border focus:border-foreground focus:shadow-[4px_4px_0px_0px_hsl(var(--foreground))] font-bold text-lg transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-foreground block mb-3">Tu Biografía / Rider</label>
                <Textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Cuéntanos qué rollo llevas de concierto..."
                  className="resize-none rounded-xl bg-card p-5 border-2 border-border focus:border-foreground focus:shadow-[4px_4px_0px_0px_hsl(var(--foreground))] font-medium text-lg transition-all"
                  rows={4}
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-foreground block mb-4">
                  Géneros Favoritos
                </label>
                <div className="flex flex-wrap gap-3">
                  {GENRES.map((genre) => (
                    <button
                      key={genre}
                      type="button"
                      onClick={() => toggleGenre(genre)}
                      className={`px-5 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wider border-2 transition-all ${
                        selectedGenres.includes(genre)
                          ? "bg-primary border-foreground text-primary-foreground shadow-[2px_2px_0px_0px_hsl(var(--foreground))] transform -translate-y-1"
                          : "bg-card border-border text-muted-foreground hover:border-foreground hover:text-foreground hover:-translate-y-1 hover:shadow-[2px_2px_0px_0px_hsl(var(--foreground))]"
                      }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Action buttons */}
          <div className="space-y-5 relative z-10 pt-6 border-t-2 border-dashed border-border">
            {editing ? (
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  variant="outline"
                  className="flex-1 h-14 rounded-xl text-lg font-bold uppercase tracking-widest border-2 border-foreground hover:bg-muted shadow-[4px_4px_0px_0px_hsl(var(--foreground))] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0px_0px_hsl(var(--foreground))] transition-all"
                  onClick={() => setEditing(false)}
                  disabled={updateMe.isPending}
                >
                  Descartar
                </Button>
                <Button
                  className="flex-1 h-14 rounded-xl text-lg font-bold uppercase tracking-widest border-2 border-foreground bg-primary text-primary-foreground hover:bg-primary shadow-[4px_4px_0px_0px_hsl(var(--foreground))] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0px_0px_hsl(var(--foreground))] transition-all"
                  onClick={handleSave}
                  disabled={updateMe.isPending}
                >
                  {updateMe.isPending ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      <Check className="w-6 h-6 mr-2" />
                      Guardar Rider
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <Button
                className="w-full h-16 rounded-xl text-lg font-bold uppercase tracking-widest border-2 border-foreground bg-foreground text-background hover:bg-foreground shadow-[4px_4px_0px_0px_hsl(var(--primary))] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0px_0px_hsl(var(--primary))] transition-all"
                onClick={() => setEditing(true)}
              >
                <Edit2 className="w-6 h-6 mr-2" />
                Actualizar Info
              </Button>
            )}

            <Button
              variant="outline"
              className="w-full h-14 rounded-xl text-base font-bold uppercase tracking-widest text-destructive border-2 border-destructive bg-card hover:bg-destructive hover:text-destructive-foreground shadow-[4px_4px_0px_0px_hsl(var(--destructive))] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0px_0px_hsl(var(--destructive))] transition-all"
              onClick={handleSignOut}
            >
              <LogOut className="w-5 h-5 mr-2" />
              Cerrar sesión
            </Button>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
}