"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { isAdmin } from "@/app/lib/admin-actions";
import { Loader2 } from "lucide-react";

interface AdminGuardProps {
  children: React.ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const { isAuthenticated, isLoading } = useKindeBrowserClient();
  const router = useRouter();

  useEffect(() => {
    async function checkAdminStatus() {
      console.log("AdminGuard: Authentication state", { isAuthenticated, isLoading });
      
      // Wait for authentication to load
      if (isLoading) return;
      
      if (!isAuthenticated) {
        console.log("AdminGuard: User not authenticated, redirecting to login");
        router.push("/api/auth/login?post_login_redirect_url=%2Fadmin");
        return;
      }

      try {
        console.log("AdminGuard: Checking admin status...");
        const adminStatus = await isAdmin();
        console.log("AdminGuard: Admin status result:", adminStatus);
        
        setIsAuthorized(adminStatus);
        
        if (!adminStatus) {
          console.log("AdminGuard: Not admin, redirecting to home");
          router.push("/");
        } else {
          console.log("AdminGuard: Admin access granted");
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAuthorized(false);
        router.push("/");
      }
    }

    checkAdminStatus();
  }, [router, isAuthenticated, isLoading]);

  if (isLoading || isAuthorized === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Verifying admin access...</p>
        </div>
      </div>
    );
  }

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

  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-muted-foreground">You don&apos;t have permission to access this area.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
