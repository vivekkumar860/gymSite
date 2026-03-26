"use client";

import type { AdminDashboard } from "@/api/services/admin.service";
import { StatCard } from "@/shared/components/stat-card";
import { Users, Dumbbell, Target, Activity, UserPlus, UserCheck } from "lucide-react";

type AdminStatsGridProps = {
  stats: AdminDashboard;
};

export function AdminStatsGrid({ stats }: AdminStatsGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <StatCard label="Total Users" value={stats.totalUsers} icon={Users} />
      <StatCard label="Active Users" value={stats.activeUsers} icon={UserCheck} />
      <StatCard label="New Today" value={stats.newUsersToday} icon={UserPlus} />
      <StatCard label="New This Week" value={stats.newUsersThisWeek} icon={UserPlus} />
      <StatCard label="Exercises" value={stats.totalExercises} icon={Dumbbell} />
      <StatCard label="Completed Workouts" value={stats.totalWorkoutSessions} icon={Activity} />
      <StatCard label="Active Goals" value={stats.totalGoals} icon={Target} />
      <StatCard label="Suspended Users" value={stats.suspendedUsers} icon={Users} />
    </div>
  );
}
