import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

// GET /api/users/[id] - Get a user by ID
export async function GET(request, { params }) {
  try {
    await dbConnect();

    const userId = params.id;

    // Only return necessary fields (exclude password)
    const user = await User.findById(userId).select(
      "name email type avatar -_id"
    );

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

// PUT /api/users/[id] - Update a user
export async function PUT(request, { params }) {
  try {
    await dbConnect();

    const userId = params.id;
    const data = await request.json();

    // Find the user first
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Validate the data
    const { name, email, avatar } = data;

    // If trying to change email, check if it's already in use by another user
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        return NextResponse.json(
          { success: false, error: "Email is already in use" },
          { status: 400 }
        );
      }
    }

    // Update allowed fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (avatar) user.avatar = avatar;

    // Save the updated user
    await user.save();

    // Return the updated user (exclude password)
    const updatedUser = user.toObject();
    delete updatedUser.password;

    return NextResponse.json({
      success: true,
      data: updatedUser,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update user" },
      { status: 400 }
    );
  }
}
