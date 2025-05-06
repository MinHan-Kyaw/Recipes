import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Shop from "@/models/Shop";

// POST endpoint to approve a shop
export async function POST(request) {
  try {
    await dbConnect();
    const data = await request.json();
    const { shopId } = data;

    if (!shopId) {
      return NextResponse.json(
        { success: false, error: "Shop ID is required" },
        { status: 400 }
      );
    }

    const approvedShop = await Shop.findByIdAndUpdate(
      shopId,
      { isApproved: true, updatedAt: new Date() },
      { new: true }
    );

    if (!approvedShop) {
      return NextResponse.json(
        { success: false, error: "Shop not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: approvedShop,
      message: "Shop approved successfully",
    });
  } catch (error) {
    console.error("Error approving shop:", error);
    return NextResponse.json(
      { success: false, error: "Failed to approve shop" },
      { status: 500 }
    );
  }
}
