import { NextResponse } from "next/server";
import { requireAuth, getAuthUser } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Rating from "@/models/Rating";
import Recipe from "@/models/Recipe";
import mongoose from "mongoose";

export async function POST(request, { params }) {
  try {
    const auth = await requireAuth(request);
    if (!auth.authorized) {
      return auth.response;
    }

    const { session } = auth;
    const recipeId = params.id;
    const { rating } = await request.json();

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Update or create the rating
    await Rating.findOneAndUpdate(
      { recipe: recipeId, user: session.user.id },
      { rating },
      { upsert: true, new: true }
    );

    // Calculate new average
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

    // Update recipe with average rating
    if (ratingStats.length > 0) {
      await Recipe.findByIdAndUpdate(recipeId, {
        averageRating: ratingStats[0].averageRating,
        ratingsCount: ratingStats[0].count,
      });
    }

    return NextResponse.json({
      success: true,
      averageRating: ratingStats[0]?.averageRating || 0,
      ratingsCount: ratingStats[0]?.count || 0,
    });
  } catch (error) {
    console.error("Error processing rating:", error);
    return NextResponse.json(
      { error: "Failed to process rating" },
      { status: 500 }
    );
  }
}

export async function GET(request, { params }) {
  try {
    const recipeId = params.id;
    const session = await getAuthUser(request);
    await dbConnect();

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
      success: true,
      data: {
        averageRating: ratingStats[0]?.averageRating || null,
        ratingsCount: ratingStats[0]?.count || 0,
        userRating,
      }
    });
  } catch (error) {
    console.error("Error fetching ratings:", error);
    return NextResponse.json(
      { error: "Failed to fetch ratings" },
      { status: 500 }
    );
  }
}
