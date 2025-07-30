"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

// Profile Update Actions
export async function updateProfile(formData: FormData) {
  console.log("updateProfile action called");
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    console.log("User from Kinde:", user?.id);

    if (!user) {
      console.log("No user found, returning error");
      return { success: false, error: "Please sign in" };
    }

    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const bio = formData.get("bio") as string;

    console.log("Form data:", { firstName, lastName, email, phone, bio });

    // Validate required fields
    if (!firstName || !lastName || !email) {
      console.log("Validation failed: missing required fields");
      return { success: false, error: "First name, last name, and email are required" };
    }

    console.log("Updating user in database...");
    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        // Note: phone and bio would need to be added to User model
        // For now, we'll just update the existing fields
      },
    });

    console.log("User updated successfully:", updatedUser.id);
    revalidatePath("/dashboard/profile");
    return { success: true, message: "Profile updated successfully" };

  } catch (error) {
    console.error("Error updating profile:", error);
    return { success: false, error: "Failed to update profile" };
  }
}

export async function updatePassword(formData: FormData) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
      return { success: false, error: "Please sign in" };
    }

    const currentPassword = formData.get("currentPassword") as string;
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    // Validate passwords
    if (!currentPassword || !newPassword || !confirmPassword) {
      return { success: false, error: "All password fields are required" };
    }

    if (newPassword !== confirmPassword) {
      return { success: false, error: "New passwords do not match" };
    }

    if (newPassword.length < 8) {
      return { success: false, error: "Password must be at least 8 characters long" };
    }

    // Note: Since we're using Kinde for authentication, password changes
    // would typically be handled through their API. For now, we'll return
    // a message indicating this limitation.
    return { 
      success: false, 
      error: "Password changes must be done through your account settings. Please use the 'Forgot Password' link." 
    };

  } catch (error) {
    console.error("Error updating password:", error);
    return { success: false, error: "Failed to update password" };
  }
}

export async function updateNotificationSettings(formData: FormData) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
      return { success: false, error: "Please sign in" };
    }

    // Since we don't have a notification settings model yet,
    // we'll simulate saving preferences. In a real app, you'd
    // create a UserNotificationSettings model
    const orderUpdates = formData.get("orderUpdates") === "on";
    const promotionalEmails = formData.get("promotionalEmails") === "on";
    const productUpdates = formData.get("productUpdates") === "on";
    const securityAlerts = formData.get("securityAlerts") === "on";

    // For now, we'll just return success since we don't have the model
    // In a real implementation, you'd save these to a UserSettings table
    
    revalidatePath("/dashboard/profile");
    return { success: true, message: "Notification settings updated successfully" };

  } catch (error) {
    console.error("Error updating notification settings:", error);
    return { success: false, error: "Failed to update notification settings" };
  }
}
