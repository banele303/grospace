"use client";

import { Suspense } from 'react';
import { AnalyticsDashboardSkeleton } from '@/app/components/AnalyticsDashboardSkeleton';
import ProductsAnalyticsClient from './ProductsAnalyticsClient';

export default function VendorProductsAnalyticsPage() {
  return (
    <div>
      <Suspense fallback={<AnalyticsDashboardSkeleton />}>
        <ProductsAnalyticsClient />
      </Suspense>
    </div>
  );
}
