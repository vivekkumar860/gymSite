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
} from "lucide-react";
import { ROUTES } from "@/config/routes";
import { cn } from "@/lib/utils";

const BOTTOM_NAV_ITEMS = [
  { label: "Dashboard", href: ROUTES.dashboard, icon: LayoutDashboard },
  { label: "Today", href: ROUTES.workout.today, icon: Dumbbell },
  { label: "Nutrition", href: ROUTES.nutrition.home, icon: UtensilsCrossed },
  { label: "Habits", href: ROUTES.habits, icon: CheckSquare },
  { label: "Progress", href: ROUTES.progress, icon: TrendingUp },
  { label: "Goals", href: ROUTES.goals, icon: Target },
] as const;

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-strong border-t border-border/30 md:hidden">
      <div className="flex items-center justify-around px-1 py-1.5">
        {BOTTOM_NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-xl px-2 py-1.5 text-[10px] transition-all duration-200",
                isActive
                  ? "text-primary glow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className={cn("size-5", isActive && "drop-shadow-[0_0_6px_var(--color-primary)]")} />
              <span className={cn("font-medium", isActive && "font-semibold")}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
