"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Mail, MessageCircle, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";

interface PendingApprovalCardProps {
  title: string;
  description: string;
  feature: string; // e.g., "create products", "manage orders", etc.
  backUrl?: string;
  backLabel?: string;
}

export function PendingApprovalCard({
  title,
  description,
  feature,
  backUrl = "/vendor/dashboard",
  backLabel = "Back to Dashboard"
}: PendingApprovalCardProps) {
  return (
    <div className="space-y-8">
      {/* Back Navigation */}
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="sm">
          <Link href={backUrl}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {backLabel}
          </Link>
        </Button>
      </div>

      {/* Main Pending Card */}
      <div className="max-w-2xl mx-auto">
        <Card className="border-orange-200 dark:border-orange-800/50 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 shadow-xl dark:shadow-2xl">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 bg-orange-500 dark:bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg dark:shadow-orange-900/50 animate-pulse">
              <Clock className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-orange-900 dark:text-orange-100">
              {title}
            </CardTitle>
            <p className="text-orange-700 dark:text-orange-300 mt-2">
              {description}
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Status Steps */}
            <div className="bg-white dark:bg-slate-800/50 p-6 rounded-lg border border-orange-200 dark:border-orange-800/50">
              <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-100 mb-4">Approval Status</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <span className="text-sm text-gray-800 dark:text-gray-200">Application submitted successfully</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400 animate-spin" />
                  <span className="text-sm text-gray-800 dark:text-gray-200">Currently under admin review</span>
                </div>
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Awaiting approval to {feature}</span>
                </div>
              </div>
            </div>

            {/* What's Next */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800/50">
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">What happens next?</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm text-blue-800 dark:text-blue-200">
                    You&apos;ll receive an email notification once approved
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm text-blue-800 dark:text-blue-200">
                    Review typically takes 1-2 business days
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm text-blue-800 dark:text-blue-200">
                    Once approved, you&apos;ll have full access to {feature}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button variant="outline" asChild className="flex-1 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                <Link href="mailto:support@grospace.com" className="flex items-center justify-center gap-2">
                  <Mail className="h-4 w-4" />
                  Contact Support
                </Link>
              </Button>
              <Button variant="outline" asChild className="flex-1 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                <Link href="/vendor/dashboard" className="flex items-center justify-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  View Dashboard
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
