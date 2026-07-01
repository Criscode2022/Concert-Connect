import { Link } from "wouter";
import { Show } from "@clerk/react";
import { Redirect } from "wouter";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <>
      <Show when="signed-in">
        <Redirect to="/events" />
      </Show>
      
      <Show when="signed-out">
        <div className="min-h-[100dvh] bg-background flex flex-col relative text-foreground selection:bg-primary/20 selection:text-primary">
          <header className="px-6 py-8 flex items-center justify-between relative z-10 w-full mx-auto max-w-5xl">
            <div className="flex items-center gap-3">
              <img src={`${import.meta.env.BASE_URL}logo.svg`} alt="ConcierGo" className="w-6 h-6" style={{ filter: 'grayscale(1) contrast(0) brightness(0)' }} />
              <span className="text-xl font-serif tracking-tight">
                ConcierGo
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/sign-in" className="text-sm font-medium hover:text-primary transition-colors">
                Entrar
              </Link>
              <Link href="/sign-up" className="inline-flex h-10 items-center justify-center rounded-xl bg-foreground px-5 py-2 text-sm font-medium text-background transition-colors hover:bg-foreground/90">
                Unirse
              </Link>
            </div>
          </header>

          <main className="flex-1 flex flex-col items-center justify-center px-6 relative z-10 text-center pb-24 w-full max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="inline-flex items-center rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground mb-8">
                Encuentra tu compañía ideal
              </div>
              
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif tracking-tight mb-8 leading-[1.1]">
                No dejes que un gran concierto se pierda.
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
                Conecta con amantes de la música en tu ciudad. Encuentra a alguien con quien compartir el viaje, guardar sitio en primera fila y cantar a todo pulmón.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/sign-up" className="w-full sm:w-auto inline-flex h-12 items-center justify-center rounded-xl bg-primary px-8 text-base font-medium text-primary-foreground transition-all hover:bg-primary/90">
                  Empezar ahora
                </Link>
                <Link href="/events" className="w-full sm:w-auto inline-flex h-12 items-center justify-center rounded-xl border border-border bg-card px-8 text-base font-medium transition-all hover:bg-muted">
                  Explorar eventos
                </Link>
              </div>
            </motion.div>
          </main>
        </div>
      </Show>
    </>
  );
}