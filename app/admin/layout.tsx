import ServerAdminGuard from "@/app/components/ServerAdminGuard";
import { AdminSidebar } from "@/app/components/admin/AdminSidebar";
import { AdminHeader } from "@/app/components/admin/AdminHeader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ServerAdminGuard>
      <div className="flex h-screen bg-gray-50 dark:g-background overflow-hidden">
        <AdminSidebar />
        <div className="flex flex-col flex-1 min-w-0">
          <AdminHeader />
          <main className="flex-1 overflow-y-auto bg-gray-50 dark:g-background">
            {children}
          </main>
        </div>
      </div>
    </ServerAdminGuard>
  );
}
