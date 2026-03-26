"use client";

import type { ReactNode } from "react";
import { Label } from "@/components/ui/label";

type FormFieldWrapperProps = {
  label: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  htmlFor?: string;
};

export function FormFieldWrapper({
  label,
  error,
  required,
  children,
  htmlFor,
}: FormFieldWrapperProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor}>
        {label}
        {required && <span className="text-destructive"> *</span>}
      </Label>
      {children}
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}
