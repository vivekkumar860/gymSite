"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Dumbbell,
  UtensilsCrossed,
  CheckSquare,
  TrendingUp,
  Target,
  Settings,
  Library,
  Menu,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ROUTES } from "@/config/routes";
import { useAuth } from "@/providers/auth-provider";
import { cn } from "@/lib/utils";
import { MobileBottomNav } from "./mobile-bottom-nav";

const NAV_ITEMS = [
  { label: "Dashboard", href: ROUTES.dashboard, icon: LayoutDashboard },
  { label: "Today", href: ROUTES.workout.today, icon: Dumbbell },
  { label: "Exercises", href: ROUTES.exercises.list, icon: Library },
  { label: "Nutrition", href: ROUTES.nutrition.home, icon: UtensilsCrossed },
  { label: "Habits", href: ROUTES.habits, icon: CheckSquare },
  { label: "Progress", href: ROUTES.progress, icon: TrendingUp },
  { label: "Goals", href: ROUTES.goals, icon: Target },
  { label: "Settings", href: ROUTES.settings, icon: Settings },
] as const;

function NavLink({
  href,
  label,
  icon: Icon,
  isActive,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  isActive: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200",
        isActive
          ? "glass-strong border-glow text-primary font-medium"
          : "text-muted-foreground hover:bg-primary/5 hover:text-foreground"
      )}
    >
      {/* Active indicator bar */}
      {isActive && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-primary glow-sm" />
      )}
      <Icon className={cn("h-4 w-4", isActive && "text-primary")} />
      {label}
    </Link>
  );
}

function Sidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  return (
    <nav className="flex h-full flex-col gap-1 p-4">
      {/* Logo area */}
      <Link href={ROUTES.dashboard} className="mb-6 px-3 flex items-center gap-2">
        <h1 className="text-xl font-black tracking-tighter gradient-text">FitTrack</h1>
        <span className="size-2 rounded-full bg-primary animate-pulse-glow" />
      </Link>

      {/* Nav items */}
      <div className="space-y-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.href}
            {...item}
            isActive={pathname === item.href || pathname.startsWith(item.href + "/")}
          />
        ))}
      </div>

      {/* User section */}
      <div className="mt-auto pt-4">
        <div className="glass rounded-xl p-3 space-y-3">
          {user && (
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                {user.username?.slice(0, 2).toUpperCase() ?? "U"}
              </div>
              <p className="truncate text-sm font-medium">{user.username}</p>
            </div>
          )}
          <button
            onClick={() => logout()}
            className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm text-muted-foreground hover:bg-primary/5 hover:text-foreground transition-colors duration-200"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </div>
      </div>
    </nav>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar — glass with backdrop blur */}
      <aside className="hidden w-60 shrink-0 border-r border-border/30 bg-background/95 backdrop-blur-xl lg:block">
        <Sidebar />
      </aside>

      {/* Mobile header + sheet */}
      <div className="flex flex-1 flex-col">
        <header className="flex h-14 items-center gap-4 glass-strong border-b border-border/30 px-4 lg:hidden">
          <Sheet>
            <SheetTrigger render={<Button variant="ghost" size="icon" />}>
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation</span>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0 bg-background/80 backdrop-blur-xl">
              <Sidebar />
            </SheetContent>
          </Sheet>
          <h1 className="text-lg font-black tracking-tighter gradient-text">FitTrack</h1>
        </header>

        <main className="flex-1 pb-20 md:pb-0">{children}</main>

        {/* Mobile bottom nav */}
        <MobileBottomNav />
      </div>
    </div>
  );
}
