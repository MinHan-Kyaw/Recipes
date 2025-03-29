import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Recipe from "@/models/Recipe";

// Create a new recipe
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

// Get all recipes with optional filtering
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

// Update a recipe by ID
export async function PUT(request, { params }) {
  try {
    await dbConnect();

    // Parse the request body
    const body = await request.json();
    const { searchParams } = new URL(request.url);
    const recipeId = searchParams.get("id");

    if (!recipeId) {
      return NextResponse.json(
        { success: false, error: "Recipe ID is required" },
        { status: 400 }
      );
    }

    // Find and update the recipe
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      recipeId,
      { ...body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!updatedRecipe) {
      return NextResponse.json(
        { success: false, error: "Recipe not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedRecipe });
  } catch (error) {
    console.error("Error updating recipe:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Something went wrong" },
      { status: 400 }
    );
  }
}

// Delete a recipe by ID
export async function DELETE(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const recipeId = searchParams.get("id");

    if (!recipeId) {
      return NextResponse.json(
        { success: false, error: "Recipe ID is required" },
        { status: 400 }
      );
    }

    // Find and delete the recipe
    const deletedRecipe = await Recipe.findByIdAndDelete(recipeId);

    if (!deletedRecipe) {
      return NextResponse.json(
        { success: false, error: "Recipe not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Recipe deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting recipe:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete recipe" },
      { status: 400 }
    );
  }
}
