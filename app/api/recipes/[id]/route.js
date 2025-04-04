import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Recipe from "@/models/Recipe";

// GET /api/recipes/[id] - Get a recipe by ID
export async function GET(request, { params }) {
  try {
    await dbConnect();

    const recipeId = params.id;

    const recipe = await Recipe.findById(recipeId);

    if (!recipe) {
      return NextResponse.json(
        { success: false, error: "Recipe not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: recipe });
  } catch (error) {
    console.error("Error fetching recipe:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch recipe" },
      { status: 400 }
    );
  }
}

// PUT /api/recipes/[id] - Update a recipe by ID
export async function PUT(request, { params }) {
  try {
    await dbConnect();

    // Parse the request body
    const body = await request.json();
    const recipeId = params.id;

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

// DELETE /api/recipes/[id] - Delete a recipe by ID
export async function DELETE(request, { params }) {
  try {
    await dbConnect();

    const recipeId = params.id;

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
