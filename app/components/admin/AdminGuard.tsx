"use client";

import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthState } from "@/app/hooks/useAuthState";
import { ADMIN_EMAIL } from "@/app/lib/admin-config";

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
  
  // Use a ref instead of state to prevent re-renders
  const hasChecked = React.useRef(false);
  
  useEffect(() => {
    // Wait for everything to load first
    if (isLoading || adminLoading) {
      console.log("AdminGuard: Still loading, waiting...");
      return;
    }
    
    // Only run this check once after data is loaded
    if (hasChecked.current) {
      console.log("AdminGuard: Already checked once, skipping");
      return;
    }
    
    console.log("AdminGuard: Current state:", { 
      isLoading, 
      adminLoading, 
      user: user ? { id: user.id, email: user.email } : null,
      isAdmin
    });
    
    // Using imported ADMIN_EMAIL from central config
    const directEmailCheck = user?.email === ADMIN_EMAIL;
    
    console.log("AdminGuard: Detailed check", { 
      hasUser: !!user,
      userEmail: user?.email, 
      adminEmail: ADMIN_EMAIL,
      isAdmin,
      directEmailCheck,
      result: !user ? "redirect to login" : 
              (!isAdmin && !directEmailCheck) ? "redirect to home" : 
              "show admin content"
    });
    
    // Now we can check
    if (!user) {
      console.log("AdminGuard: No user, redirecting to login");
      router.push('/api/auth/login?post_login_redirect_url=%2Fadmin');
    } else if (!isAdmin && !directEmailCheck) {
      console.log("AdminGuard: Not admin, redirecting to home");
      // Use replace instead of push to avoid browser history issues
      router.replace('/');
    } else {
      console.log("AdminGuard: User is admin, showing content");
    }
    
    // Mark as checked so we don't do this again
    hasChecked.current = true;
  }, [isLoading, adminLoading, user, isAdmin, router]);
  
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
  const isAdminEmail = user?.email === ADMIN_EMAIL;
  
  if (user && (isAdmin || isAdminEmail)) {
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
