"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

// Address Management Actions
export async function createAddress(formData: FormData) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
      return { success: false, error: "Please sign in" };
    }

    const type = formData.get("type") as string;
    const label = formData.get("label") as string;
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const company = formData.get("company") as string;
    const addressLine1 = formData.get("addressLine1") as string;
    const addressLine2 = formData.get("addressLine2") as string;
    const city = formData.get("city") as string;
    const state = formData.get("state") as string;
    const postalCode = formData.get("postalCode") as string;
    const country = formData.get("country") as string;
    const phone = formData.get("phone") as string;
    const isDefault = formData.get("isDefault") === "on";

    // Validate required fields
    if (!label || !firstName || !lastName || !addressLine1 || !city || !state || !postalCode || !country) {
      return { success: false, error: "Please fill in all required fields" };
    }

    // If this is set as default, unset other default addresses
    if (isDefault) {
      await prisma.address.updateMany({
        where: { 
          userId: user.id,
          isDefault: true 
        },
        data: { isDefault: false }
      });
    }

    // Create the new address
    await prisma.address.create({
      data: {
        type: (type as any) || 'OTHER',
        label: label.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        company: company ? company.trim() : null,
        addressLine1: addressLine1.trim(),
        addressLine2: addressLine2 ? addressLine2.trim() : null,
        city: city.trim(),
        state: state.trim(),
        postalCode: postalCode.trim(),
        country: country.trim(),
        phone: phone ? phone.trim() : null,
        isDefault,
        userId: user.id,
      },
    });

    revalidatePath("/dashboard/addresses");
    return { success: true, message: "Address created successfully" };

  } catch (error) {
    console.error("Error creating address:", error);
    return { success: false, error: "Failed to create address" };
  }
}

export async function updateAddress(addressId: string, formData: FormData) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
      return { success: false, error: "Please sign in" };
    }

    // Verify ownership
    const existingAddress = await prisma.address.findFirst({
      where: { id: addressId, userId: user.id }
    });

    if (!existingAddress) {
      return { success: false, error: "Address not found" };
    }

    const type = formData.get("type") as string;
    const label = formData.get("label") as string;
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const company = formData.get("company") as string;
    const addressLine1 = formData.get("addressLine1") as string;
    const addressLine2 = formData.get("addressLine2") as string;
    const city = formData.get("city") as string;
    const state = formData.get("state") as string;
    const postalCode = formData.get("postalCode") as string;
    const country = formData.get("country") as string;
    const phone = formData.get("phone") as string;
    const isDefault = formData.get("isDefault") === "on";

    // If this is set as default, unset other default addresses
    if (isDefault && !existingAddress.isDefault) {
      await prisma.address.updateMany({
        where: { 
          userId: user.id,
          isDefault: true,
          id: { not: addressId }
        },
        data: { isDefault: false }
      });
    }

    // Update the address
    await prisma.address.update({
      where: { id: addressId },
      data: {
        type: (type as any) || 'OTHER',
        label: label.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        company: company ? company.trim() : null,
        addressLine1: addressLine1.trim(),
        addressLine2: addressLine2 ? addressLine2.trim() : null,
        city: city.trim(),
        state: state.trim(),
        postalCode: postalCode.trim(),
        country: country.trim(),
        phone: phone ? phone.trim() : null,
        isDefault,
      },
    });

    revalidatePath("/dashboard/addresses");
    return { success: true, message: "Address updated successfully" };

  } catch (error) {
    console.error("Error updating address:", error);
    return { success: false, error: "Failed to update address" };
  }
}

export async function deleteAddress(addressId: string) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
      return { success: false, error: "Please sign in" };
    }

    // Verify ownership
    const existingAddress = await prisma.address.findFirst({
      where: { id: addressId, userId: user.id }
    });

    if (!existingAddress) {
      return { success: false, error: "Address not found" };
    }

    // Delete the address
    await prisma.address.delete({
      where: { id: addressId }
    });

    revalidatePath("/dashboard/addresses");
    return { success: true, message: "Address deleted successfully" };

  } catch (error) {
    console.error("Error deleting address:", error);
    return { success: false, error: "Failed to delete address" };
  }
}

export async function setDefaultAddress(addressId: string) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
      return { success: false, error: "Please sign in" };
    }

    // Verify ownership
    const existingAddress = await prisma.address.findFirst({
      where: { id: addressId, userId: user.id }
    });

    if (!existingAddress) {
      return { success: false, error: "Address not found" };
    }

    // Unset other default addresses
    await prisma.address.updateMany({
      where: { 
        userId: user.id,
        isDefault: true 
      },
      data: { isDefault: false }
    });

    // Set this address as default
    await prisma.address.update({
      where: { id: addressId },
      data: { isDefault: true }
    });

    revalidatePath("/dashboard/addresses");
    return { success: true, message: "Default address updated" };

  } catch (error) {
    console.error("Error setting default address:", error);
    return { success: false, error: "Failed to set default address" };
  }
}
