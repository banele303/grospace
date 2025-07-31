"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthState } from "@/app/hooks/useAuthState";

// Import the same hook used by Navbar
import { useAdminStatus } from "@/app/hooks/useAdminStatus";

interface AdminGuardProps {
  children: React.ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  // Use the same hooks as the Navbar - nothing fancy
  const authState = useAuthState();
  const { user, isLoading } = authState;
  const { isAdmin, isLoading: adminLoading } = useAdminStatus();
  const router = useRouter();
  
  // Only run once on client - no loops
  const [checkedOnce, setCheckedOnce] = useState(false);
  
  useEffect(() => {
    // Only run this check once
    if (checkedOnce) {
      console.log("AdminGuard: Already checked once, skipping");
      return;
    }
    
    console.log("AdminGuard: Current state:", { 
      isLoading, 
      adminLoading, 
      user: user ? { id: user.id, email: user.email } : null,
      isAdmin
    });
    
    // Wait for everything to load first
    if (isLoading || adminLoading) {
      console.log("AdminGuard: Still loading, waiting...");
      return;
    }
    
    const ADMIN_EMAIL = "alexsouthflow3@gmail.com";
    const directEmailCheck = user?.email === ADMIN_EMAIL;
    
    // Now we can check
    if (!user) {
      console.log("AdminGuard: No user, redirecting to login");
      router.push('/api/auth/login?post_login_redirect_url=%2Fadmin');
    } else if (!isAdmin && !directEmailCheck) {
      console.log("AdminGuard: Not admin, redirecting to home", { 
        userEmail: user.email, 
        adminEmail: ADMIN_EMAIL,
        isAdmin,
        directEmailCheck
      });
      router.push('/');
    } else {
      console.log("AdminGuard: User is admin, showing content");
    }
    
    // Mark as checked so we don't do this again
    setCheckedOnce(true);
  }, [isLoading, adminLoading, user, isAdmin, router, checkedOnce]);
  
  // Simple loading state
  if (isLoading || adminLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }
  
  // If admin, show content - use both hook and direct email check
  const ADMIN_EMAIL = "alexsouthflow3@gmail.com";
  const directEmailCheck = user?.email === ADMIN_EMAIL;
  
  
  if (user && (isAdmin || directEmailCheck)) {
    console.log("AdminGuard: Rendering admin content");
    return <>{children}</>;
  }
  
  // Otherwise show loading (we're redirecting)
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Redirecting...</p>
      </div>
    </div>
  );
}
