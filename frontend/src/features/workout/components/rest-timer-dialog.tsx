"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { REST_TIMER_DEFAULT_SECONDS } from "@/config/constants";
import { cn } from "@/lib/utils";

type RestTimerDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultSeconds?: number;
};

function formatCountdown(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export function RestTimerDialog({
  open,
  onOpenChange,
  defaultSeconds = REST_TIMER_DEFAULT_SECONDS,
}: RestTimerDialogProps) {
  const [remaining, setRemaining] = useState(defaultSeconds);
  const [isRunning, setIsRunning] = useState(false);

  const reset = useCallback(() => {
    setRemaining(defaultSeconds);
    setIsRunning(false);
  }, [defaultSeconds]);

  // Reset when dialog opens
  useEffect(() => {
    if (open) {
      reset();
    }
  }, [open, reset]);

  // Countdown logic
  useEffect(() => {
    if (!isRunning || remaining <= 0) return;

    const id = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [isRunning, remaining]);

  const progress = defaultSeconds > 0 ? remaining / defaultSeconds : 0;
  const circumference = 2 * Math.PI * 80;
  const dashOffset = circumference * (1 - progress);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-mono text-xs uppercase tracking-widest text-primary/60">
            Rest Timer
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-6 py-6">
          {/* Circular countdown ring */}
          <div className="relative">
            <svg width="192" height="192" viewBox="0 0 192 192">
              {/* Background ring */}
              <circle
                cx="96"
                cy="96"
                r="80"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-muted/30"
              />
              {/* Progress ring */}
              <circle
                cx="96"
                cy="96"
                r="80"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
                className={cn(
                  "text-primary transition-all duration-1000",
                  remaining <= 10 && remaining > 0 && "animate-pulse-glow"
                )}
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                transform="rotate(-90 96 96)"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-4xl font-black font-mono tabular-nums">
              {formatCountdown(remaining)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isRunning ? (
              <Button variant="outline" onClick={() => setIsRunning(false)}>
                Pause
              </Button>
            ) : (
              <Button onClick={() => setIsRunning(true)} disabled={remaining <= 0} className="glow-primary">
                {remaining <= 0 ? "Done" : "Start"}
              </Button>
            )}
            <Button variant="secondary" onClick={reset}>
              Reset
            </Button>
          </div>
        </div>

        <DialogFooter showCloseButton />
      </DialogContent>
    </Dialog>
  );
}
