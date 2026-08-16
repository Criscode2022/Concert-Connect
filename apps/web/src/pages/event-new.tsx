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
import { Ticket } from "lucide-react";

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
          toast({ title: "¡Bolo añadido al cartel!" });
          setLocation(`/events/${data.id}`);
        },
        onError: () => {
          toast({ title: "Error al crear el evento", variant: "destructive" });
        },
      }
    );
  };

  return (
    <AppLayout title="Añadir Bolo" showBack>
      <div className="p-4 md:p-8 max-w-xl mx-auto pb-24 relative">
        <div className="absolute top-10 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-0 w-40 h-40 bg-chart-4/20 rounded-full blur-3xl pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, y: 32, rotate: 1 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
          className="bg-card border-2 border-foreground rounded-2xl p-6 md:p-10 shadow-[8px_8px_0px_0px_hsl(var(--foreground))] relative z-10 mt-6"
        >
          <div className="absolute -top-6 -left-6 bg-primary text-primary-foreground p-3 rounded-xl border-2 border-foreground shadow-[4px_4px_0px_0px_hsl(var(--foreground))] transform -rotate-12">
            <Ticket className="w-8 h-8 stroke-[2.5]" />
          </div>
          
          <div className="mb-10 text-center">
            <h2 className="text-4xl font-serif font-bold uppercase tracking-tight text-foreground mb-4">Móntate el cartel</h2>
            <p className="text-muted-foreground font-medium text-lg border-b-2 border-primary/30 pb-6">¿Falta el bolo al que quieres ir? Añádelo y encuentra peña para acompañarte.</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-bold uppercase tracking-wider text-xs">Título del evento / Gira</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej. The Eras Tour" className="h-14 bg-background border-2 border-border focus:border-foreground focus:ring-0 focus:shadow-[4px_4px_0px_0px_hsl(var(--foreground))] rounded-xl font-bold text-base transition-all" {...field} />
                    </FormControl>
                    <FormMessage className="font-bold" />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="artistName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-bold uppercase tracking-wider text-xs">Artista / Banda principal</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej. Taylor Swift" className="h-14 bg-background border-2 border-border focus:border-foreground focus:ring-0 focus:shadow-[4px_4px_0px_0px_hsl(var(--foreground))] rounded-xl font-bold text-base transition-all" {...field} />
                    </FormControl>
                    <FormMessage className="font-bold" />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="venueName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-bold uppercase tracking-wider text-xs">Recinto / Sala</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej. Sala El Sol" className="h-14 bg-background border-2 border-border focus:border-foreground focus:ring-0 focus:shadow-[4px_4px_0px_0px_hsl(var(--foreground))] rounded-xl font-bold text-base transition-all" {...field} />
                      </FormControl>
                      <FormMessage className="font-bold" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-bold uppercase tracking-wider text-xs">Fecha y hora</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" className="h-14 bg-background border-2 border-border focus:border-foreground focus:ring-0 focus:shadow-[4px_4px_0px_0px_hsl(var(--foreground))] rounded-xl font-bold text-base transition-all" {...field} />
                      </FormControl>
                      <FormMessage className="font-bold" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="genre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-bold uppercase tracking-wider text-xs">Género Musical</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej. Indie, Rock, Pop..." className="h-14 bg-background border-2 border-border focus:border-foreground focus:ring-0 focus:shadow-[4px_4px_0px_0px_hsl(var(--foreground))] rounded-xl font-bold text-base transition-all uppercase" {...field} />
                    </FormControl>
                    <FormMessage className="font-bold" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-bold uppercase tracking-wider text-xs">URL del Cartel / Foto (Opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." className="h-14 bg-background border-2 border-border focus:border-foreground focus:ring-0 focus:shadow-[4px_4px_0px_0px_hsl(var(--foreground))] rounded-xl font-bold text-base transition-all" {...field} />
                    </FormControl>
                    <FormMessage className="font-bold" />
                  </FormItem>
                )}
              />

              <div className="pt-6">
                <Button type="submit" className="w-full h-16 rounded-xl text-lg font-bold uppercase tracking-widest border-2 border-transparent hover:border-foreground hover:shadow-[4px_4px_0px_0px_hsl(var(--foreground))] hover:-translate-y-1 hover:-translate-x-1 transition-all" disabled={createEvent.isPending}>
                  {createEvent.isPending ? "Imprimiendo cartel..." : "Publicar Bolo"}
                </Button>
              </div>
            </form>
          </Form>
        </motion.div>
      </div>
    </AppLayout>
  );
}