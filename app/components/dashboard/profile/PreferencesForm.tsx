"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export function PreferencesForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [preferences, setPreferences] = useState({
    language: "en-US",
    currency: "USD",
    timezone: "UTC-5",
  });

  async function handleSubmit() {
    setIsLoading(true);
    try {
      // Simulate saving preferences
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Preferences updated successfully");
    } catch (error) {
      toast.error("Failed to update preferences");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="font-medium">Language</p>
            <p className="text-sm text-muted-foreground">
              Choose your preferred language
            </p>
          </div>
          <Select 
            value={preferences.language} 
            onValueChange={(value) => setPreferences(prev => ({ ...prev, language: value }))}
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en-US">English (US)</SelectItem>
              <SelectItem value="en-GB">English (UK)</SelectItem>
              <SelectItem value="es">Spanish</SelectItem>
              <SelectItem value="fr">French</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="font-medium">Currency</p>
            <p className="text-sm text-muted-foreground">
              Your preferred currency for pricing
            </p>
          </div>
          <Select 
            value={preferences.currency} 
            onValueChange={(value) => setPreferences(prev => ({ ...prev, currency: value }))}
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD ($)</SelectItem>
              <SelectItem value="EUR">EUR (€)</SelectItem>
              <SelectItem value="GBP">GBP (£)</SelectItem>
              <SelectItem value="CAD">CAD (C$)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="font-medium">Time Zone</p>
            <p className="text-sm text-muted-foreground">
              Your local time zone
            </p>
          </div>
          <Select 
            value={preferences.timezone} 
            onValueChange={(value) => setPreferences(prev => ({ ...prev, timezone: value }))}
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="UTC-5">UTC-5 (Eastern)</SelectItem>
              <SelectItem value="UTC-6">UTC-6 (Central)</SelectItem>
              <SelectItem value="UTC-7">UTC-7 (Mountain)</SelectItem>
              <SelectItem value="UTC-8">UTC-8 (Pacific)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Preferences"}
        </Button>
      </div>
    </div>
  );
}
