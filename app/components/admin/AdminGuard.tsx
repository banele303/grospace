"use client";

import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAdminStatus } from "@/app/hooks/useAdminStatus";

interface AdminGuardProps {
  children: React.ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const { user, isLoading: authLoading } = useKindeBrowserClient();
  const { isAdmin, isLoading: adminLoading } = useAdminStatus();
  const router = useRouter();
  
  // Simple loading indicator
  if (authLoading || adminLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If authenticated and admin, show content
  if (user && isAdmin) {
    return <>{children}</>;
  }
  
  // Otherwise, redirect to home and show loading
  if (user && !isAdmin) {
    // Redirect to home page if not admin
    router.push("/");
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Redirecting...</p>
        </div>
      </div>
    );
  }
  
  // Not authenticated at all, go to login
  if (!user) {
    // Redirect to login page
    router.push("/api/auth/login?post_login_redirect_url=%2Fadmin");
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    );
  }
  
  // Fallback - should never reach here
  return null;
}
