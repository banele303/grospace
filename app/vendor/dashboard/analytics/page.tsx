"use client";

import { Suspense, useState } from 'react';
import { AnalyticsDashboardSkeleton } from '@/app/components/AnalyticsDashboardSkeleton';
import AnalyticsClient from "@/app/components/dashboard/analytics/AnalyticsClient";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function VendorAnalyticsPage() {
  // Using sonner toast directly
  const [isSeeding, setIsSeeding] = useState(false);

  // Function to seed analytics data
  const seedAnalyticsData = async () => {
    try {
      setIsSeeding(true);
      
      const response = await fetch('/api/analytics/seed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          days: 30,
          clearExisting: false,
          includeOrders: true,
          includeViews: true,
          includeUsers: true
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast.success("Analytics Data Seeded", {
          description: `Created ${data.result.viewsCreated} product views and ${data.result.ordersCreated} orders.`
        });
        
        // Refresh the page to show new data
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        toast.error("Error Seeding Data", {
          description: data.error || "Failed to seed analytics data"
        });
      }
    } catch (error) {
      console.error("Error seeding data:", error);
      toast.error("Error", {
        description: "Something went wrong while seeding analytics data"
      });
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div>
      <div className="fixed bottom-8 right-8 z-50">
        <Button 
          onClick={seedAnalyticsData}
          disabled={isSeeding}
          variant="outline"
          size="sm"
          className="flex items-center gap-1 bg-background/80 backdrop-blur border-dashed"
        >
          {isSeeding ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin" />
              <span>Seeding data...</span>
            </>
          ) : (
            <span>Seed Analytics Data</span>
          )}
        </Button>
      </div>
      <Suspense fallback={<AnalyticsDashboardSkeleton />}>
        <AnalyticsClient />
      </Suspense>
    </div>
  );
}
