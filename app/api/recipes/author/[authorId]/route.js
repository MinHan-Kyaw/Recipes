import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Recipe from "@/models/Recipe";
import User from "@/models/User";
import mongoose from "mongoose";

export async function GET(request, { params }) {
  try {
    await dbConnect();

    const authorId = params.authorId;
    const objectIdAuthor = new mongoose.Types.ObjectId(authorId);
    const recipes = await Recipe.find({ author: objectIdAuthor })
      .sort({ createdAt: -1 })
      .lean();

    // Get author details
    const authorUser = await User.findById(authorId).select("name _id").lean();

    // Add author details to each recipe
    const transformedRecipes = recipes.map((recipe) => {
      return {
        ...recipe,
        authorDetails: {
          name: authorUser?.name || "Unknown Author",
        },
        // Keep the original author ID
        author: authorId,
      };
    });

    return NextResponse.json({
      success: true,
      data: transformedRecipes,
    });
  } catch (error) {
    console.error("Error fetching recipes by author:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch recipes" },
      { status: 500 }
    );
  }
}
