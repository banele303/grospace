import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { prisma } from "@/lib/db";

// Define UserRole enum locally - must match schema
export enum UserRole {
  ADMIN = "ADMIN",
  VENDOR = "VENDOR",
  BUYER = "BUYER"
}

// Define UserStatus enum locally - must match schema
export enum UserStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  BLOCKED = "BLOCKED",
  SUSPENDED = "SUSPENDED"
}

// Define VendorStatus enum locally - must match schema
export enum VendorStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  BLOCKED = "BLOCKED",
  SUSPENDED = "SUSPENDED"
}

export async function getCurrentUser(includeVendor: boolean = false) {
  const { getUser } = getKindeServerSession();
  const kindeUser = await getUser();
  
  if (!kindeUser?.id) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: kindeUser.id },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      profileImage: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
      ...(includeVendor ? {
        vendors: {
          select: {
            id: true,
            name: true,
            email: true,
            approved: true,
            userId: true, // Make sure userId is included
            // Add other vendor fields you need
          }
        }
      } : {})
    }
  });

  // Return user with role data
  if (user) {
    return user as any; // Type assertion needed due to dynamic select
  }
  
  return null;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Authentication required");
  }
  return user;
}

export async function requireRole(role: UserRole) {
  const user = await requireAuth();
  if (user.role !== role) {
    throw new Error(`${role} role required`);
  }
  return user;
}

export async function getVendorStatus() {
  const user = await getCurrentUser(true);
  if (!user) {
    return { success: false, error: "Authentication required", user: null, vendor: null };
  }
  
  if (user.role !== UserRole.VENDOR || !user.vendors || user.vendors.length === 0) {
    return { success: false, error: "Vendor access required", user, vendor: null };
  }

  // Check user account status
  if (!user.isActive) {
    return { success: false, error: "Your account is inactive. Please contact support.", user, vendor: null };
  }

  if (user.accountStatus === UserStatus.PENDING) {
    return { success: false, error: "Your account is pending approval. Please wait for admin approval.", user, vendor: null };
  }

  if (user.accountStatus === UserStatus.BLOCKED) {
    const reason = user.blockedReason ? ` Reason: ${user.blockedReason}` : '';
    return { success: false, error: `Your account has been blocked.${reason}`, user, vendor: null };
  }

  if (user.accountStatus === UserStatus.SUSPENDED) {
    return { success: false, error: "Your account is temporarily suspended. Please contact support.", user, vendor: null };
  }

  // Check vendor status
  const vendor = user.vendors[0];
  if (vendor.vendorStatus === VendorStatus.PENDING || !vendor.approved) {
    return { success: false, error: "pending_approval", user, vendor, isPending: true };
  }

  if (vendor.vendorStatus === VendorStatus.BLOCKED) {
    const reason = vendor.blockedReason ? ` Reason: ${vendor.blockedReason}` : '';
    return { success: false, error: `Your vendor account has been blocked.${reason}`, user, vendor };
  }

  if (vendor.vendorStatus === VendorStatus.SUSPENDED) {
    return { success: false, error: "Your vendor account is temporarily suspended. Please contact support.", user, vendor };
  }
  
  return { success: true, error: null, user, vendor, isPending: false };
}

export async function requireVendor() {
  const user = await getCurrentUser(true);
  if (!user) {
    throw new Error("Authentication required");
  }
  
  if (user.role !== UserRole.VENDOR || !user.vendors || user.vendors.length === 0) {
    throw new Error("Vendor access required");
  }

  // Check user account status
  if (!user.isActive) {
    throw new Error("Your account is inactive. Please contact support.");
  }

  if (user.accountStatus === UserStatus.PENDING) {
    throw new Error("Your account is pending approval. Please wait for admin approval.");
  }

  if (user.accountStatus === UserStatus.BLOCKED) {
    const reason = user.blockedReason ? ` Reason: ${user.blockedReason}` : '';
    throw new Error(`Your account has been blocked.${reason}`);
  }

  if (user.accountStatus === UserStatus.SUSPENDED) {
    throw new Error("Your account is temporarily suspended. Please contact support.");
  }

  // Check vendor status
  const vendor = user.vendors[0];
  if (vendor.vendorStatus === VendorStatus.PENDING || !vendor.approved) {
    throw new Error("Your vendor account is pending approval. Please wait for admin approval.");
  }

  if (vendor.vendorStatus === VendorStatus.BLOCKED) {
    const reason = vendor.blockedReason ? ` Reason: ${vendor.blockedReason}` : '';
    throw new Error(`Your vendor account has been blocked.${reason}`);
  }

  if (vendor.vendorStatus === VendorStatus.SUSPENDED) {
    throw new Error("Your vendor account is temporarily suspended. Please contact support.");
  }
  
  return { user, vendor };
}

export async function requireAdmin() {
  return await requireRole(UserRole.ADMIN);
}

export async function isAdmin(userId?: string) {
  if (!userId) return false;
  
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });
  
  return user?.role === UserRole.ADMIN;
}

export async function isVendor(userId?: string) {
  if (!userId) return false;
  
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true, vendors: true },
  });
  
  return user?.role === UserRole.VENDOR && !!user.vendors && user.vendors.length > 0;
}
