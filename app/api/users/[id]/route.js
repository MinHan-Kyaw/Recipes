import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

// GET /api/users/[id] - Get a user by ID
export async function GET(request, { params }) {
  try {
    await dbConnect();

    const userId = params.id;

    // Only return necessary fields (exclude password)
    const user = await User.findById(userId).select("name email type -_id");

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch user" },
      { status: 400 }
    );
  }
}
