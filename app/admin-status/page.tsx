"use client";

import { useEffect, useState } from "react";
import { useAuthState } from "@/app/hooks/useAuthState";
import { useAdminStatus } from "@/app/hooks/useAdminStatus";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AdminDebugPage() {
  const authState = useAuthState();
  const { user, isLoading: authLoading } = authState;
  const { isAdmin, isLoading: adminLoading, error } = useAdminStatus();
  
  // For exact email comparison
  const ADMIN_EMAIL = "alexsouthflow3@gmail.com";
  const directEmailCheck = user?.email === ADMIN_EMAIL;
  
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Status Debug</h1>
      
      {/* Authentication State */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Authentication State</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p><strong>Loading:</strong> {authLoading ? "Yes" : "No"}</p>
            <p><strong>Is Authenticated:</strong> {user ? "Yes" : "No"}</p>
            <p><strong>User Email:</strong> {user?.email || "None"}</p>
          </div>
        </CardContent>
      </Card>
      
      {/* Admin Status */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Admin Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p><strong>Loading:</strong> {adminLoading ? "Yes" : "No"}</p>
            <p><strong>Is Admin (from hook):</strong> {isAdmin ? "Yes" : "No"}</p>
            <p><strong>Direct Email Check:</strong> {directEmailCheck ? "Yes" : "No"}</p>
            <p><strong>Expected Admin Email:</strong> {ADMIN_EMAIL}</p>
            <p><strong>Error:</strong> {error || "None"}</p>
          </div>
        </CardContent>
      </Card>
      
      {/* Raw Data */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Raw User Data</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-60">
            {JSON.stringify(user, null, 2)}
          </pre>
        </CardContent>
      </Card>
      
      <div className="flex gap-4">
        <Button asChild variant="outline">
          <Link href="/">Home</Link>
        </Button>
        <Button asChild>
          <Link href="/admin">Admin</Link>
        </Button>
      </div>
    </div>
  );
}
