import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { useGetMe, useUpdateMe, getGetMeQueryKey } from "@workspace/api-client-react";
import { useClerk, useUser } from "@clerk/react";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Camera, LogOut, Check, Music, MapPin, Loader2, Edit2 } from "lucide-react";
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
          toast({ title: "Perfil actualizado" });
        },
        onError: () => {
          toast({ title: "Error al guardar", variant: "destructive" });
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
        <div className="max-w-lg mx-auto px-4 py-8 space-y-6">
          <div className="flex flex-col items-center gap-4">
            <Skeleton className="w-24 h-24 rounded-full" />
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-56" />
          </div>
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-40 w-full rounded-xl" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Mi Perfil">
      <div className="max-w-lg mx-auto px-4 py-6 pb-24 md:pb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Avatar + name */}
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="relative">
              <Avatar className="w-24 h-24 border-2 border-primary/30">
                <AvatarImage src={clerkUser?.imageUrl ?? user?.avatarUrl ?? undefined} />
                <AvatarFallback className="bg-primary/20 text-primary text-3xl font-bold">
                  {(user?.name ?? clerkUser?.fullName ?? "?")?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-card border border-border rounded-full flex items-center justify-center">
                <Camera className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
            </div>

            {!editing && (
              <>
                <div className="text-center">
                  <h2 className="text-xl font-bold text-foreground">{user?.name}</h2>
                  {user?.city && (
                    <p className="text-sm text-muted-foreground flex items-center justify-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {user.city}
                    </p>
                  )}
                </div>
                {user?.bio && (
                  <p className="text-sm text-muted-foreground text-center max-w-xs">{user.bio}</p>
                )}
              </>
            )}
          </div>

          {/* Genres display (when not editing) */}
          {!editing && user?.musicGenres && user.musicGenres.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Music className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">Géneros favoritos</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {user.musicGenres.map((g) => (
                  <Badge key={g} variant="secondary" className="bg-primary/10 text-primary border-primary/20">
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
              className="space-y-4"
            >
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Nombre</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Ciudad</label>
                <Input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Madrid, Barcelona..."
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Bio</label>
                <Textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Cuéntanos algo sobre ti y qué música te gusta..."
                  className="resize-none"
                  rows={3}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  Géneros favoritos
                </label>
                <div className="flex flex-wrap gap-2">
                  {GENRES.map((genre) => (
                    <button
                      key={genre}
                      type="button"
                      onClick={() => toggleGenre(genre)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                        selectedGenres.includes(genre)
                          ? "bg-primary/20 border-primary text-primary"
                          : "bg-card border-border text-muted-foreground hover:border-primary/40"
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
          <div className="space-y-3 pt-2">
            {editing ? (
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setEditing(false)}
                  disabled={updateMe.isPending}
                >
                  Cancelar
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleSave}
                  disabled={updateMe.isPending}
                >
                  {updateMe.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Guardar
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setEditing(true)}
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Editar perfil
              </Button>
            )}

            <Button
              variant="ghost"
              className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={handleSignOut}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar sesión
            </Button>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
}
