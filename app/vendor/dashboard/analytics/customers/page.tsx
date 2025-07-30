"use client";

import { Suspense } from 'react';
import { AnalyticsDashboardSkeleton } from '@/app/components/AnalyticsDashboardSkeleton';
import CustomerAnalyticsClient from './CustomerAnalyticsClient';

export default function VendorCustomerAnalyticsPage() {
  return (
    <div>
      <Suspense fallback={<AnalyticsDashboardSkeleton />}>
        <CustomerAnalyticsClient />
      </Suspense>
    </div>
  );
}
