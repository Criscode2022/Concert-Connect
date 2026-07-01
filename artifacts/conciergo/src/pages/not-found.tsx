import { Link } from "wouter";
import { Compass, Disc3 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center bg-background text-foreground px-6 relative overflow-hidden">
      {/* Background noise and decorative shapes */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0">
         <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full"><filter id="noise404"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(#noise404)"/></svg>
      </div>
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-chart-4/20 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 32, rotate: -2 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
        className="w-full max-w-lg text-center bg-card border-2 border-foreground rounded-3xl p-10 shadow-[8px_8px_0px_0px_hsl(var(--foreground))] relative z-10"
      >
        <div className="absolute -top-6 -left-6 bg-primary text-primary-foreground p-3 rounded-xl border-2 border-foreground shadow-[4px_4px_0px_0px_hsl(var(--foreground))] transform -rotate-12">
          <Compass className="w-8 h-8 stroke-[2.5]" />
        </div>

        <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-2xl bg-background border-2 border-foreground shadow-[4px_4px_0px_0px_hsl(var(--foreground))] transform rotate-3">
          <Disc3 className="h-12 w-12 text-foreground stroke-[2] animate-spin-slow" />
        </div>

        <p className="font-serif text-8xl font-bold uppercase tracking-tighter text-primary drop-shadow-[2px_2px_0px_hsl(var(--foreground))] mb-2">404</p>

        <h1 className="font-serif text-3xl font-bold uppercase tracking-tight text-foreground mb-4">
          Sala Vacía
        </h1>

        <p className="text-lg font-medium text-muted-foreground border-l-4 border-primary pl-4 mx-auto max-w-sm text-left mb-8">
          Te has colado en el backstage o el bolo ya ha terminado. Volvamos a donde está la música.
        </p>

        <div className="flex justify-center">
          <Button asChild className="h-16 rounded-xl px-10 text-lg font-bold uppercase tracking-widest border-2 border-foreground bg-primary text-primary-foreground hover:bg-foreground hover:text-background shadow-[4px_4px_0px_0px_hsl(var(--foreground))] hover:shadow-[6px_6px_0px_0px_hsl(var(--foreground))] hover:-translate-y-1 hover:-translate-x-1 transition-all">
            <Link href="/events">Ir a la pista</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
