import { ReactNode } from "react";
import { DashboardSidebar } from "@/components/dashboard/customer/DashboardSidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { MenuIcon, User } from "lucide-react";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import { ThemeToggle } from "@/components/ThemeToggle";
import { UserMenu } from "@/components/dashboard/customer/UserMenu";
import { AuthSyncWrapper } from "@/app/components/dashboard/AuthSyncWrapper";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  noStore();
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex w-64 flex-col">
          <DashboardSidebar />
        </div>
      </div>

      {/* Mobile menu */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              className="fixed top-4 left-4 z-50 lg:hidden"
              variant="outline"
              size="icon"
            >
              <MenuIcon className="h-5 w-5" />
              <span className="sr-only">Open sidebar</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <DashboardSidebar />
          </SheetContent>
        </Sheet>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Auth sync component to ensure user is created in database */}
        <AuthSyncWrapper />
        
        {/* Top navigation */}
        <header className="bg-white dark:bg-gray-800 shadow-sm z-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex items-center lg:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MenuIcon className="h-5 w-5" />
                      <span className="sr-only">Open sidebar</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-64 p-0">
                    <DashboardSidebar />
                  </SheetContent>
                </Sheet>
              </div>
              <div className="flex items-center gap-4">
                <ThemeToggle />
                <UserMenu user={user} />
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1">
          <div className="py-6">
            <div className="mx-auto px-4 sm:px-6 md:px-8">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
