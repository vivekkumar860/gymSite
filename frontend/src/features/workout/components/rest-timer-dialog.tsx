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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rest Timer</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-6 py-6">
          <span className="text-5xl font-mono tabular-nums font-bold">
            {formatCountdown(remaining)}
          </span>

          <div className="flex items-center gap-2">
            {isRunning ? (
              <Button variant="outline" onClick={() => setIsRunning(false)}>
                Pause
              </Button>
            ) : (
              <Button onClick={() => setIsRunning(true)} disabled={remaining <= 0}>
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
