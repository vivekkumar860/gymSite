"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, type ProfileSchema } from "../schemas/profile-schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormFieldWrapper } from "@/shared/components/form-field-wrapper";

type ProfileFormProps = {
  defaultValues?: ProfileSchema;
  onSubmit: (data: ProfileSchema) => void;
  isSubmitting?: boolean;
};

export function ProfileForm({
  defaultValues,
  onSubmit,
  isSubmitting,
}: ProfileFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormFieldWrapper
        label="First Name"
        error={errors.firstName?.message}
        required
        htmlFor="firstName"
      >
        <Input id="firstName" placeholder="First name" {...register("firstName")} />
      </FormFieldWrapper>

      <FormFieldWrapper
        label="Last Name"
        error={errors.lastName?.message}
        required
        htmlFor="lastName"
      >
        <Input id="lastName" placeholder="Last name" {...register("lastName")} />
      </FormFieldWrapper>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
