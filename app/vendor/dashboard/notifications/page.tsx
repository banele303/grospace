import { requireVendor } from "@/app/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bell, 
  Mail, 
  Smartphone, 
  Settings, 
  Check, 
  X,
  ShoppingCart,
  Package,
  DollarSign,
  Star,
  AlertCircle,
  CheckCircle,
  Clock,
  MessageSquare
} from "lucide-react";
import { unstable_noStore as noStore } from "next/cache";

// Mock data for notifications - in real app, this would come from database
const mockNotifications = [
  {
    id: "1",
    type: "order",
    title: "New Order Received",
    message: "You have a new order #12345 from Sarah Johnson",
    timestamp: new Date("2024-01-20T10:30:00"),
    read: false,
    priority: "high",
    icon: ShoppingCart,
  },
  {
    id: "2",
    type: "payment",
    title: "Payment Received",
    message: "Payment of R450.00 has been processed for order #12344",
    timestamp: new Date("2024-01-20T09:15:00"),
    read: false,
    priority: "normal",
    icon: DollarSign,
  },
  {
    id: "3",
    type: "review",
    title: "New Product Review",
    message: "Mike Chen left a 5-star review for your organic tomatoes",
    timestamp: new Date("2024-01-19T16:45:00"),
    read: true,
    priority: "normal",
    icon: Star,
  },
  {
    id: "4",
    type: "inventory",
    title: "Low Stock Alert",
    message: "Carrots are running low (5 units remaining)",
    timestamp: new Date("2024-01-19T14:20:00"),
    read: true,
    priority: "medium",
    icon: Package,
  },
  {
    id: "5",
    type: "message",
    title: "Customer Message",
    message: "Emma Wilson sent you a message about bulk orders",
    timestamp: new Date("2024-01-19T11:30:00"),
    read: true,
    priority: "normal",
    icon: MessageSquare,
  },
  {
    id: "6",
    type: "system",
    title: "Profile Update Required",
    message: "Please update your business information to maintain vendor status",
    timestamp: new Date("2024-01-18T08:00:00"),
    read: true,
    priority: "medium",
    icon: AlertCircle,
  },
];

function getNotificationColor(type: string, priority: string) {
  if (priority === "high") return "border-l-red-500 bg-red-50";
  if (priority === "medium") return "border-l-yellow-500 bg-yellow-50";
  return "border-l-blue-500 bg-blue-50";
}

function getPriorityBadge(priority: string) {
  switch (priority) {
    case "high":
      return <Badge variant="destructive" className="text-xs">High</Badge>;
    case "medium":
      return <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">Medium</Badge>;
    default:
      return <Badge variant="outline" className="text-xs">Normal</Badge>;
  }
}

export default async function VendorNotificationsPage() {
  noStore();
  const { user, vendor } = await requireVendor();

  const unreadCount = mockNotifications.filter(n => !n.read).length;
  const todayCount = mockNotifications.filter(n => 
    n.timestamp.toDateString() === new Date().toDateString()
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-agricultural-800">Notifications</h1>
          <p className="text-agricultural-600 mt-1">
            Stay updated with your business activities and manage notification preferences
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Check className="h-4 w-4 mr-2" />
            Mark All Read
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Notification Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Bell className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-agricultural-800">
                  {mockNotifications.length}
                </p>
                <p className="text-sm text-agricultural-600">Total Notifications</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-full">
                <AlertCircle className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-agricultural-800">
                  {unreadCount}
                </p>
                <p className="text-sm text-agricultural-600">Unread</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-full">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-agricultural-800">
                  {todayCount}
                </p>
                <p className="text-sm text-agricultural-600">Today</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 rounded-full">
                <Star className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-agricultural-800">
                  {mockNotifications.filter(n => n.priority === "high").length}
                </p>
                <p className="text-sm text-agricultural-600">High Priority</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Notifications</TabsTrigger>
          <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Notifications</CardTitle>
              <CardDescription>
                Your latest business notifications and updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockNotifications.map((notification) => {
                  const IconComponent = notification.icon;
                  return (
                    <div
                      key={notification.id}
                      className={`border-l-4 p-4 rounded-lg transition-colors hover:bg-gray-50 ${
                        getNotificationColor(notification.type, notification.priority)
                      } ${!notification.read ? 'bg-opacity-100' : 'bg-opacity-50'}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-white rounded-full">
                            <IconComponent className="h-4 w-4 text-agricultural-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className={`font-medium ${!notification.read ? 'font-bold' : ''}`}>
                                {notification.title}
                              </h4>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              )}
                              {getPriorityBadge(notification.priority)}
                            </div>
                            <p className="text-sm text-gray-700 mb-2">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500">
                              {notification.timestamp.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {!notification.read && (
                            <Button variant="outline" size="sm">
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                          <Button variant="outline" size="sm">
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="unread" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Unread Notifications</CardTitle>
              <CardDescription>
                Notifications that require your attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockNotifications.filter(n => !n.read).map((notification) => {
                  const IconComponent = notification.icon;
                  return (
                    <div
                      key={notification.id}
                      className={`border-l-4 p-4 rounded-lg ${
                        getNotificationColor(notification.type, notification.priority)
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-white rounded-full">
                            <IconComponent className="h-4 w-4 text-agricultural-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-bold">{notification.title}</h4>
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              {getPriorityBadge(notification.priority)}
                            </div>
                            <p className="text-sm text-gray-700 mb-2">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500">
                              {notification.timestamp.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Check className="h-4 w-4 mr-2" />
                          Mark Read
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Customize how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Email Notifications */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Email Notifications
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email-orders">New Orders</Label>
                      <p className="text-sm text-gray-600">Get notified when you receive new orders</p>
                    </div>
                    <Switch id="email-orders" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email-payments">Payment Confirmations</Label>
                      <p className="text-sm text-gray-600">Receive notifications for successful payments</p>
                    </div>
                    <Switch id="email-payments" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email-reviews">Product Reviews</Label>
                      <p className="text-sm text-gray-600">Get notified when customers leave reviews</p>
                    </div>
                    <Switch id="email-reviews" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email-inventory">Low Stock Alerts</Label>
                      <p className="text-sm text-gray-600">Receive alerts when products are running low</p>
                    </div>
                    <Switch id="email-inventory" defaultChecked />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Push Notifications */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  Push Notifications
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="push-orders">New Orders</Label>
                      <p className="text-sm text-gray-600">Instant notifications for new orders</p>
                    </div>
                    <Switch id="push-orders" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="push-messages">Customer Messages</Label>
                      <p className="text-sm text-gray-600">Get notified when customers send messages</p>
                    </div>
                    <Switch id="push-messages" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="push-promotions">Promotion Updates</Label>
                      <p className="text-sm text-gray-600">Updates about your promotional campaigns</p>
                    </div>
                    <Switch id="push-promotions" />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Frequency Settings */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Notification Frequency</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="digest-daily">Daily Digest</Label>
                      <p className="text-sm text-gray-600">Receive a daily summary of your business activity</p>
                    </div>
                    <Switch id="digest-daily" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="digest-weekly">Weekly Report</Label>
                      <p className="text-sm text-gray-600">Get a weekly performance report</p>
                    </div>
                    <Switch id="digest-weekly" defaultChecked />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button className="bg-agricultural-500 hover:bg-agricultural-600">
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
