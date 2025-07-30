"use client";

// This file contains only client-safe code related to auth
// No server imports are allowed here

// Safe type definitions for use in client components
export type VendorWithUser = {
  id: string;
  name: string;
  userId: string;
  approved: boolean;
  // Add other vendor fields as needed
};

export type ClientUser = {
  id: string;
  role: string;
  vendor?: VendorWithUser | null;
  // Add other user fields needed on the client
};

// Simple client functions
export function isClientVendor(user?: ClientUser | null): boolean {
  return !!user?.role && user.role === 'VENDOR' && !!user?.vendor;
}

export function isClientAdmin(user?: ClientUser | null): boolean {
  return !!user?.role && user.role === 'ADMIN';
}
