import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

interface ServerAdminGuardProps {
  children: React.ReactNode;
}

const ADMIN_EMAIL = "alexsouthflow3@gmail.com";

export default async function ServerAdminGuard({ children }: ServerAdminGuardProps) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    console.log("ServerAdminGuard: User check:", user ? { id: user.id, email: user.email } : "No user");

    if (!user) {
      console.log("ServerAdminGuard: No user, redirecting to login");
      redirect("/login");
    }

    // Simple admin check
    const isAdminUser = user.email === ADMIN_EMAIL;
    console.log(`ServerAdminGuard: Admin check: ${user.email} === ${ADMIN_EMAIL} = ${isAdminUser}`);
    
    if (!isAdminUser) {
      console.log("ServerAdminGuard: Not admin, redirecting to home");
      redirect("/");
    }

    console.log("ServerAdminGuard: Admin verified, rendering children");
    return <>{children}</>;
  } catch (error) {
    console.error("ServerAdminGuard: Error occurred:", error);
    redirect("/");
  }
}
