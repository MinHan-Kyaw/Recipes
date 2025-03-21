import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Shop from "@/models/Shop";

export async function POST(request) {
  try {
    await dbConnect();

    // Parse the request body
    const body = await request.json();

    // Create a new shop document
    const shop = await Shop.create(body);

    return NextResponse.json({ success: true, data: shop }, { status: 201 });
  } catch (error) {
    console.error("Error creating shop:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Something went wrong" },
      { status: 400 }
    );
  }
}

export async function GET() {
  try {
    await dbConnect();

    // Find all approved shops
    const shops = await Shop.find({ isApproved: true });

    return NextResponse.json({ success: true, data: shops });
  } catch (error) {
    console.error("Error fetching shops:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch shops" },
      { status: 400 }
    );
  }
}
