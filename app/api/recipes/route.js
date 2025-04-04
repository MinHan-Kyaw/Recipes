import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Recipe from "@/models/Recipe";

// GET /api/recipes - Get all recipes with optional filtering
export async function GET(request) {
  try {
    await dbConnect();

    // Get URL parameters
    const { searchParams } = new URL(request.url);
    const authorId = searchParams.get("authorId");

    // Build query object based on parameters
    const query = {};

    // Filter by author if provided
    if (authorId) {
      query.author = authorId;
    }

    // Find recipes matching the query
    const recipes = await Recipe.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: recipes });
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch recipes" },
      { status: 400 }
    );
  }
}

// POST /api/recipes - Create a new recipe
export async function POST(request) {
  try {
    await dbConnect();

    // Parse the request body
    const body = await request.json();

    // Create a new recipe document
    const recipe = await Recipe.create(body);

    return NextResponse.json({ success: true, data: recipe }, { status: 201 });
  } catch (error) {
    console.error("Error creating recipe:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Something went wrong" },
      { status: 400 }
    );
  }
}
