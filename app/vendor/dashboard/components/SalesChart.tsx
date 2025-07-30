'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/app/lib/utils";
import { TrendingUp } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { useTheme } from "next-themes";

// Sales data type
interface SalesData {
  date: string;
  amount: number;
}

interface SalesChartProps {
  data: SalesData[];
  totalSales: number;
  percentageChange: number;
}

export default function SalesChart({ data, totalSales, percentageChange }: SalesChartProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Format tooltip value with proper South African Rand formatting with 2 decimal places
  const formatTooltipValue = (value: number) => {
    return `R ${new Intl.NumberFormat("en-ZA", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)}`;
  };

  // Custom tooltip component for better styling
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className={`p-3 rounded-lg shadow-lg ${isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'}`}>
          <p className={`font-medium text-sm ${isDark ? 'text-slate-200' : 'text-gray-900'}`}>{label}</p>
          <p className={`text-sm font-semibold mt-1 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
            {formatTooltipValue(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className={`border ${isDark ? 'border-slate-700 bg-slate-800/50 hover:shadow-emerald-900/10' : 'border-gray-200 bg-white hover:shadow-emerald-100'} hover:border-emerald-200 transition-all duration-300 shadow-lg`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className={`text-lg font-semibold ${isDark ? 'text-slate-100' : 'text-gray-800'}`}>
              Weekly Sales
            </CardTitle>
            <CardDescription className={isDark ? 'text-slate-400' : 'text-gray-500'}>
              Past 7 days of sales activity
            </CardDescription>
          </div>
          <div className={`p-2 rounded-full ${isDark ? 'bg-emerald-900/20 text-emerald-400' : 'bg-emerald-50 text-emerald-600'}`}>
            <TrendingUp className="h-5 w-5" />
          </div>
        </div>
        <div className={`mt-2 text-2xl font-bold ${isDark ? 'text-slate-50' : 'text-gray-800'}`}>
          {`R ${new Intl.NumberFormat("en-ZA", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(totalSales)}`}
          <span className={`ml-2 text-sm font-medium ${percentageChange >= 0 ? (isDark ? 'text-emerald-400' : 'text-emerald-600') : (isDark ? 'text-red-400' : 'text-red-600')}`}>
            {percentageChange >= 0 ? '+' : ''}{percentageChange}%
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-0 pt-4">
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 0, right: 0, left: 70, bottom: 0 }}
            >
              <defs>
                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop 
                    offset="5%" 
                    stopColor={isDark ? "#059669" : "#10b981"} 
                    stopOpacity={0.3} 
                  />
                  <stop 
                    offset="95%" 
                    stopColor={isDark ? "#059669" : "#10b981"} 
                    stopOpacity={0} 
                  />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="date" 
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
                stroke={isDark ? "#64748b" : "#94a3b8"}
              />
              <YAxis 
                tickFormatter={formatTooltipValue}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
                stroke={isDark ? "#64748b" : "#94a3b8"}
                width={80}
              />
              <CartesianGrid 
                strokeDasharray="3 3" 
                vertical={false} 
                stroke={isDark ? "#334155" : "#e2e8f0"} 
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="amount"
                stroke={isDark ? "#10b981" : "#059669"}
                strokeWidth={2}
                fill="url(#salesGradient)"
                activeDot={{ 
                  r: 6, 
                  fill: isDark ? "#10b981" : "#059669",
                  stroke: isDark ? "#0f172a" : "#ffffff", 
                  strokeWidth: 2 
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
