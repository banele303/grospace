import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle, AlertCircle, Mail, Phone } from "lucide-react";
import Link from "next/link";
import { getCurrentUser } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";

export default async function VendorPendingPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    return redirect('/auth-error');
  }

  // Get vendor information
  const vendor = await prisma.vendor.findFirst({
    where: { userId: user.id }
  });

  if (!vendor) {
    return redirect('/vendors/register');
  }

  if (vendor.approved) {
    return redirect('/vendor/dashboard');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 dark:bg-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-white dark:bg-slate-800 border-orange-200 dark:border-orange-800/50 shadow-xl dark:shadow-2xl">
        <CardContent className="pt-6 bg-white dark:bg-slate-800">
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-orange-500 dark:bg-orange-600 rounded-full flex items-center justify-center mx-auto shadow-lg dark:shadow-orange-900/50">
              <Clock className="h-10 w-10 text-white" />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Application Under Review</h1>
              <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                Thank you for applying to become a vendor on our agricultural marketplace!
              </p>
            </div>

            <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg border border-orange-200 dark:border-orange-800/50">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <span className="text-sm text-gray-800 dark:text-gray-200">Application submitted successfully</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  <span className="text-sm text-gray-800 dark:text-gray-200">Currently under admin review</span>
                </div>
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Approval pending</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800/50">
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">Your Application Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div>
                  <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">Business Name</p>
                  <p className="text-blue-900 dark:text-blue-100">{vendor.name}</p>
                </div>
                <div>
                  <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">Business Type</p>
                  <p className="text-blue-900 dark:text-blue-100">{vendor.businessType || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">Email</p>
                  <p className="text-blue-900 dark:text-blue-100">{vendor.email}</p>
                </div>
                <div>
                  <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">Phone</p>
                  <p className="text-blue-900 dark:text-blue-100">{vendor.phone}</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800/50">
              <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-2">What happens next?</h3>
              <div className="text-left space-y-2">
                <p className="text-sm text-green-800 dark:text-green-200 flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  You'll receive an email notification once your application is reviewed
                </p>
                <p className="text-sm text-green-800 dark:text-green-200 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Review typically takes 1-2 business days
                </p>
                <p className="text-sm text-green-800 dark:text-green-200 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Once approved, you'll have access to your vendor dashboard
                </p>
              </div>
            </div>

            <div className="pt-4 space-y-3">
              <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                Need help? Contact our support team
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="outline" asChild className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                  <Link href="mailto:support@grospace.com" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Support
                  </Link>
                </Button>
                <Button variant="outline" asChild className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                  <Link href="tel:+1234567890" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Call Support
                  </Link>
                </Button>
                <Button variant="outline" asChild className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                  <Link href="/">Return to Homepage</Link>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
