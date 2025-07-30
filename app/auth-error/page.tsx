"use client";

import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold text-red-600">Authentication Error</h1>
        <p className="text-gray-600">
          {error === "callback_failed" 
            ? "There was an issue with the authentication callback. This usually happens when the authorization code has expired or been used already."
            : "An authentication error occurred. Please try logging in again."
          }
        </p>
        <div className="space-x-4">
          <Button asChild>
            <Link href={`/api/auth/login?post_login_redirect_url=${encodeURIComponent(siteUrl)}`}>Try Again</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={siteUrl}>Go Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
