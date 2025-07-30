"use client";

import { Suspense } from 'react';
import { AnalyticsDashboardSkeleton } from '@/app/components/AnalyticsDashboardSkeleton';
import SalesAnalyticsClient from './SalesAnalyticsClient';

export default function VendorSalesAnalyticsPage() {
  return (
    <div>
      <Suspense fallback={<AnalyticsDashboardSkeleton />}>
        <SalesAnalyticsClient />
      </Suspense>
    </div>
  );
}
