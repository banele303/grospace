"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { Loader2 } from "lucide-react";

interface AdminGuardProps {
  children: React.ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const { isAuthenticated, isLoading: authLoading, user } = useKindeBrowserClient();
  const router = useRouter();
  const [adminStatus, setAdminStatus] = useState<{
    isAdmin: boolean;
    isLoading: boolean;
    error: string | null;
  }>({
    isAdmin: false,
    isLoading: true,
    error: null,
  });
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  // Check admin status when user is authenticated
  useEffect(() => {
    async function checkAdminStatus() {
      if (!isAuthenticated || !user?.id) return;

      try {
        setAdminStatus(prev => ({ ...prev, isLoading: true, error: null }));
        console.log("AdminGuard: Checking admin status for user:", user.email);
        
        const response = await fetch('/api/debug/admin');
        
        if (response.ok) {
          const data = await response.json();
          console.log("AdminGuard: Admin check result:", data);
          setAdminStatus({
            isAdmin: data.adminStatus || false,
            isLoading: false,
            error: null,
          });
        } else {
          console.error("AdminGuard: Admin check failed:", response.status);
          setAdminStatus({
            isAdmin: false,
            isLoading: false,
            error: `API call failed: ${response.status}`,
          });
        }
      } catch (error) {
        console.error("AdminGuard: Error checking admin status:", error);
        setAdminStatus({
          isAdmin: false,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    if (isAuthenticated && user?.id && !hasCheckedAuth) {
      checkAdminStatus();
      setHasCheckedAuth(true);
    }
  }, [isAuthenticated, user?.id, hasCheckedAuth]);

  // Handle authentication and authorization
  useEffect(() => {
    if (authLoading) {
      console.log("AdminGuard: Auth loading...");
      return;
    }

    if (!isAuthenticated) {
      console.log("AdminGuard: Not authenticated, redirecting to login");
      // Use router.push instead of window.location.href to avoid full page reload
      router.replace("/api/auth/login?post_login_redirect_url=%2Fadmin");
      return;
    }

    // User is authenticated, check if admin check is complete
    if (!adminStatus.isLoading && !adminStatus.isAdmin && !adminStatus.error) {
      console.log("AdminGuard: User is not admin, redirecting to home");
      router.replace("/");
      return;
    }

    if (adminStatus.error) {
      console.error("AdminGuard: Admin check error, redirecting to home");
      router.replace("/");
      return;
    }

    if (adminStatus.isAdmin) {
      console.log("AdminGuard: Admin access granted");
    }
  }, [authLoading, isAuthenticated, adminStatus, router]);

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
  if (adminStatus.isLoading) {
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
  if (!adminStatus.isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-muted-foreground">You don&apos;t have permission to access this area.</p>
          {adminStatus.error && (
            <p className="text-red-500 text-sm mt-2">Error: {adminStatus.error}</p>
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
