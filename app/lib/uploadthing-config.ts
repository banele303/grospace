// This file contains the client-side configuration for uploadthing
// It avoids direct imports from server components

// Import safe type from our types file (not the server implementation)
import type { OurFileRouter } from "@/app/api/uploadthing/types";

// Pre-defined endpoints that match your server-side router
// This avoids importing server-side code
export const uploadthingEndpoints = {
  imageUploader: "imageUploader",
  bannerImageRoute: "bannerImageRoute"
} as const;
