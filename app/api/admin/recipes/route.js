import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Recipe from "@/models/Recipe";
import User from "@/models/User";
import Shop from "@/models/Shop";

export async function GET() {
  try {
    await dbConnect();
    const query = {};

    // Add await here to execute the query
    let recipes = await Recipe.find(query)
      .sort({ createdAt: -1 })
      .populate({
        path: "author",
        model: User,
        select: "name _id",
      })
      .populate({
        path: "shop",
        model: Shop,
        select: "shopName",
      })
      .lean();

    const transformedRecipes = recipes.map((recipe) => {
      return {
        ...recipe,
        authorDetails: {
          name: recipe.author?.name || "Unknown Author",
        },
        author: recipe.author?._id || recipe.author,
      };
    });

    return NextResponse.json({
      success: true,
      data: transformedRecipes,
    });
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch recipes" },
      { status: 500 }
    );
  }
}
