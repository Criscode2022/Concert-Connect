import { Link, Redirect } from "wouter";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";

export default function Home() {
  const { isSignedIn, isPending } = useAuth();

  if (isPending) return null;
  if (isSignedIn) return <Redirect to="/events" />;

  return (
    <>
        <div className="min-h-[100dvh] bg-background flex flex-col relative text-foreground selection:bg-primary/20 selection:text-primary overflow-hidden">
          {/* Decorative background shapes for the gig poster vibe */}
          <div className="absolute top-0 right-0 w-1/2 h-[60vh] bg-primary/10 rounded-bl-[100%] blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-2/3 h-[50vh] bg-chart-4/10 rounded-tr-[100%] blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-chart-3/20 rounded-full blur-2xl pointer-events-none" />
          
          <header className="px-6 py-8 flex items-center justify-between relative z-10 w-full mx-auto max-w-6xl">
            <div className="bg-card border-2 border-foreground px-2.5 py-1 md:px-4 md:py-2 rounded-lg md:rounded-xl shadow-[2px_2px_0px_0px_hsl(var(--foreground))] md:shadow-[4px_4px_0px_0px_hsl(var(--foreground))] transform -rotate-1">
              <span className="text-xs md:text-xl font-serif font-bold tracking-tight uppercase">ConcierGo</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/sign-in" className="text-sm font-bold uppercase tracking-wider hover:text-primary transition-colors">
                Entrar
              </Link>
              <Link href="/sign-up" className="inline-flex h-11 items-center justify-center rounded-xl bg-foreground px-6 py-2 text-sm font-bold uppercase tracking-wide text-background transition-all hover:bg-foreground hover:shadow-[4px_4px_0px_0px_hsl(var(--primary))] hover:-translate-y-1 hover:-translate-x-1">
                Unirse
              </Link>
            </div>
          </header>

          <main className="flex-1 flex flex-col items-center justify-center px-6 relative z-10 text-center pb-24 w-full max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 32, rotate: -2 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
              className="relative"
            >
              <motion.div 
                className="inline-flex items-center rounded-sm border-2 border-foreground bg-primary px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary-foreground mb-10 shadow-[4px_4px_0px_0px_hsl(var(--foreground))]"
                whileHover={{ rotate: 3, scale: 1.05 }}
              >
                Encuentra tu compañía ideal
              </motion.div>
              
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif font-bold tracking-tighter mb-8 leading-[0.9] uppercase mix-blend-multiply text-foreground relative z-10">
                No dejes que<br/>
                <span className="text-primary italic font-serif inline-block transform -rotate-2 origin-left">un gran bolo</span><br/>
                se pierda.
              </h1>
              
              <p className="text-lg md:text-2xl text-foreground font-medium mb-12 max-w-2xl mx-auto leading-relaxed border-l-4 border-primary pl-6 text-left">
                Conecta con amantes de la música en tu ciudad. Encuentra a alguien con quien compartir el viaje, guardar sitio en primera fila y cantar a todo pulmón.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link href="/sign-up" className="w-full sm:w-auto inline-flex h-14 items-center justify-center rounded-xl border-2 border-foreground bg-primary px-10 text-lg font-bold uppercase tracking-wide text-primary-foreground transition-all hover:-translate-y-1 hover:-translate-x-1 shadow-[6px_6px_0px_0px_hsl(var(--foreground))]">
                  Empezar ahora
                </Link>
                <Link href="/events" className="w-full sm:w-auto inline-flex h-14 items-center justify-center rounded-xl border-2 border-foreground bg-card px-10 text-lg font-bold uppercase tracking-wide text-foreground transition-all hover:-translate-y-1 hover:-translate-x-1 shadow-[6px_6px_0px_0px_hsl(var(--foreground))] hover:bg-muted">
                  Explorar eventos
                </Link>
              </div>
            </motion.div>
          </main>
        </div>
    </>
  );
}