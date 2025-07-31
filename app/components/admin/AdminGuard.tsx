"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useAdminStatus } from "@/app/hooks/useAdminStatus";
import { Loader2 } from "lucide-react";

interface AdminGuardProps {
  children: React.ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const { isAuthenticated, isLoading: authLoading } = useKindeBrowserClient();
  const { isAdmin, isLoading: adminLoading, error } = useAdminStatus();
  const router = useRouter();

  useEffect(() => {
    // Don't redirect while still loading
    if (authLoading || adminLoading) return;
    
    if (!isAuthenticated) {
      console.log("AdminGuard: User not authenticated, redirecting to login");
      router.push("/api/auth/login?post_login_redirect_url=%2Fadmin");
      return;
    }
    
    if (!isAdmin && !error) {
      console.log("AdminGuard: Not admin, redirecting to home");
      router.push("/");
      return;
    }
    
    if (error) {
      console.error("AdminGuard: Error checking admin status:", error);
      router.push("/");
      return;
    }
  }, [isAuthenticated, isAdmin, authLoading, adminLoading, error, router]);

  // Show loading while checking authentication or admin status
  if (authLoading || adminLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // Show loading while redirecting
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // Show access denied if not admin
  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-muted-foreground">You don&apos;t have permission to access this area.</p>
          {error && (
            <p className="text-red-500 text-sm mt-2">Error: {error}</p>
          )}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
