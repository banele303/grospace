'use server';

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updateProfileImage(userId: string, imageUrl: string): Promise<boolean> {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { profileImage: imageUrl }
    });
    
    // Revalidate the profile page to show the updated image
    revalidatePath('/vendor/dashboard/profile');
    return true;
  } catch (error) {
    console.error('Error updating profile image:', error);
    return false;
  }
}
