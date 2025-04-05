// app/api/users/[userId]/shops/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function PUT(request, { params }) {
  try {
    await dbConnect();

    const userId = params.userId;
    const { shopId } = await request.json();

    // Find user and update by adding shop to their shops array
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { shops: shopId } }, // $addToSet ensures no duplicates
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { shops: updatedUser.shops },
    });
  } catch (error) {
    console.error("Error updating user shops:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();

    const userId = params.userId;
    const { shopId } = await request.json();

    // Find user and update by removing shop from their shops array
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { shops: shopId } },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { shops: updatedUser.shops },
    });
  } catch (error) {
    console.error("Error removing shop from user:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
