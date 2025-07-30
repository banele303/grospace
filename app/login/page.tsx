import { redirect } from "next/navigation";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export default async function LoginPage() {
  const { isAuthenticated } = getKindeServerSession();
  const baseUrl = process.env.KINDE_SITE_URL || "http://localhost:3000";
  
  if (await isAuthenticated()) {
    redirect(baseUrl);
  }
  
  // Use fully qualified URL for redirect
  redirect(`/api/auth/login?post_login_redirect_url=${encodeURIComponent(baseUrl)}`);
}
