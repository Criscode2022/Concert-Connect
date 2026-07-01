import { Link } from "wouter";
import { Compass } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center bg-background text-foreground px-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md text-center"
      >
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary">
          <Compass className="h-8 w-8 text-primary stroke-[1.5]" />
        </div>

        <p className="font-serif text-6xl leading-none text-foreground">404</p>

        <h1 className="mt-4 font-serif text-2xl text-foreground">
          Aquí no toca nadie
        </h1>

        <p className="mt-3 text-muted-foreground">
          La página que buscas no existe o se ha movido. Volvamos a la música.
        </p>

        <div className="mt-8">
          <Button asChild className="h-12 rounded-xl px-6 text-base font-medium">
            <Link href="/events">Volver a los conciertos</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
