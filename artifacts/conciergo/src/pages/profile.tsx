import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { useGetMe, useUpdateMe, getGetMeQueryKey } from "@workspace/api-client-react";
import { useClerk, useUser } from "@clerk/react";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { LogOut, Check, Music, MapPin, Loader2, Edit2 } from "lucide-react";
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
  const { user: clerkUser } = useUser();
  const { signOut } = useClerk();
  const queryClient = useQueryClient();
  const updateMe = useUpdateMe();
  const { toast } = useToast();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [city, setCity] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      setName(user.name ?? "");
      setBio(user.bio ?? "");
      setCity(user.city ?? "");
      setSelectedGenres(user.musicGenres ?? []);
    }
  }, [user]);

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
    signOut({ redirectUrl: basePath || "/" });
  };

  if (isLoading) {
    return (
      <AppLayout title="Mi Perfil">
        <div className="max-w-xl mx-auto px-4 py-12 space-y-8">
          <div className="flex flex-col items-center gap-5">
            <Skeleton className="w-32 h-32 rounded-full" />
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-5 w-64" />
          </div>
          <Skeleton className="h-32 w-full rounded-2xl" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Perfil">
      <div className="max-w-2xl mx-auto px-4 py-8 pb-24 md:pb-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="bg-card border border-border rounded-3xl p-6 md:p-10 shadow-sm"
        >
          {/* Avatar + name */}
          <div className="flex flex-col items-center gap-5 py-4 mb-8">
            <Avatar className="w-32 h-32 border-4 border-background shadow-md">
              <AvatarImage src={clerkUser?.imageUrl ?? user?.avatarUrl ?? undefined} />
              <AvatarFallback className="bg-secondary text-foreground text-4xl font-serif">
                {(user?.name ?? clerkUser?.fullName ?? "?")?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>

            {!editing && (
              <div className="text-center space-y-3">
                <h2 className="text-3xl font-serif font-normal text-foreground">{user?.name}</h2>
                {user?.city && (
                  <p className="text-base text-muted-foreground flex items-center justify-center gap-1.5 font-medium">
                    <MapPin className="w-4 h-4 stroke-[1.5]" />
                    {user.city}
                  </p>
                )}
                {user?.bio && (
                  <p className="text-base text-foreground/80 text-center max-w-md mx-auto leading-relaxed mt-4">{user.bio}</p>
                )}
              </div>
            )}
          </div>

          {/* Genres display (when not editing) */}
          {!editing && user?.musicGenres && user.musicGenres.length > 0 && (
            <div className="mb-10 bg-background rounded-2xl p-6 border border-border">
              <div className="flex items-center gap-2 mb-4">
                <Music className="w-5 h-5 text-muted-foreground stroke-[1.5]" />
                <span className="text-base font-serif text-foreground">Géneros que escuchas</span>
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

          {/* Edit form */}
          {editing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6 mb-10 bg-background p-6 rounded-2xl border border-border"
            >
              <div>
                <label className="text-sm font-medium text-muted-foreground block mb-2">Nombre completo</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre"
                  className="h-12 rounded-xl bg-card"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground block mb-2">Ciudad</label>
                <Input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Madrid, Barcelona..."
                  className="h-12 rounded-xl bg-card"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground block mb-2">Sobre ti</label>
                <Textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Cuéntanos algo sobre ti y qué música te gusta..."
                  className="resize-none rounded-xl bg-card p-4"
                  rows={4}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground block mb-3">
                  ¿Qué escuchas habitualmente?
                </label>
                <div className="flex flex-wrap gap-2">
                  {GENRES.map((genre) => (
                    <button
                      key={genre}
                      type="button"
                      onClick={() => toggleGenre(genre)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                        selectedGenres.includes(genre)
                          ? "bg-foreground border-foreground text-background"
                          : "bg-card border-border text-muted-foreground hover:border-foreground/20 hover:text-foreground"
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
          <div className="space-y-4">
            {editing ? (
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  className="flex-1 h-12 rounded-xl text-base"
                  onClick={() => setEditing(false)}
                  disabled={updateMe.isPending}
                >
                  Cancelar
                </Button>
                <Button
                  className="flex-1 h-12 rounded-xl text-base bg-foreground text-background hover:bg-foreground/90"
                  onClick={handleSave}
                  disabled={updateMe.isPending}
                >
                  {updateMe.isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Check className="w-5 h-5 mr-2" />
                      Guardar cambios
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <Button
                className="w-full h-12 rounded-xl text-base bg-foreground text-background hover:bg-foreground/90"
                onClick={() => setEditing(true)}
              >
                <Edit2 className="w-5 h-5 mr-2" />
                Modificar perfil
              </Button>
            )}

            <Button
              variant="outline"
              className="w-full h-12 rounded-xl text-base text-destructive border-destructive/20 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-colors"
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