import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Shop from "@/models/Shop";

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const shopId = searchParams.get("shopId");

    const query = {};

    // Filter by owner if provided
    if (shopId) {
      query._id = shopId;
    }

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

// PUT endpoint to update a shop
export async function PUT(request) {
  try {
    await dbConnect();
    const data = await request.json();
    const { shopId, shopData, userId } = data;

    if (!shopId) {
      return NextResponse.json(
        { success: false, error: "Shop ID is required" },
        { status: 400 }
      );
    }

    // Find the shop by ID and update
    const updatedShop = await Shop.findByIdAndUpdate(
      shopId,
      { ...shopData, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!updatedShop) {
      return NextResponse.json(
        { success: false, error: "Shop not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedShop,
      message: "Shop updated successfully",
    });
  } catch (error) {
    console.error("Error updating shop:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update shop" },
      { status: 500 }
    );
  }
}

// DELETE endpoint to delete a shop
export async function DELETE(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const shopId = searchParams.get("shopId");

    if (!shopId) {
      return NextResponse.json(
        { success: false, error: "Shop ID is required" },
        { status: 400 }
      );
    }

    // Find the shop by ID and delete
    const deletedShop = await Shop.findByIdAndDelete(shopId);

    if (!deletedShop) {
      return NextResponse.json(
        { success: false, error: "Shop not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Shop deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting shop:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete shop" },
      { status: 500 }
    );
  }
}
