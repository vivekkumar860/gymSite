"use client";

import { useEffect, useState } from "react";

type WorkoutTimerProps = {
  startedAt?: string;
  isActive: boolean;
};

function formatElapsed(totalSeconds: number): string {
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  return [
    String(hrs).padStart(2, "0"),
    String(mins).padStart(2, "0"),
    String(secs).padStart(2, "0"),
  ].join(":");
}

export function WorkoutTimer({ startedAt, isActive }: WorkoutTimerProps) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!startedAt || !isActive) return;

    const start = new Date(startedAt).getTime();

    function tick() {
      setElapsed(Math.floor((Date.now() - start) / 1000));
    }

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [startedAt, isActive]);

  if (!startedAt) return null;

  return (
    <div className="flex items-center gap-2 rounded-xl glass px-3 py-1.5">
      <span
        className={`text-2xl font-mono font-black tabular-nums ${
          isActive
            ? "text-green-500"
            : "text-muted-foreground"
        }`}
      >
        {formatElapsed(elapsed)}
      </span>
      {isActive && <span className="size-2 rounded-full bg-green-400 animate-pulse" />}
    </div>
  );
}
