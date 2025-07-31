"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useAdminStatus } from "@/app/hooks/useAdminStatus";
import { Loader2 } from "lucide-react";

interface AdminGuardProps {
  children: React.ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const { isAuthenticated, isLoading: authLoading, user } = useKindeBrowserClient();
  const { isAdmin, isLoading: adminLoading, error } = useAdminStatus();
  const router = useRouter();
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    // Prevent multiple redirects
    if (hasRedirected) return;

    // Wait for authentication to load
    if (authLoading) {
      console.log("AdminGuard: Waiting for auth to load...");
      return;
    }

    // If not authenticated, redirect to login once
    if (!isAuthenticated) {
      console.log("AdminGuard: User not authenticated, redirecting to login");
      setHasRedirected(true);
      window.location.href = "/api/auth/login?post_login_redirect_url=%2Fadmin";
      return;
    }

    // User is authenticated, now check admin status
    console.log("AdminGuard: User authenticated, checking admin status...");

    // Wait for admin check to complete
    if (adminLoading) {
      console.log("AdminGuard: Admin check in progress...");
      return;
    }

    // If authenticated but not admin, redirect to home
    if (isAuthenticated && !adminLoading && !isAdmin && !error) {
      console.log("AdminGuard: User authenticated but not admin, redirecting to home");
      setHasRedirected(true);
      router.push("/");
      return;
    }

    // If there's an error checking admin status, redirect to home
    if (error && error !== 'Not authenticated') {
      console.error("AdminGuard: Error checking admin status:", error);
      setHasRedirected(true);
      router.push("/");
      return;
    }

    // Success case - user is authenticated and admin
    if (isAuthenticated && !adminLoading && isAdmin) {
      console.log("AdminGuard: Admin access granted");
      setHasRedirected(false);
    }
  }, [isAuthenticated, isAdmin, authLoading, adminLoading, error, router, hasRedirected]);

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading authentication...</p>
        </div>
      </div>
    );
  }

  // Show loading while redirecting to login
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

  // Show loading while checking admin status
  if (adminLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Verifying admin access...</p>
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

  // User is authenticated and is admin - show content
  return <>{children}</>;
}
