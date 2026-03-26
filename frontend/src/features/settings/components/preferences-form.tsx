"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  preferencesSchema,
  type PreferencesSchema,
} from "../schemas/preferences-schema";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormFieldWrapper } from "@/shared/components/form-field-wrapper";
import { Label } from "@/components/ui/label";

type PreferencesFormProps = {
  defaultValues?: PreferencesSchema;
  onSubmit: (data: PreferencesSchema) => void;
  isSubmitting?: boolean;
};

export function PreferencesForm({
  defaultValues,
  onSubmit,
  isSubmitting,
}: PreferencesFormProps) {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<PreferencesSchema>({
    resolver: zodResolver(preferencesSchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FormFieldWrapper
        label="Weight Unit"
        error={errors.weightUnit?.message}
        htmlFor="weightUnit"
      >
        <Controller
          name="weightUnit"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id="weightUnit">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kg">Kilograms (kg)</SelectItem>
                <SelectItem value="lbs">Pounds (lbs)</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </FormFieldWrapper>

      <FormFieldWrapper
        label="Distance Unit"
        error={errors.distanceUnit?.message}
        htmlFor="distanceUnit"
      >
        <Controller
          name="distanceUnit"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id="distanceUnit">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="km">Kilometers (km)</SelectItem>
                <SelectItem value="mi">Miles (mi)</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </FormFieldWrapper>

      <FormFieldWrapper
        label="Theme"
        error={errors.theme?.message}
        htmlFor="theme"
      >
        <Controller
          name="theme"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id="theme">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </FormFieldWrapper>

      <div className="space-y-4">
        <h3 className="text-sm font-medium">Notifications</h3>

        <div className="flex items-center justify-between">
          <Label htmlFor="notifications.email">Email notifications</Label>
          <Controller
            name="notifications.email"
            control={control}
            render={({ field }) => (
              <Switch
                id="notifications.email"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="notifications.push">Push notifications</Label>
          <Controller
            name="notifications.push"
            control={control}
            render={({ field }) => (
              <Switch
                id="notifications.push"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="notifications.workout_reminders">
            Workout reminders
          </Label>
          <Controller
            name="notifications.workout_reminders"
            control={control}
            render={({ field }) => (
              <Switch
                id="notifications.workout_reminders"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save Preferences"}
      </Button>
    </form>
  );
}
