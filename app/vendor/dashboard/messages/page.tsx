import { requireVendor } from "@/app/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  MessageSquare, 
  Search, 
  Send, 
  Paperclip, 
  MoreVertical,
  Star,
  Archive,
  Trash2,
  Reply,
  Forward,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { unstable_noStore as noStore } from "next/cache";

// Mock data for messages - in real app, this would come from database
const mockMessages = [
  {
    id: "1",
    customer: {
      name: "Sarah Johnson",
      email: "sarah@example.com",
      avatar: null,
    },
    subject: "Question about organic tomatoes",
    preview: "Hi, I'm interested in your organic tomatoes. Are they available for delivery next week?",
    content: "Hi there,\n\nI'm interested in purchasing your organic tomatoes for my restaurant. Are they available for delivery next week? I would need about 20kg. Also, could you tell me more about your farming practices?\n\nThanks,\nSarah",
    timestamp: new Date("2024-01-20T10:30:00"),
    status: "unread",
    priority: "normal",
  },
  {
    id: "2",
    customer: {
      name: "Mike Chen",
      email: "mike@example.com",
      avatar: null,
    },
    subject: "Order #12345 - Delivery Issue",
    preview: "There seems to be an issue with my recent order delivery. Can you help?",
    content: "Hello,\n\nI placed order #12345 last week and it was supposed to be delivered yesterday, but I haven't received it yet. Could you please check the status and let me know what's happening?\n\nOrder details:\n- 5kg carrots\n- 3kg potatoes\n- 2kg onions\n\nThanks for your help.",
    timestamp: new Date("2024-01-19T14:15:00"),
    status: "replied",
    priority: "high",
  },
  {
    id: "3",
    customer: {
      name: "Emma Wilson",
      email: "emma@example.com",
      avatar: null,
    },
    subject: "Bulk order inquiry",
    preview: "I'm interested in placing a bulk order for my grocery store. Can we discuss pricing?",
    content: "Dear Vendor,\n\nI run a small grocery store and I'm interested in sourcing fresh produce from local farmers like yourself. Could we discuss bulk pricing for regular weekly orders?\n\nI'm particularly interested in:\n- Seasonal vegetables\n- Fresh herbs\n- Root vegetables\n\nLooking forward to hearing from you.\n\nBest regards,\nEmma Wilson",
    timestamp: new Date("2024-01-18T09:45:00"),
    status: "read",
    priority: "normal",
  },
];

export default async function VendorMessagesPage() {
  noStore();
  const { user, vendor } = await requireVendor();

  const unreadCount = mockMessages.filter(msg => msg.status === "unread").length;
  const highPriorityCount = mockMessages.filter(msg => msg.priority === "high").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-agricultural-800">Messages</h1>
          <p className="text-agricultural-600 mt-1">
            Communicate with your customers and manage inquiries
          </p>
        </div>
        <Button className="bg-agricultural-500 hover:bg-agricultural-600">
          <Send className="h-4 w-4 mr-2" />
          Compose Message
        </Button>
      </div>

      {/* Message Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-agricultural-800">
                  {mockMessages.length}
                </p>
                <p className="text-sm text-agricultural-600">Total Messages</p>
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
                <p className="text-sm text-agricultural-600">Unread Messages</p>
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
                  {highPriorityCount}
                </p>
                <p className="text-sm text-agricultural-600">High Priority</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-agricultural-800">
                  {mockMessages.filter(msg => msg.status === "replied").length}
                </p>
                <p className="text-sm text-agricultural-600">Replied</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Message List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Inbox</CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search messages..."
                    className="pl-10 w-full"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-0">
                {mockMessages.map((message, index) => (
                  <div key={message.id}>
                    <div className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                      message.status === "unread" ? "bg-blue-50 border-l-4 border-l-blue-500" : ""
                    }`}>
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-agricultural-100 text-agricultural-700">
                            {message.customer.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className={`text-sm font-medium truncate ${
                              message.status === "unread" ? "font-bold" : ""
                            }`}>
                              {message.customer.name}
                            </h4>
                            <div className="flex items-center gap-1">
                              {message.priority === "high" && (
                                <Star className="h-3 w-3 text-red-500 fill-red-500" />
                              )}
                              <span className="text-xs text-gray-500">
                                {message.timestamp.toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <p className={`text-sm truncate mb-1 ${
                            message.status === "unread" ? "font-semibold" : "text-gray-600"
                          }`}>
                            {message.subject}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {message.preview}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge 
                              variant={message.status === "unread" ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {message.status}
                            </Badge>
                            {message.priority === "high" && (
                              <Badge variant="destructive" className="text-xs">
                                High Priority
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    {index < mockMessages.length - 1 && <Separator />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-agricultural-100 text-agricultural-700">
                      SJ
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">Sarah Johnson</h3>
                    <p className="text-sm text-gray-600">sarah@example.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Reply className="h-4 w-4 mr-2" />
                    Reply
                  </Button>
                  <Button variant="outline" size="sm">
                    <Forward className="h-4 w-4 mr-2" />
                    Forward
                  </Button>
                  <Button variant="outline" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-lg mb-2">Question about organic tomatoes</h4>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                    <Clock className="h-4 w-4" />
                    <span>January 20, 2024 at 10:30 AM</span>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="whitespace-pre-line text-gray-700">
                    {mockMessages[0].content}
                  </p>
                </div>

                <Separator />

                {/* Reply Form */}
                <div className="space-y-4">
                  <h4 className="font-semibold">Reply to Sarah</h4>
                  <Textarea
                    placeholder="Type your reply here..."
                    className="min-h-[120px]"
                  />
                  <div className="flex items-center justify-between">
                    <Button variant="outline" size="sm">
                      <Paperclip className="h-4 w-4 mr-2" />
                      Attach File
                    </Button>
                    <div className="flex items-center gap-2">
                      <Button variant="outline">Save Draft</Button>
                      <Button className="bg-agricultural-500 hover:bg-agricultural-600">
                        <Send className="h-4 w-4 mr-2" />
                        Send Reply
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
