import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Shop from "@/models/Shop";

// GET /api/shops/[shopId] - Get a single shop by ID
export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { shopId } = params;

    const shop = await Shop.findById(shopId);

    if (!shop) {
      return NextResponse.json(
        { success: false, error: "Shop not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: shop });
  } catch (error) {
    console.error("Error fetching shop:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch shop" },
      { status: 400 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const { shopId } = params;
    const body = await request.json();

    const updatedShop = await Shop.findByIdAndUpdate(
      shopId,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!updatedShop) {
      return NextResponse.json(
        { success: false, error: "Shop not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedShop });
  } catch (error) {
    console.error("Error updating shop:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update shop" },
      { status: 400 }
    );
  }
}

// DELETE /api/shops/[shopId] - Delete a shop
export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const { shopId } = params;

    const deletedShop = await Shop.findByIdAndDelete(shopId);

    if (!deletedShop) {
      return NextResponse.json(
        { success: false, error: "Shop not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    console.error("Error deleting shop:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete shop" },
      { status: 400 }
    );
  }
}
