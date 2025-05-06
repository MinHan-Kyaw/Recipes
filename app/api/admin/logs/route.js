import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import ActivityLog from "@/models/ActivityLog";

export async function GET(request) {
  try {
    await dbConnect();

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const entityType = searchParams.get("entityType");
    const limit = parseInt(searchParams.get("limit") || "10");

    // Build query based on filters
    const query = {};
    if (entityType) query.entityType = entityType;

    // Fetch activity logs
    const logs = await ActivityLog.find(query)
      .sort({ timestamp: -1 })
      .limit(limit);

    return NextResponse.json({ success: true, data: logs }, { status: 200 });
  } catch (error) {
    console.error("Error fetching activity logs:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
