import { AppLayout } from "@/components/layout/app-layout";
import { useCreateEvent } from "@workspace/api-client-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const formSchema = z.object({
  title: z.string().min(1, "El título es obligatorio"),
  artistName: z.string().min(1, "El nombre del artista es obligatorio"),
  venueName: z.string().min(1, "El recinto es obligatorio"),
  date: z.string().min(1, "La fecha es obligatoria"),
  genre: z.string().optional(),
  imageUrl: z.string().url("Debe ser una URL válida").optional().or(z.literal("")),
});

export default function EventNew() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const createEvent = useCreateEvent();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      artistName: "",
      venueName: "",
      date: "",
      genre: "",
      imageUrl: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createEvent.mutate(
      {
        data: {
          ...values,
          lat: 0, // Placeholder until Maps is fully wired
          lng: 0, // Placeholder
        },
      },
      {
        onSuccess: (data) => {
          toast({ title: "Evento creado con éxito" });
          setLocation(`/events/${data.id}`);
        },
        onError: () => {
          toast({ title: "Error al crear el evento", variant: "destructive" });
        },
      }
    );
  };

  return (
    <AppLayout title="Crear Evento" showBack>
      <div className="p-4 md:p-8 max-w-xl mx-auto pb-24">
        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm"
        >
          <div className="mb-8">
            <h2 className="text-2xl font-serif text-foreground mb-2">Añadir un concierto</h2>
            <p className="text-muted-foreground">Si no encuentras el concierto al que quieres ir, añádelo para que otros puedan unirse.</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground/80">Título del evento</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej. The Eras Tour" className="h-12 bg-background border-border rounded-xl" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="artistName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground/80">Artista</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej. Taylor Swift" className="h-12 bg-background border-border rounded-xl" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormField
                  control={form.control}
                  name="venueName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground/80">Recinto</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej. Estadio Santiago Bernabéu" className="h-12 bg-background border-border rounded-xl" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground/80">Fecha y hora</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" className="h-12 bg-background border-border rounded-xl" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="genre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground/80">Género (Opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej. Pop" className="h-12 bg-background border-border rounded-xl" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground/80">URL de imagen (Opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." className="h-12 bg-background border-border rounded-xl" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="pt-4">
                <Button type="submit" className="w-full h-12 rounded-xl text-base font-medium" disabled={createEvent.isPending}>
                  {createEvent.isPending ? "Creando..." : "Crear evento"}
                </Button>
              </div>
            </form>
          </Form>
        </motion.div>
      </div>
    </AppLayout>
  );
}