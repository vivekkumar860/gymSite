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

const NAV_ITEMS = [
  { label: "Dashboard", href: ROUTES.dashboard, icon: LayoutDashboard },
  { label: "Today", href: ROUTES.workout.today, icon: Dumbbell },
  { label: "Exercises", href: ROUTES.exercises.list, icon: Library },
  { label: "Nutrition", href: ROUTES.nutrition, icon: UtensilsCrossed },
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
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
        isActive
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );
}

function Sidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  return (
    <nav className="flex h-full flex-col gap-1 p-4">
      <Link href={ROUTES.dashboard} className="mb-6 px-3">
        <h1 className="text-xl font-bold">FitTrack</h1>
      </Link>
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.href}
          {...item}
          isActive={pathname === item.href || pathname.startsWith(item.href + "/")}
        />
      ))}
      <div className="mt-auto border-t pt-4">
        {user && (
          <p className="mb-2 truncate px-3 text-xs text-muted-foreground">
            {user.username}
          </p>
        )}
        <button
          onClick={() => logout()}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        >
          <LogOut className="h-4 w-4" />
          Log out
        </button>
      </div>
    </nav>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r bg-card lg:block">
        <Sidebar />
      </aside>

      {/* Mobile header + sheet */}
      <div className="flex flex-1 flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:hidden">
          <Sheet>
            <SheetTrigger render={<Button variant="ghost" size="icon" />}>
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation</span>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <Sidebar />
            </SheetContent>
          </Sheet>
          <h1 className="text-lg font-bold">FitTrack</h1>
        </header>

        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
