'use client';

// Central configuration for admin email
// Make sure to update this with YOUR actual admin email!
export const ADMIN_EMAIL = "alexsouthflow3@gmail.com";

// Checks if a given email is an admin email
export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
}
