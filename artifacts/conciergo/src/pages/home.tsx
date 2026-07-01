import { Link } from "wouter";
import { Show } from "@clerk/react";
import { Redirect } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <>
      <Show when="signed-in">
        <Redirect to="/events" />
      </Show>
      
      <Show when="signed-out">
        <div className="min-h-[100dvh] bg-background flex flex-col relative overflow-hidden text-foreground">
          {/* Background effects */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(136,68,238,0.2),transparent_50%)] pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          
          <header className="p-6 flex items-center justify-between relative z-10 max-w-7xl w-full mx-auto">
            <div className="flex items-center gap-3">
              <img src={`${import.meta.env.BASE_URL}logo.svg`} alt="ConcierGo" className="w-8 h-8" />
              <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                ConcierGo
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/sign-in" className="text-sm font-medium hover:text-primary transition-colors">
                Log in
              </Link>
              <Link href="/sign-up" className="inline-flex h-9 items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90">
                Sign up
              </Link>
            </div>
          </header>

          <main className="flex-1 flex flex-col items-center justify-center px-4 relative z-10 text-center pb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl"
            >
              <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-8">
                <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse" />
                Find your concert crew
              </div>
              
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
                Don't let a great show <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">go to waste.</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                Connect with music lovers in your city. Find someone to split an Uber, hold your spot in the pit, and scream the lyrics with.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/sign-up" className="w-full sm:w-auto inline-flex h-14 items-center justify-center rounded-full bg-primary px-8 text-base font-medium text-primary-foreground shadow transition-all hover:bg-primary/90 hover:scale-105">
                  Get Started
                </Link>
                <Link href="/events" className="w-full sm:w-auto inline-flex h-14 items-center justify-center rounded-full border border-border bg-background px-8 text-base font-medium shadow-sm transition-all hover:bg-muted hover:text-foreground">
                  Explore Events
                </Link>
              </div>
            </motion.div>
          </main>
          
          <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-background to-transparent pointer-events-none z-0" />
        </div>
      </Show>
    </>
  );
}