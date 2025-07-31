'use client'

import { useEffect, useState } from "react";
import { useAuthState } from "./useAuthState";

interface VendorData {
  id: string;
  approved: boolean;
  name: string;
  email: string;
  businessType: string;
}

interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  vendor: VendorData | null;
}

export function useVendorStatus() {
  const [vendorData, setVendorData] = useState<VendorData | null>(null);
  const [isVendor, setIsVendor] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated, isLoading: authLoading } = useAuthState();

  useEffect(() => {
    if (!authLoading && isAuthenticated && user) {
      fetch('/api/user/profile')
        .then(res => res.json())
        .then((data: UserProfile) => {
          if (data.vendor) {
            setVendorData(data.vendor);
            setIsVendor(true);
          } else {
            setVendorData(null);
            setIsVendor(false);
          }
          setLoading(false);
        })
        .catch(err => {
          console.error("Error fetching vendor status:", err);
          setVendorData(null);
          setIsVendor(false);
          setLoading(false);
        });
    } else if (!authLoading && !isAuthenticated) {
      // Not authenticated, reset vendor status
      setVendorData(null);
      setIsVendor(false);
      setLoading(false);
    }
  }, [user, isAuthenticated, authLoading]);

  return {
    vendorData,
    isVendor,
    loading: loading || authLoading
  };
}
