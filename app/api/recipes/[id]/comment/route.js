import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Comment from "@/models/Comment";

export async function POST(request, { params }) {
  try {
    const auth = await requireAuth(request);
    if (!auth.authorized) {
      return auth.response;
    }

    const { session } = auth;
    const recipeId = params.id;
    const { text } = await request.json();

    if (!text || text.trim() === "") {
      return NextResponse.json(
        { error: "Comment text is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Create the comment
    const newComment = await Comment.create({
      recipe: recipeId,
      user: session.user.id,
      text: text.trim(),
    });

    // Populate user info for the response
    const populatedComment = await Comment.findById(newComment._id)
      .populate("user", "name image")
      .lean();

    return NextResponse.json(populatedComment);
  } catch (error) {
    console.error("Error processing comment:", error);
    return NextResponse.json(
      { error: "Failed to process comment" },
      { status: 500 }
    );
  }
}

export async function GET(request, { params }) {
  try {
    const recipeId = params.id;
    await dbConnect();

    // Fetch comments for the recipe
    const comments = await Comment.find({ recipe: recipeId })
      .sort({ createdAt: -1 })
      .populate("user", "name image")
      .lean();

    return NextResponse.json({ success: true, data: comments });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}
