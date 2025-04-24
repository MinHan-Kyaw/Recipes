import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  try {
    await dbConnect();

    // Get total count of all users
    const totalCount = await User.countDocuments();

    // Get count of unverified users
    const unverifiedCount = await User.countDocuments({ status: "unverified" });
    return NextResponse.json({
      success: true,
      data: {
        totalCount,
        unverifiedCount
      },
    });
  } catch (error) {
    console.error("Error fetching user counts:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch user counts" },
      { status: 400 }
    );
  }
}
