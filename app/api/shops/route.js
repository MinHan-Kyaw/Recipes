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

export async function GET(request) {
  try {
    await dbConnect();

    // Get URL parameters
    const { searchParams } = new URL(request.url);
    const ownerId = searchParams.get("ownerId");
    const isApproved = searchParams.get("isApproved");

    // Build query object based on parameters
    const query = {};

    // Filter by owner if provided
    if (ownerId) {
      query.owner = ownerId;
    }

    // Filter by approval status if provided
    if (isApproved !== null && isApproved !== undefined) {
      query.isApproved = isApproved === "true";
    }

    // Find shops matching the query
    const shops = await Shop.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: shops });
  } catch (error) {
    console.error("Error fetching shops:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch shops" },
      { status: 400 }
    );
  }
}
