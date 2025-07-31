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
    // Don't do anything while auth or admin status is loading
    if (authLoading || adminLoading) {
      console.log("AdminGuard: Loading...", { authLoading, adminLoading });
      return;
    }

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      console.log("AdminGuard: Not authenticated, redirecting to login");
      router.replace("/api/auth/login?post_login_redirect_url=%2Fadmin");
      return;
    }

    // If authenticated but not admin, redirect to home
    if (!isAdmin) {
      console.log("AdminGuard: User is not admin, redirecting to home");
      router.replace("/");
      return;
    }

    console.log("AdminGuard: Admin access granted");
  }, [authLoading, adminLoading, isAuthenticated, isAdmin, router]);

  // Show loading while checking authentication or admin status
  if (authLoading || adminLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">
            {authLoading ? "Loading authentication..." : "Verifying admin access..."}
          </p>
        </div>
      </div>
    );
  }

  // Show loading while redirecting (if not authenticated)
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
          <div className="mt-4">
            <button
              onClick={() => router.push("/")}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // User is authenticated and is admin - show content
  return <>{children}</>;
}
