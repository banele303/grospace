import { requireVendor } from "@/app/lib/auth";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  DollarSign, 
  CreditCard,
  FileText,
  Search, 
  Filter,
  Download,
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowUpRight,
  Banknote
} from "lucide-react";
import { formatPrice } from "@/app/lib/utils";
import { unstable_noStore as noStore } from "next/cache";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

async function getVendorEarnings(vendorId: string) {
  noStore();
  
  const earnings = await prisma.vendorEarning.findMany({
    where: { vendorId },
    orderBy: { createdAt: 'desc' },
  });

  const totalEarnings = earnings.reduce((sum, e) => sum + e.netAmount, 0);
  const pendingEarnings = earnings
    .filter(e => e.status === 'PENDING')
    .reduce((sum, e) => sum + e.netAmount, 0);
  const paidEarnings = earnings
    .filter(e => e.status === 'PAID')
    .reduce((sum, e) => sum + e.netAmount, 0);
  const totalCommission = earnings.reduce((sum, e) => sum + e.commission, 0);

  // Calculate monthly earnings for the last 6 months
  const monthlyEarnings = [];
  const now = new Date();
  
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
    
    const monthEarnings = earnings.filter(earning => {
      const earningDate = new Date(earning.createdAt);
      return earningDate >= date && earningDate < nextMonth;
    });

    monthlyEarnings.push({
      month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      earnings: monthEarnings.reduce((sum, e) => sum + e.netAmount, 0),
      commission: monthEarnings.reduce((sum, e) => sum + e.commission, 0),
      count: monthEarnings.length,
    });
  }

  const stats = {
    total: earnings.length,
    pending: earnings.filter(e => e.status === 'PENDING').length,
    paid: earnings.filter(e => e.status === 'PAID').length,
    processing: earnings.filter(e => e.status === 'PROCESSING').length,
  };

  // Get actual payout data from database
  const payouts = await prisma.vendorPayout.findMany({
    where: { vendorId },
    orderBy: { createdAt: 'desc' },
  }).catch(() => []); // Return empty array if table doesn't exist yet

  return {
    earnings,
    totalEarnings,
    pendingEarnings,
    paidEarnings,
    totalCommission,
    monthlyEarnings,
    stats,
    payouts,
  };
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'PENDING':
      return <Clock className="h-4 w-4 text-yellow-500" />;
    case 'PROCESSING':
      return <AlertCircle className="h-4 w-4 text-blue-500" />;
    case 'PAID':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    default:
      return <Clock className="h-4 w-4 text-gray-500" />;
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800';
    case 'PROCESSING':
      return 'bg-blue-100 text-blue-800';
    case 'PAID':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export default async function VendorEarningsPage() {
  const { vendor } = await requireVendor();
  const data = await getVendorEarnings(vendor.id);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-agricultural-800">Earnings</h1>
          <p className="text-agricultural-600 mt-1">
            Track your earnings, payouts, and financial performance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Statement
          </Button>
          <Button className="bg-agricultural-500 hover:bg-agricultural-600">
            <CreditCard className="h-4 w-4 mr-2" />
            Request Payout
          </Button>
        </div>
      </div>

      {/* Earnings Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-agricultural-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-agricultural-700">
              Total Earnings
            </CardTitle>
            <DollarSign className="h-4 w-4 text-agricultural-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-agricultural-800">
              {formatPrice(data.totalEarnings)}
            </div>
            <div className="flex items-center gap-1 mt-1">
              <ArrowUpRight className="h-3 w-3 text-green-500" />
              <span className="text-xs text-green-600 font-medium">
                +12.5%
              </span>
              <span className="text-xs text-agricultural-600">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-yellow-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-700">
              Pending
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-800">
              {formatPrice(data.pendingEarnings)}
            </div>
            <p className="text-xs text-yellow-600">
              {data.stats.pending} transactions
            </p>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">
              Paid Out
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-800">
              {formatPrice(data.paidEarnings)}
            </div>
            <p className="text-xs text-green-600">
              {data.stats.paid} transactions
            </p>
          </CardContent>
        </Card>

        <Card className="border-red-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-700">
              Total Commission
            </CardTitle>
            <Banknote className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-800">
              {formatPrice(data.totalCommission)}
            </div>
            <p className="text-xs text-red-600">
              Platform fees
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Earnings Management */}
      <Tabs defaultValue="earnings" className="space-y-6">
        <TabsList className="bg-agricultural-50">
          <TabsTrigger value="earnings">Earnings History</TabsTrigger>
          <TabsTrigger value="payouts">Payouts</TabsTrigger>
          <TabsTrigger value="statements">Statements</TabsTrigger>
        </TabsList>

        <TabsContent value="earnings" className="space-y-6">
          {/* Monthly Performance */}
          <Card className="border-agricultural-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-agricultural-800">
                Monthly Earnings Trend
              </CardTitle>
              <CardDescription>
                Your earnings performance over the last 6 months
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.monthlyEarnings.map((month, index) => (
                  <div key={month.month} className="flex items-center justify-between p-4 bg-agricultural-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-agricultural-100 rounded-lg flex items-center justify-center">
                        <Calendar className="h-6 w-6 text-agricultural-600" />
                      </div>
                      <div>
                        <p className="font-medium text-agricultural-800">{month.month}</p>
                        <p className="text-sm text-agricultural-600">
                          {month.count} transactions
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-agricultural-800">
                        {formatPrice(month.earnings)}
                      </p>
                      <p className="text-sm text-red-600">
                        -{formatPrice(month.commission)} commission
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Earnings Table */}
          <Card className="border-agricultural-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-agricultural-800">
                  Earnings History
                </CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-agricultural-400" />
                    <Input
                      placeholder="Search earnings..."
                      className="pl-10 w-64"
                    />
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {data.earnings.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Gross Amount</TableHead>
                      <TableHead>Commission</TableHead>
                      <TableHead>Net Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.earnings.map((earning) => (
                      <TableRow key={earning.id}>
                        <TableCell>
                          <span className="font-medium text-agricultural-800">
                            #{earning.orderId.slice(-8)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium text-agricultural-800">
                            {formatPrice(earning.grossAmount)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-red-600">
                            -{formatPrice(earning.commission)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="font-bold text-green-600">
                            {formatPrice(earning.netAmount)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${getStatusColor(earning.status)} border-0`}>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(earning.status)}
                              {earning.status}
                            </div>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm text-agricultural-600">
                            <Calendar className="h-4 w-4" />
                            {new Date(earning.createdAt).toLocaleDateString()}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12">
                  <DollarSign className="h-16 w-16 text-agricultural-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-agricultural-800 mb-2">
                    No earnings yet
                  </h3>
                  <p className="text-agricultural-600">
                    Earnings will appear here when customers purchase your products.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payouts" className="space-y-6">
          <Card className="border-agricultural-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-agricultural-800">
                Payout History
              </CardTitle>
              <CardDescription>
                Track your payout requests and payments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.payouts.map((payout) => (
                  <div key={payout.id} className="flex items-center justify-between p-4 bg-agricultural-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-agricultural-100 rounded-lg flex items-center justify-center">
                        <CreditCard className="h-6 w-6 text-agricultural-600" />
                      </div>
                      <div>
                        <p className="font-medium text-agricultural-800">
                          {payout.method}
                        </p>
                        <p className="text-sm text-agricultural-600">
                          {payout.date.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-agricultural-800">
                        {formatPrice(payout.amount)}
                      </p>
                      <Badge 
                        className={`${getStatusColor(payout.status)} border-0 text-xs`}
                      >
                        {payout.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statements" className="space-y-6">
          <Card className="border-agricultural-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-agricultural-800">
                Financial Statements
              </CardTitle>
              <CardDescription>
                Download your monthly and yearly financial statements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['January 2024', 'December 2023', 'November 2023'].map((period) => (
                  <div key={period} className="flex items-center justify-between p-4 bg-agricultural-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-agricultural-100 rounded-lg flex items-center justify-center">
                        <FileText className="h-6 w-6 text-agricultural-600" />
                      </div>
                      <div>
                        <p className="font-medium text-agricultural-800">
                          Statement for {period}
                        </p>
                        <p className="text-sm text-agricultural-600">
                          Earnings summary and transaction details
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
