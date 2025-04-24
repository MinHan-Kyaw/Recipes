import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Shop from "@/models/Shop";

export async function GET() {
  try {
    await dbConnect();

    // Get total count of all users
    const totalCount = await Shop.countDocuments();

    // Get count of notApproved shops
    const notApprovedCount = await Shop.countDocuments({ isApproved: false });
    return NextResponse.json({
      success: true,
      data: {
        totalCount,
        notApprovedCount
      },
    });
  } catch (error) {
    console.error("Error fetching shop counts:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch shop counts" },
      { status: 400 }
    );
  }
}
