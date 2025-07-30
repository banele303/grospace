import { useState, useEffect } from 'react';
import { DateRange } from 'react-day-picker';

type VendorAnalyticsParams = {
  dateRange: DateRange;
  type: 'overview' | 'sales' | 'traffic' | 'products';
};

type AnalyticsData = {
  totalSales: number;
  totalRevenue: number; // Alias for totalSales
  totalOrders: number;
  totalCustomers: number;
  averageOrderValue: number;
  revenueChange: number;
  ordersChange: number;
  aovChange: number;
  conversionRate: number;
  conversionChange: number;
  customersChange: number;
  newCustomers: number;
  newCustomersChange: number;
  customerLifetimeValue: number;
  clvChange: number;
  repeatPurchaseRate: number;
  rprChange: number;
  salesData: Array<{
    date: string;
    revenue: number;
  }>;
  dailySalesData: Array<{
    date: string;
    revenue: number;
  }>;
  weeklySalesData: Array<{
    date: string;
    revenue: number;
  }>;
  monthlySalesData: Array<{
    date: string;
    revenue: number;
  }>;
  salesByDay: Array<{
    date: string;
    revenue: number;
  }>;
  topSellingProducts: Array<{
    id: string;
    name: string;
    sales: number;
    revenue: number;
  }>;
  recentSales: Array<{
    id: string;
    date: string;
    customer: string;
    amount: number;
    status: string;
  }>;
  salesByCategory: Array<{
    category: string;
    sales: number;
  }>;
};

export function useVendorAnalytics({ dateRange, type }: VendorAnalyticsParams) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!dateRange.from || !dateRange.to) return;
      
      setIsLoading(true);
      try {
        // In a real app, this would be a fetch call to your API
        // For now, we're mocking the data
        const mockData: AnalyticsData = {
          totalSales: 12540.75,
          totalRevenue: 12540.75,  // Same as totalSales
          totalOrders: 142,
          totalCustomers: 89,
          averageOrderValue: 88.31,
          revenueChange: 12.5,
          ordersChange: 8.7,
          aovChange: 3.2,
          conversionRate: 4.5,
          conversionChange: 1.2,
          // Added customer-related properties
          customersChange: 7.2,
          newCustomers: 24,
          newCustomersChange: 12.5,
          customerLifetimeValue: 325.50,
          clvChange: 4.8,
          repeatPurchaseRate: 42,
          rprChange: 3.2,
          salesData: Array.from({ length: 30 }, (_, i) => ({
            date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            revenue: Math.floor(Math.random() * 1000) + 200,
          })),
          dailySalesData: Array.from({ length: 7 }, (_, i) => ({
            date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            revenue: Math.floor(Math.random() * 1000) + 200,
          })),
          weeklySalesData: Array.from({ length: 4 }, (_, i) => ({
            date: `Week ${i + 1}`,
            revenue: Math.floor(Math.random() * 5000) + 1000,
          })),
          monthlySalesData: Array.from({ length: 6 }, (_, i) => ({
            date: new Date(Date.now() - i * 30 * 24 * 60 * 60 * 1000).toLocaleString('default', { month: 'short' }),
            revenue: Math.floor(Math.random() * 10000) + 5000,
          })),
          salesByDay: Array.from({ length: 30 }, (_, i) => ({
            date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            revenue: Math.floor(Math.random() * 1000) + 200,
          })),
          topSellingProducts: [
            { id: 'p1', name: 'Organic Fertilizer', sales: 48, revenue: 2400 },
            { id: 'p2', name: 'Heirloom Seeds Pack', sales: 36, revenue: 1800 },
            { id: 'p3', name: 'Garden Tools Set', sales: 24, revenue: 1200 },
            { id: 'p4', name: 'Irrigation System', sales: 18, revenue: 900 },
          ],
          recentSales: [
            { id: 'o1', date: '2023-07-24', customer: 'John Doe', amount: 125.99, status: 'completed' },
            { id: 'o2', date: '2023-07-23', customer: 'Jane Smith', amount: 89.50, status: 'completed' },
            { id: 'o3', date: '2023-07-22', customer: 'Bob Johnson', amount: 210.75, status: 'processing' },
            { id: 'o4', date: '2023-07-21', customer: 'Alice Brown', amount: 56.25, status: 'completed' },
          ],
          salesByCategory: [
            { category: 'Seeds', sales: 4200 },
            { category: 'Equipment', sales: 3800 },
            { category: 'Fertilizer', sales: 2100 },
            { category: 'Services', sales: 1500 },
          ],
        };

        // Simulate API call
        setTimeout(() => {
          setAnalytics(mockData);
          setIsLoading(false);
        }, 1000);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch analytics'));
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [dateRange, type]);

  return { analytics, isLoading, error };
}
