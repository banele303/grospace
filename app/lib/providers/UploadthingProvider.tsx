"use client";

// Simple wrapper component to provide a namespace for uploadthing
// Without requiring any server-side imports
export default function UploadthingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Just pass through children - the actual components are imported directly
  // in the components that need them through app/lib/uploadthing.ts
  return <>{children}</>;
}
