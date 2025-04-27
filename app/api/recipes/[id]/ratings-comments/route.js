import {  NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Rating from "@/models/Rating";
import Comment from "@/models/Comment";
import mongoose from "mongoose";

export async function POST(request, { params }) {
  try {
    const recipeId = params.id;
    const session = await getAuthUser(request);
    await dbConnect();

    // Get comments
    const comments = await Comment.find({ recipe: recipeId })
      .sort({ createdAt: -1 })
      .populate("user", "name image")
      .lean();

    // Get average rating
    const ratingStats = await Rating.aggregate([
      { $match: { recipe: new mongoose.Types.ObjectId(recipeId) } },
      {
        $group: {
          _id: "$recipe",
          averageRating: { $avg: "$rating" },
          count: { $sum: 1 },
        },
      },
    ]);

    // Get user's rating if logged in
    let userRating = null;
    if (session?.user?.id) {
      const userRatingDoc = await Rating.findOne({
        recipe: recipeId,
        user: session.user.id,
      }).lean();

      if (userRatingDoc) {
        userRating = userRatingDoc.rating;
      }
    }

    return NextResponse.json({
      comments,
      averageRating: ratingStats[0]?.averageRating || null,
      ratingsCount: ratingStats[0]?.count || 0,
      userRating,
    });
  } catch (error) {
    console.error("Error fetching ratings and comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch ratings and comments" },
      { status: 500 }
    );
  }
}
