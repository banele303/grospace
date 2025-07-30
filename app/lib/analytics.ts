import { prisma } from "@/lib/db";
import { OrderStatus } from "@prisma/client";
import { startOfDay, endOfDay, subDays, subMonths, format } from "date-fns";
import { AnalyticsData } from "./posthog";

const POSTHOG_API_KEY = process.env.NEXT_PUBLIC_POSTHOG_API_KEY;
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com";

async function fetchFromPostHog(endpoint: string, params: Record<string, any>) {
  if (!POSTHOG_API_KEY) {
    throw new Error("PostHog API key is not configured");
  }

  const response = await fetch(`${POSTHOG_HOST}/api/projects/${process.env.NEXT_PUBLIC_POSTHOG_PROJECT_ID}/${endpoint}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${POSTHOG_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`PostHog API error: ${response.statusText}. Details: ${errorText}`);
  }

  return response.json();
}

export async function getAnalyticsData(startDate?: Date, endDate?: Date): Promise<AnalyticsData> {
  // If no dates provided, use default 30-day range
  if (!startDate || !endDate) {
    const now = new Date();
    startDate = subDays(now, 30);
    endDate = now;
  }

  const lastMonth = subMonths(startDate, 1);
  const lastMonthEnd = subMonths(endDate, 1);

  try {
    // Get PostHog data
    const [pageViews, userActivity, userDemographics, deviceStats, topProducts, funnelData, revenueData] = await Promise.all([
      // Page Views
      fetchFromPostHog('insights/trend', {
        events: [{ id: '$pageview', type: 'events' }],
        date_from: startDate.toISOString(),
        date_to: endDate.toISOString(),
        interval: 'day',
      }),

      // User Activity
      fetchFromPostHog('insights/trend', {
        events: [
          { id: 'product_viewed', type: 'events' },
          { id: 'product_added_to_cart', type: 'events' },
          { id: 'checkout_started', type: 'events' },
          { id: 'purchase_completed', type: 'events' },
        ],
        date_from: startDate.toISOString(),
        date_to: endDate.toISOString(),
      }),

      // User Demographics
      fetchFromPostHog('insights/trend', {
        events: [{ id: '$pageview', type: 'events' }],
        breakdown: '$geoip_country_name',
        date_from: startDate.toISOString(),
        date_to: endDate.toISOString(),
      }),

      // Device Stats
      fetchFromPostHog('insights/trend', {
        events: [{ id: '$pageview', type: 'events' }],
        breakdown: '$device_type',
        date_from: startDate.toISOString(),
        date_to: endDate.toISOString(),
      }),

      // Top Products
      fetchFromPostHog('insights/trend', {
        events: [
          { id: 'product_viewed', type: 'events' },
          { id: 'purchase_completed', type: 'events' },
        ],
        breakdown: 'product_name',
        date_from: startDate.toISOString(),
        date_to: endDate.toISOString(),
      }),

      // Funnel Data
      fetchFromPostHog('insights/funnel', {
        events: [
          { id: '$pageview', type: 'events' },
          { id: 'product_viewed', type: 'events' },
          { id: 'product_added_to_cart', type: 'events' },
          { id: 'checkout_started', type: 'events' },
          { id: 'purchase_completed', type: 'events' },
        ],
        date_from: startDate.toISOString(),
        date_to: endDate.toISOString(),
      }),

      // Revenue Data
      fetchFromPostHog('insights/trend', {
        events: [{ id: 'purchase_completed', type: 'events' }],
        date_from: startDate.toISOString(),
        date_to: endDate.toISOString(),
        interval: 'day',
      }),
    ]);

    // Get Prisma data
        const [currentMonthRevenue, lastMonthRevenue, currentMonthUsers, lastMonthUsers, totalOrders] = await Promise.all([
      // Get total revenue and growth
      prisma.order.aggregate({
        where: {
          createdAt: {
            gte: startOfDay(startDate),
            lte: endOfDay(endDate),
          },
          status: OrderStatus.DELIVERED,
        },
        _sum: {
          total: true,
        },
      }),
      prisma.order.aggregate({
        where: {
          createdAt: {
            gte: startOfDay(lastMonth),
            lte: endOfDay(lastMonthEnd),
          },
          status: OrderStatus.DELIVERED,
        },
        _sum: {
          total: true,
        },
      }),
      // Get active users and growth
      prisma.user.count({
        where: {
          createdAt: {
            gte: startOfDay(startDate),
            lte: endOfDay(endDate),
          },
        },
      }),
      prisma.user.count({
        where: {
          createdAt: {
            gte: startOfDay(lastMonth),
            lte: endOfDay(lastMonthEnd),
          },
        },
      }),
      // Get total orders
      prisma.order.count({
        where: {
          createdAt: {
            gte: startOfDay(startDate),
            lte: endOfDay(endDate),
          },
          status: OrderStatus.DELIVERED,
        },
      }),
    ]);

    const totalRevenue = (currentMonthRevenue?._sum?.total ?? 0);
    const lastMonthTotal = (lastMonthRevenue?._sum?.total ?? 0);
    const revenueGrowth = lastMonthTotal > 0 ? ((totalRevenue - lastMonthTotal) / lastMonthTotal) * 100 : 0;
    const userGrowth = lastMonthUsers > 0 ? ((currentMonthUsers - lastMonthUsers) / lastMonthUsers) * 100 : 0;

    // Transform the data to match our interface
    return {
      uniqueVisitors: Array.isArray(pageViews?.result) ? pageViews.result.reduce((acc: number, curr: any) => acc + (curr.unique_users ?? 0), 0) : 0,
      totalPageViews: Array.isArray(pageViews?.result) ? pageViews.result.reduce((acc: number, curr: any) => acc + (curr.count ?? 0), 0) : 0,
      averageTimeOnSite: Array.isArray(pageViews?.result) && pageViews.result.length > 0 ? pageViews.result.reduce((acc: number, curr: any) => acc + (curr.avg_time_on_page ?? 0), 0) / pageViews.result.length : 0,
      bounceRate: 0,
      topPages: Array.isArray(pageViews?.result) ? pageViews.result.map((item: any) => ({
        path: item.path ?? '/',
        views: item.count ?? 0,
      })) : [],
      topReferrers: [],
      deviceTypes: Array.isArray(deviceStats?.result) ? deviceStats.result.map((item: any) => ({
        type: item.breakdown_value ?? '',
        count: item.count ?? 0,
      })) : [],
      browserTypes: [],
      totalRevenue,
      totalOrders: totalOrders ?? 0,
      revenueData: Array.isArray(revenueData?.result) ? revenueData.result.map((item: any) => ({
        date: item.date ?? '',
        revenue: item.revenue ?? 0,
        orders: item.count ?? 0,
        averageOrderValue: item.revenue && item.count ? item.revenue / item.count : 0,
      })) : [],
      userActivity: Array.isArray(userActivity?.result) ? userActivity.result.map((item: any) => ({
        name: item.event ?? '',
        value: item.count ?? 0,
      })) : [],
      topProducts: Array.isArray(topProducts?.result) ? topProducts.result.map((item: any) => ({
        name: item.breakdown_value ?? '',
        views: item.count ?? 0,
        purchases: item.purchase_count ?? 0,
      })) : [],
      pageViews: Array.isArray(pageViews?.result) ? pageViews.result.map((item: any) => ({
        date: item.date ?? '',
        views: item.count ?? 0,
        uniqueVisitors: item.unique_users ?? 0,
      })) : [],
      userDemographics: Array.isArray(userDemographics?.result) ? userDemographics.result.map((item: any) => ({
        country: item.breakdown_value ?? '',
        users: item.count ?? 0,
      })) : [],
      deviceStats: Array.isArray(deviceStats?.result) ? deviceStats.result.map((item: any) => ({
        device: item.breakdown_value ?? '',
        users: item.count ?? 0,
      })) : [],
      funnelData: Array.isArray(funnelData?.result) ? funnelData.result.map((step: any, index: number, array: any[]) => ({
        step: step.name ?? '',
        users: step.count ?? 0,
        dropoff: index === 0 ? 0 : ((array[index - 1]?.count ?? 0) - (step.count ?? 0)),
      })) : [],
      operatingSystems: [],
      userRetention: [],
      conversionFunnel: Array.isArray(funnelData?.result) ? funnelData.result.map((step: any, index: number, array: any[]) => ({
        step: step.name ?? '',
        users: step.count ?? 0,
        dropoff: index === 0 ? 0 : ((array[index - 1]?.count ?? 0) - (step.count ?? 0)),
      })) : [],
      revenueMetrics: {
        totalRevenue,
        averageOrderValue: totalRevenue / ((Array.isArray(revenueData?.result) ? revenueData.result.reduce((acc: number, curr: any) => acc + (curr.count ?? 0), 0) : 1) || 1),
        revenueByProduct: Array.isArray(topProducts?.result) ? topProducts.result.map((item: any) => ({
          productId: item.breakdown_value ?? '',
          revenue: item.revenue ?? 0,
        })) : [],
      },
      userBehavior: {
        averageSessionDuration: Array.isArray(pageViews?.result) && pageViews.result.length > 0 ? pageViews.result.reduce((acc: number, curr: any) => acc + (curr.avg_time_on_page ?? 0), 0) / pageViews.result.length : 0,
        pagesPerSession: Array.isArray(pageViews?.result) && pageViews.result.length > 0 ? pageViews.result.reduce((acc: number, curr: any) => acc + (curr.count ?? 0), 0) / (pageViews.result[0]?.unique_users ?? 1) : 0,
        exitPages: [],
      },
      searchAnalytics: [],
      revenueGrowth,
      activeUsers: currentMonthUsers ?? 0,
      userGrowth,
    };
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    throw error;
  }
} 