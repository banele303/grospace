import { redirect } from "next/navigation";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { isAdmin } from "@/app/lib/admin-actions";

export async function ServerAdminGuard({ children }: { children: React.ReactNode }) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    // If no user, redirect to login
    if (!user) {
      redirect("/api/auth/login?post_login_redirect_url=%2Fadmin");
    }

    // Check if user is admin
    const adminStatus = await isAdmin();
    
    // If not admin, redirect to home
    if (!adminStatus) {
      redirect("/");
    }

    // User is authenticated and admin, show content
    return <>{children}</>;
  } catch (error) {
    console.error("ServerAdminGuard error:", error);
    redirect("/");
  }
}
