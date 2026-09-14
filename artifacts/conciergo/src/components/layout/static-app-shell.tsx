const logoSrc = `${import.meta.env.BASE_URL}logo.svg`;

function TicketIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden="true">
      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
      <path d="M13 5v2" />
      <path d="M13 17v2" />
      <path d="M13 11v2" />
    </svg>
  );
}

function MapIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden="true">
      <path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z" />
      <path d="M15 5.764v15" />
      <path d="M9 3.236v15" />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden="true">
      <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
      <path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    </svg>
  );
}

export function StaticAppShell({
  children,
  title = "Eventos",
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <div className="flex min-h-[100dvh] w-full flex-col bg-background text-foreground selection:bg-primary/20 selection:text-primary md:flex-row">
      <aside className="z-20 hidden w-72 shrink-0 flex-col border-r-2 border-foreground bg-card md:flex">
        <div className="flex items-center gap-3 p-8">
          <div className="rounded-xl bg-foreground p-2 text-background shadow-[4px_4px_0px_0px_hsl(var(--primary))] -rotate-3">
            <img src={logoSrc} alt="ConcierGo" className="h-8 w-8" style={{ filter: "invert(1)" }} />
          </div>
          <span className="text-3xl font-serif font-bold tracking-tight uppercase">ConcierGo</span>
        </div>
        <nav className="mt-6 flex-1 space-y-3 px-6">
          <a
            href="/events"
            className="-translate-y-0.5 flex items-center gap-4 rounded-xl border-2 border-foreground bg-primary px-4 py-3.5 font-bold tracking-wide text-primary-foreground uppercase shadow-[4px_4px_0px_0px_hsl(var(--foreground))]"
          >
            <TicketIcon />
            <span>Eventos</span>
          </a>
          <a
            href="/events/map"
            className="flex items-center gap-4 rounded-xl border-2 border-transparent px-4 py-3.5 font-bold tracking-wide text-muted-foreground uppercase"
          >
            <MapIcon />
            <span>Mapa</span>
          </a>
        </nav>
        <div className="border-t-2 border-border p-8">
          <a
            href="/"
            className="flex items-center gap-4 rounded-xl border-2 border-foreground bg-primary px-4 py-3 font-bold tracking-wide text-primary-foreground uppercase shadow-[4px_4px_0px_0px_hsl(var(--foreground))]"
          >
            <HomeIcon />
            <span>Volver al inicio</span>
          </a>
        </div>
      </aside>

      <main className="relative z-10 flex min-h-0 min-w-0 flex-1 flex-col pb-20 md:pb-0">
        <header className="sticky top-0 z-40 flex h-16 items-center border-b-2 border-foreground bg-card px-4 md:hidden">
          <h1 className="truncate font-serif text-xl font-bold tracking-tight uppercase">{title}</h1>
        </header>
        <div className="flex-1 overflow-y-auto">{children}</div>
      </main>

      <nav className="fixed right-0 bottom-0 left-0 z-50 flex h-20 items-center justify-around border-t-2 border-foreground bg-card px-2 shadow-[0_-4px_0px_0px_hsl(var(--foreground))] md:hidden">
        <a href="/events" className="flex h-full w-full flex-col items-center justify-center space-y-1 text-primary">
          <div className="-translate-y-1 rounded-xl border-2 border-foreground bg-primary p-1.5 text-primary-foreground shadow-[2px_2px_0px_0px_hsl(var(--foreground))]">
            <TicketIcon />
          </div>
          <span className="text-[10px] font-bold tracking-wider text-foreground uppercase">Eventos</span>
        </a>
        <a href="/events/map" className="flex h-full w-full flex-col items-center justify-center space-y-1 text-muted-foreground">
          <div className="rounded-xl border-2 border-transparent p-1.5">
            <MapIcon />
          </div>
          <span className="text-[10px] font-bold tracking-wider uppercase">Mapa</span>
        </a>
      </nav>
    </div>
  );
}
