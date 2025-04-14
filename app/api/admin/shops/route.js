import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Shop from "@/models/Shop";

export async function GET(request) {
  try {
    await dbConnect();

    const shops = await Shop.find().sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: shops });
  } catch (error) {
    console.error("Error fetching shops:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch shops" },
      { status: 400 }
    );
  }
}
