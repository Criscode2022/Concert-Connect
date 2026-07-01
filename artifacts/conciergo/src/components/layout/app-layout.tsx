import { Link, useLocation } from "wouter";
import { Home, Map as MapIcon, Users, User, LogOut, Ticket } from "lucide-react";
import { useClerk } from "@clerk/react";
import { Button } from "@/components/ui/button";
import { useListMatches } from "@workspace/api-client-react";

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
  showBack?: boolean;
}

export function AppLayout({ children, title, showBack }: AppLayoutProps) {
  const [location, setLocation] = useLocation();
  const { signOut } = useClerk();
  const { data: matches } = useListMatches();
  const totalUnread = matches?.reduce((sum, m) => sum + (m.unreadCount ?? 0), 0) ?? 0;

  const navItems = [
    { href: "/events", icon: Ticket, label: "Eventos", badge: 0 },
    { href: "/events/map", icon: MapIcon, label: "Mapa", badge: 0 },
    { href: "/matches", icon: Users, label: "Conexiones", badge: totalUnread },
    { href: "/profile", icon: User, label: "Perfil", badge: 0 },
  ];

  return (
    <div className="flex min-h-[100dvh] w-full bg-background text-foreground md:flex-row flex-col selection:bg-primary/20 selection:text-primary">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-72 flex-col border-r-2 border-foreground bg-card z-20">
        <div className="p-8 flex items-center gap-3">
          <div className="bg-foreground text-background p-2 rounded-xl transform -rotate-3 shadow-[4px_4px_0px_0px_hsl(var(--primary))]">
            <img src={`${import.meta.env.BASE_URL}logo.svg`} alt="ConcierGo" className="w-8 h-8" style={{ filter: 'invert(1)' }} />
          </div>
          <span className="text-3xl font-serif font-bold uppercase tracking-tight">ConcierGo</span>
        </div>
        
        <nav className="flex-1 px-6 space-y-3 mt-6">
          {navItems.map((item) => {
            const isActive = location === item.href || (location.startsWith(`${item.href}/`) && !navItems.some(other => other.href !== item.href && location.startsWith(other.href)));
            return (
              <Link key={item.href} href={item.href} className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all font-bold uppercase tracking-wide border-2 ${isActive ? "bg-primary border-foreground text-primary-foreground shadow-[4px_4px_0px_0px_hsl(var(--foreground))] -translate-y-0.5" : "border-transparent text-muted-foreground hover:border-foreground hover:text-foreground hover:bg-muted hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_hsl(var(--foreground))]"}`}>
                <div className="relative">
                  <item.icon className="w-6 h-6 stroke-[2]" />
                  {item.badge > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-1 bg-primary border border-foreground text-primary-foreground text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
                      {item.badge > 99 ? "99+" : item.badge}
                    </span>
                  )}
                </div>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-8 border-t-2 border-border">
          <Button variant="ghost" className="w-full justify-start gap-4 text-muted-foreground hover:text-foreground hover:bg-muted border-2 border-transparent hover:border-foreground transition-all rounded-xl font-bold uppercase tracking-wide h-12" onClick={() => signOut({ redirectUrl: "/" })}>
            <LogOut className="w-5 h-5 stroke-[2]" />
            <span>Salir</span>
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-0 relative pb-20 md:pb-0 z-10">
        {/* Mobile Top Bar */}
        <header className="md:hidden flex items-center h-16 px-4 border-b-2 border-foreground bg-card sticky top-0 z-40">
          {showBack && (
            <Button variant="ghost" size="icon" className="mr-2 hover:bg-muted border-2 border-transparent hover:border-foreground rounded-xl" onClick={() => window.history.back()}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="m15 18-6-6 6-6"/></svg>
            </Button>
          )}
          {title ? (
            <h1 className="text-xl font-serif font-bold uppercase tracking-tight truncate">{title}</h1>
          ) : (
            <div className="flex items-center gap-2">
              <div className="bg-foreground text-background p-1.5 rounded-lg transform -rotate-3">
                <img src={`${import.meta.env.BASE_URL}logo.svg`} alt="ConcierGo" className="w-5 h-5" style={{ filter: 'invert(1)' }} />
              </div>
              <span className="text-xl font-serif font-bold uppercase tracking-tight">ConcierGo</span>
            </div>
          )}
        </header>

        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-card border-t-2 border-foreground flex items-center justify-around px-2 pb-safe z-50 shadow-[0_-4px_0px_0px_hsl(var(--foreground))]">
        {navItems.map((item) => {
          const isActive = location === item.href || (location.startsWith(`${item.href}/`) && !navItems.some(other => other.href !== item.href && location.startsWith(other.href)));
          return (
            <Link key={item.href} href={item.href} className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}>
              <div className="relative">
                <div className={`p-1.5 rounded-xl border-2 transition-all ${isActive ? "bg-primary border-foreground shadow-[2px_2px_0px_0px_hsl(var(--foreground))] text-primary-foreground -translate-y-1" : "border-transparent"}`}>
                  <item.icon className="w-6 h-6 stroke-[2]" />
                </div>
                {item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 bg-primary border border-foreground text-primary-foreground text-[9px] font-bold rounded-full flex items-center justify-center leading-none z-10">
                    {item.badge > 99 ? "99+" : item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? "text-foreground" : ""}`}>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}