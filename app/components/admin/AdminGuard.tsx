"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { Loader2 } from "lucide-react";

interface AdminGuardProps {
  children: React.ReactNode;
}

const ADMIN_EMAIL = "alexsouthflow3@gmail.com";

export function AdminGuard({ children }: AdminGuardProps) {
  const { isAuthenticated, isLoading: authLoading, user } = useKindeBrowserClient();
  const router = useRouter();
  const hasRedirected = useRef(false);

  useEffect(() => {
    // Prevent multiple redirects
    if (hasRedirected.current) return;

    // Don't do anything while auth is loading
    if (authLoading) {
      console.log("AdminGuard: Auth loading...");
      return;
    }

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      console.log("AdminGuard: Not authenticated, redirecting to login");
      hasRedirected.current = true;
      router.replace("/api/auth/login?post_login_redirect_url=%2Fadmin");
      return;
    }

    // If authenticated but not admin, redirect to home
    if (user && user.email !== ADMIN_EMAIL) {
      console.log(`AdminGuard: User ${user.email} is not admin, redirecting to home`);
      hasRedirected.current = true;
      router.replace("/");
      return;
    }

    if (user && user.email === ADMIN_EMAIL) {
      console.log("AdminGuard: Admin access granted");
    }
  }, [authLoading, isAuthenticated, user, router]);

  // Show loading while checking authentication or redirecting
  if (authLoading || hasRedirected.current) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">
            {hasRedirected.current ? "Redirecting..." : "Loading authentication..."}
          </p>
        </div>
      </div>
    );
  }

  // If we reach here and user is authenticated and is admin, show content
  if (isAuthenticated && user?.email === ADMIN_EMAIL) {
    return <>{children}</>;
  }

  // Show access denied for any other case
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
        <p className="text-muted-foreground">You don&apos;t have permission to access this area.</p>
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
