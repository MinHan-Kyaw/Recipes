import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import ActivityLog from "@/models/ActivityLog";

export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();
    const {
      user,
      userName,
      actionType,
      entityType,
      entityId,
      entityName,
      detail
    } = body;

    // Validate required fields
    if (!user || !actionType || !entityType || !entityId || !entityName) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create a new activity log entry
    const activityLog = await ActivityLog.create({
      user,
      userName,
      actionType,
      entityType,
      entityId,
      entityName,
      detail
    });

    return NextResponse.json(
      { success: true, data: activityLog },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating activity log:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Something went wrong" },
      { status: 400 }
    );
  }
}
