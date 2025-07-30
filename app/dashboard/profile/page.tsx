import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Shield, 
  Camera, 
  Settings,
  Bell,
  Lock
} from "lucide-react";
import { getCurrentUser } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import { prisma } from "@/lib/db";
import { PersonalInfoForm } from "../../components/dashboard/profile/PersonalInfoForm";
import { PasswordForm } from "../../components/dashboard/profile/PasswordForm";
import { NotificationSettingsForm } from "../../components/dashboard/profile/NotificationSettingsForm";
import { PreferencesForm } from "../../components/dashboard/profile/PreferencesForm";

async function getUserProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      profileImage: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          orders: true,
          reviews: true,
          favorites: true,
        }
      }
    }
  });

  return user;
}

async function getUserStats(userId: string) {
  const [orderStats, totalSpent] = await Promise.all([
    prisma.order.aggregate({
      where: { userId },
      _count: { id: true },
    }),
    prisma.order.aggregate({
      where: { 
        userId,
        status: 'DELIVERED'
      },
      _sum: { total: true },
    })
  ]);

  return {
    totalOrders: orderStats._count.id,
    totalSpent: totalSpent._sum.total || 0,
  };
}

export default async function ProfilePage() {
  noStore();
  const user = await getCurrentUser();

  if (!user) {
    return redirect('/sign-in');
  }

  const [profile, stats] = await Promise.all([
    getUserProfile(user.id),
    getUserStats(user.id)
  ]);

  if (!profile) {
    return redirect('/sign-in');
  }

  const userInitials = `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`.toUpperCase();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Overview */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={profile.profileImage} alt={`${profile.firstName} ${profile.lastName}`} />
                    <AvatarFallback className="text-lg font-semibold">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="icon"
                    variant="outline"
                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-1">
                  <h3 className="text-xl font-semibold">
                    {profile.firstName} {profile.lastName}
                  </h3>
                  <p className="text-muted-foreground">{profile.email}</p>
                  <Badge variant={profile.role === 'ADMIN' ? 'default' : 'secondary'}>
                    {profile.role}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 w-full pt-4 border-t">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">{stats.totalOrders}</p>
                    <p className="text-sm text-muted-foreground">Total Orders</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">
                      ${(stats.totalSpent / 100).toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground">Total Spent</p>
                  </div>
                </div>

                <div className="w-full pt-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Member since</span>
                    <span>{new Date(profile.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Last updated</span>
                    <span>{new Date(profile.updatedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Account status</span>
                    <Badge variant={profile.isActive ? 'secondary' : 'destructive'} className="text-xs">
                      {profile.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="personal" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>

            {/* Personal Information */}
            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                  <CardDescription>
                    Update your personal details and contact information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <PersonalInfoForm user={profile} />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security */}
            <TabsContent value="security">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lock className="h-5 w-5" />
                      Password & Security
                    </CardTitle>
                    <CardDescription>
                      Manage your password and security settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <PasswordForm />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Two-Factor Authentication
                    </CardTitle>
                    <CardDescription>
                      Add an extra layer of security to your account
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="font-medium">Two-Factor Authentication</p>
                        <p className="text-sm text-muted-foreground">
                          Protect your account with 2FA
                        </p>
                      </div>
                      <Button variant="outline">
                        Enable 2FA
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Preferences */}
            <TabsContent value="preferences">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Account Preferences
                  </CardTitle>
                  <CardDescription>
                    Customize your account settings and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <PreferencesForm />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications */}
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notification Settings
                  </CardTitle>
                  <CardDescription>
                    Choose what notifications you want to receive
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <NotificationSettingsForm />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
