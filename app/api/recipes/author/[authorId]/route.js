import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Recipe from "@/models/Recipe";

// GET /api/recipes/author/[authorId] - Get recipes by author ID
export async function GET(request, { params }) {
  try {
    await dbConnect();

    const authorId = params.authorId;

    const recipes = await Recipe.find({ author: authorId }).sort({
      createdAt: -1,
    });

    return NextResponse.json({ success: true, data: recipes });
  } catch (error) {
    console.error("Error fetching recipes by author:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch recipes" },
      { status: 400 }
    );
  }
}
