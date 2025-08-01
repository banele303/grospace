import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  profileImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      const { getUser } = getKindeServerSession();
      const user = await getUser();

      // If you throw, the user will not be able to upload
      if (!user) {
        throw new UploadThingError("Unauthorized - Please login");
      }

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Profile image upload complete for userId:", metadata.userId);
      console.log("file url", file.url);

      // Return the file URL for client-side updating
      return { uploadedBy: metadata.userId, url: file.url };
    }),
    
  // Store cover image endpoint for banner-style store images
  storeCover: f({ image: { maxFileSize: "8MB", maxFileCount: 1 } })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      const { getUser } = getKindeServerSession();
      const user = await getUser();

      // If you throw, the user will not be able to upload
      if (!user) {
        throw new UploadThingError("Unauthorized - Please login");
      }

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Store cover image upload complete for userId:", metadata.userId);
      console.log("file url", file.url);

      // Return the file URL for client-side updating
      return { uploadedBy: metadata.userId, url: file.url };
    }),
    
  imageUploader: f({ image: { maxFileSize: "8MB", maxFileCount: 10 } })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      const { getUser } = getKindeServerSession();
      const user = await getUser();

      // If you throw, the user will not be able to upload
      if (!user) {
        throw new UploadThingError("Unauthorized - Please login");
      }

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);

      console.log("file url", file.url);

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId };
    }),

  bannerImageRoute: f({ image: { maxFileSize: "8MB", maxFileCount: 1 } })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      const { getUser } = getKindeServerSession();
      const user = await getUser();

      // If you throw, the user will not be able to upload
      if (!user) {
        throw new UploadThingError("Unauthorized - Please login");
      }

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);

      console.log("file url", file.url);

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
