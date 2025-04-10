import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Recipe from "@/models/Recipe";
import User from "@/models/User";
import Shop from "@/models/Shop";

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const shopId = searchParams.get("shop");
    const limit = parseInt(searchParams.get("limit")) || null;
    const query = {};
    if (shopId) {
      query.shop = shopId;
    }
    let recipeQuery = Recipe.find(query)
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
      .populate("shop", "shopName")
      .lean();

    if (limit) {
      recipeQuery = recipeQuery.limit(limit);
    }
    const recipes = await recipeQuery;

    // Transform the data to match your expected format
    const transformedRecipes = recipes.map((recipe) => {
      return {
        ...recipe,
        authorDetails: {
          name: recipe.author?.name || "Unknown Author",
        },
        // Optionally keep the original author ID
        author: recipe.author?._id || recipe.author,
      };
    });

    return NextResponse.json({
      success: true,
      data: transformedRecipes,
    });
  } catch (error) {
    console.error("Error fetching recipess:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch recipes" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await dbConnect();

    // Parse the request body
    const body = await request.json();

    // Convert author string to ObjectId if it's a string
    if (body.author && typeof body.author === "string") {
      body.author = new mongoose.Types.ObjectId(body.author);
    }

    // Create a new recipe document
    const recipe = await Recipe.create(body);

    const populatedRecipe = await Recipe.findById(recipe._id)
      .populate({
        path: "author",
        model: User,
        select: "name _id",
      })
      .lean();

    // Format the response
    const responseData = populatedRecipe
      ? {
          ...populatedRecipe,
          authorDetails: {
            name: populatedRecipe.author?.name || "Unknown Author",
          },
          author: populatedRecipe.author?._id || populatedRecipe.author,
        }
      : recipe;

    return NextResponse.json(
      { success: true, data: responseData },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating recipe:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Something went wrong" },
      { status: 400 }
    );
  }
}
