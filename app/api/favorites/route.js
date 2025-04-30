import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Favorite from "@/models/Favorite";
import { requireAuth } from "@/lib/auth";
import Recipe from "@/models/Recipe";

export async function POST(request) {
  try {
    const auth = await requireAuth(request);
    if (!auth.authorized) {
      return auth.response;
    }
    await dbConnect();

    const body = await request.json();
    const { user, recipe, notes } = body;

    // Check if the favorite already exists
    const existingFavorite = await Favorite.findOne({ user, recipe });
    if (existingFavorite) {
      return NextResponse.json(
        { success: false, error: "Favorite already exists" },
        { status: 400 }
      );
    }
    const favorite = await Favorite.create({ user, recipe, notes });

    return NextResponse.json(
      { success: true, data: favorite },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating favorite:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Something went wrong" },
      { status: 400 }
    );
  }
}

export async function DELETE(request) {
  try {
    const auth = await requireAuth(request);
    if (!auth.authorized) {
      return auth.response;
    }
    await dbConnect();

    const body = await request.json();
    const { user, recipe } = body;

    const existingFavorite = await Favorite.findOne({ user, recipe });
    if (!existingFavorite) {
      return NextResponse.json(
        { success: false, error: "Favorite not found" },
        { status: 404 }
      );
    }

    await Favorite.deleteOne({ user, recipe });

    return NextResponse.json(
      { success: true, message: "Favorite deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting favorite:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Something went wrong" },
      { status: 400 }
    );
  }
}

export async function GET(request) {
  try {
    const auth = await requireAuth(request);
    if (!auth.authorized) {
      return auth.response;
    }

    const { searchParams } = new URL(request.url);
    const user = searchParams.get("user");

    if (!user) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Find all favorites for the user and populate recipe details
    const favorites = await Favorite.find({ user })
      .populate({
        path: "recipe",
        model: Recipe,
        populate: {
          path: "author",
          model: "User",
          select: "name image",
        },
      })
      .sort({ addedAt: -1 });

    const recipes = favorites.map((favorite) => {
      const recipe = favorite.recipe.toObject();

      return {
        ...recipe,
        authorDetails: recipe.author,
      };
    });

    return NextResponse.json(recipes);
  } catch (error) {
    console.error("Error fetching favorite recipes:", error);
    return NextResponse.json(
      { error: "Failed to fetch favorite recipes" },
      { status: 500 }
    );
  }
}
