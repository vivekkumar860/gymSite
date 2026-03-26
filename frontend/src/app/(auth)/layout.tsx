import { AuthProvider } from "@/providers/auth-provider";
import { AppShell } from "@/shared/components/app-shell";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <AppShell>{children}</AppShell>
    </AuthProvider>
  );
}
