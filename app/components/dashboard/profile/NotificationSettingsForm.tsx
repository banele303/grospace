"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { updateNotificationSettings } from "@/app/lib/profile-actions";
import { toast } from "sonner";

export function NotificationSettingsForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState({
    orderUpdates: true,
    promotionalEmails: false,
    productUpdates: true,
    securityAlerts: true,
  });

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    try {
      const result = await updateNotificationSettings(formData);
      
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      console.error("Notification settings update error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="orderUpdates">Order Updates</Label>
            <p className="text-sm text-muted-foreground">
              Get notified about your order status
            </p>
          </div>
          <Switch
            id="orderUpdates"
            name="orderUpdates"
            checked={settings.orderUpdates}
            onCheckedChange={(checked) => 
              setSettings(prev => ({ ...prev, orderUpdates: checked }))
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="promotionalEmails">Promotional Emails</Label>
            <p className="text-sm text-muted-foreground">
              Receive offers and promotions
            </p>
          </div>
          <Switch
            id="promotionalEmails"
            name="promotionalEmails"
            checked={settings.promotionalEmails}
            onCheckedChange={(checked) => 
              setSettings(prev => ({ ...prev, promotionalEmails: checked }))
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="productUpdates">Product Updates</Label>
            <p className="text-sm text-muted-foreground">
              New products and recommendations
            </p>
          </div>
          <Switch
            id="productUpdates"
            name="productUpdates"
            checked={settings.productUpdates}
            onCheckedChange={(checked) => 
              setSettings(prev => ({ ...prev, productUpdates: checked }))
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="securityAlerts">Security Alerts</Label>
            <p className="text-sm text-muted-foreground">
              Account security notifications
            </p>
          </div>
          <Switch
            id="securityAlerts"
            name="securityAlerts"
            checked={settings.securityAlerts}
            onCheckedChange={(checked) => 
              setSettings(prev => ({ ...prev, securityAlerts: checked }))
            }
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </form>
  );
}
