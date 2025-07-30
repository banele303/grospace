import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// TODO: Replace with real authentication and vendor lookup
const MOCK_VENDOR_ID = "mock-vendor-id";

export async function GET(req: NextRequest) {
  // In production, get vendor ID from auth/session
  try {
    const vendor = await prisma.vendor.findUnique({ where: { id: MOCK_VENDOR_ID } });
    if (!vendor) return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
    return NextResponse.json({ vendor });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch vendor profile" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  // In production, get vendor ID from auth/session
  try {
    const { name, phone, address, bio, logo } = await req.json();
    const vendor = await prisma.vendor.update({
      where: { id: MOCK_VENDOR_ID },
      data: { name, phone, address, bio, logo },
    });
    return NextResponse.json({ vendor });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update vendor profile" }, { status: 500 });
  }
} 