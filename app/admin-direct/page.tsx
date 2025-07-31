"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// The admin email
const ADMIN_EMAIL = "alexsouthflow3@gmail.com";

export default function DirectAdminPage() {
  const { user, isLoading } = useKindeBrowserClient();
  const router = useRouter();
  
  // Check if user is admin directly
  const isAdminUser = user?.email === ADMIN_EMAIL;
  
  // Check auth status on mount
  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.replace('/api/auth/login?post_login_redirect_url=%2Fadmin-direct');
      } else if (!isAdminUser) {
        router.replace('/');
      }
    }
  }, [user, isLoading, isAdminUser, router]);
  
  // Don't render anything if not authenticated or not admin
  if (isLoading || !user || !isAdminUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="mb-4">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900 mx-auto"></div>
          </div>
          <p>{isLoading ? "Loading..." : "Redirecting..."}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Direct Admin Page</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Admin Access Granted</CardTitle>
        </CardHeader>
        <CardContent>
          <p>You are logged in as: <strong>{user.email}</strong></p>
          <p>Admin status: <strong>✅ Administrator</strong></p>
          
          <div className="mt-4">
            <Button asChild>
              <Link href="/admin">Go to Main Admin</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <div className="mt-6 flex gap-4">
        <Button asChild variant="outline">
          <Link href="/">Go Home</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/admin-status">Check Admin Status</Link>
        </Button>
      </div>
    </div>
  );
}
