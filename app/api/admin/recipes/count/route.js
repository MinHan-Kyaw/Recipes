import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Recipe from "@/models/Recipe";
import mongoose from "mongoose";

export async function POST(request) {
  try {
    await dbConnect();

    // Get shop IDs from request body
    const { shopIds } = await request.json();

    // Validate shopIds
    if (!shopIds || !Array.isArray(shopIds) || shopIds.length === 0) {
      return NextResponse.json(
        { success: false, error: "Invalid shop IDs provided" },
        { status: 400 }
      );
    }

    // Convert string IDs to ObjectIds
    const objectIds = shopIds
      .map((id) => {
        try {
          return new mongoose.Types.ObjectId(id);
        } catch (error) {
          console.error(`Invalid shop ID format: ${id}`);
          return null;
        }
      })
      .filter((id) => id !== null);

    // Aggregate to count recipes per shop
    const recipeCounts = await Recipe.aggregate([
      {
        $match: {
          shop: { $in: objectIds },
        },
      },
      {
        $group: {
          _id: "$shop",
          count: { $sum: 1 },
        },
      },
    ]);

    // Format the response to be easily usable by the frontend
    const formattedCounts = {};
    recipeCounts.forEach((item) => {
      formattedCounts[item._id.toString()] = item.count;
    });

    // For any shops with no recipes, ensure they have a count of 0
    shopIds.forEach((shopId) => {
      if (!formattedCounts[shopId]) {
        formattedCounts[shopId] = 0;
      }
    });

    return NextResponse.json({
      success: true,
      data: formattedCounts,
    });
  } catch (error) {
    console.error("Error fetching recipe counts:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch recipe counts" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await dbConnect();

    // Get total count of all recipes
    const totalCount = await Recipe.countDocuments();

    // Get count of recipes created today
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to beginning of today

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1); // Set to beginning of tomorrow

    const todayCreatedCount = await Recipe.countDocuments({
      createdAt: {
        $gte: today,
        $lt: tomorrow,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        totalCount,
        todayCreatedCount,
      },
    });
  } catch (error) {
    console.error("Error fetching recipe counts:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch recipe counts" },
      { status: 500 }
    );
  }
}
