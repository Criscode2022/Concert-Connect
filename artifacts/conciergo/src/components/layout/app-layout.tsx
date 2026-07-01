import { Link, useLocation } from "wouter";
import { Home, Map as MapIcon, Users, User, LogOut, Ticket } from "lucide-react";
import { useClerk } from "@clerk/react";
import { Button } from "@/components/ui/button";

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
  showBack?: boolean;
}

export function AppLayout({ children, title, showBack }: AppLayoutProps) {
  const [location, setLocation] = useLocation();
  const { signOut } = useClerk();

  const navItems = [
    { href: "/events", icon: Ticket, label: "Events" },
    { href: "/events/map", icon: MapIcon, label: "Map" },
    { href: "/matches", icon: Users, label: "Matches" },
    { href: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <div className="flex min-h-[100dvh] w-full bg-background text-foreground md:flex-row flex-col">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-border bg-card">
        <div className="p-6 flex items-center gap-3">
          <img src={`${import.meta.env.BASE_URL}logo.svg`} alt="ConcierGo" className="w-8 h-8" />
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">ConcierGo</span>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location === item.href || location.startsWith(`${item.href}/`);
            return (
              <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground" onClick={() => signOut({ redirectUrl: "/" })}>
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-0 relative pb-16 md:pb-0">
        {/* Mobile Top Bar */}
        <header className="md:hidden flex items-center h-14 px-4 border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-40">
          {showBack && (
            <Button variant="ghost" size="icon" className="mr-2" onClick={() => window.history.back()}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="m15 18-6-6 6-6"/></svg>
            </Button>
          )}
          {title ? (
            <h1 className="text-lg font-semibold">{title}</h1>
          ) : (
            <div className="flex items-center gap-2">
              <img src={`${import.meta.env.BASE_URL}logo.svg`} alt="ConcierGo" className="w-6 h-6" />
              <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">ConcierGo</span>
            </div>
          )}
        </header>

        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-card/90 backdrop-blur-md border-t border-border flex items-center justify-around px-2 pb-safe z-50">
        {navItems.map((item) => {
          const isActive = location === item.href || location.startsWith(`${item.href}/`);
          return (
            <Link key={item.href} href={item.href} className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive ? "text-primary" : "text-muted-foreground"}`}>
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}