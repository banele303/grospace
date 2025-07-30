"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Settings, Users, Store } from "lucide-react";
import Link from "next/link";
import { isAdmin } from "@/app/lib/admin-actions";

export function AdminAccessButton() {
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkAdminStatus() {
      try {
        const adminStatus = await isAdmin();
        setIsAdminUser(adminStatus);
      } catch (error) {
        console.error("Error checking admin status:", error);
      } finally {
        setIsLoading(false);
      }
    }

    checkAdminStatus();
  }, []);

  if (isLoading || !isAdminUser) {
    return null;
  }

  return (
    <Card className="border-red-200 bg-gradient-to-r from-red-50 to-pink-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-700">
          <Shield className="h-5 w-5" />
          Admin Access
        </CardTitle>
        <CardDescription>
          Manage the platform and monitor system-wide activities
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid gap-2 md:grid-cols-2">
          <Link href="/admin" className="w-full">
            <Button variant="outline" className="w-full justify-start border-red-200 hover:bg-red-50">
              <Settings className="mr-2 h-4 w-4" />
              Admin Dashboard
            </Button>
          </Link>
          <Link href="/admin/vendors" className="w-full">
            <Button variant="outline" className="w-full justify-start border-red-200 hover:bg-red-50">
              <Store className="mr-2 h-4 w-4" />
              Manage Vendors
            </Button>
          </Link>
        </div>
        <Link href="/admin" className="block">
          <Button className="w-full bg-red-600 hover:bg-red-700">
            Go to Admin Panel
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
