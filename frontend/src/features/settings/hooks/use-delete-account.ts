"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import * as authService from "@/api/services/auth.service";
import { clearTokens } from "@/api/client";
import { formatErrorMessage } from "@/shared/utils/format-error";
import { ROUTES } from "@/config/routes";

export function useDeleteAccount() {
  const router = useRouter();

  return useMutation({
    mutationFn: () => authService.deleteAccount(),
    onSuccess: () => {
      clearTokens();
      toast.success("Account deleted successfully");
      router.push(ROUTES.auth.login);
    },
    onError: (err) => {
      toast.error(formatErrorMessage(err, "Failed to delete account"));
    },
  });
}
