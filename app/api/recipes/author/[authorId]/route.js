import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Recipe from "@/models/Recipe";

export async function GET(request, { params }) {
  try {
    await dbConnect();

    const { authorId } = params;

    if (!authorId) {
      return NextResponse.json(
        { success: false, error: "Author ID is required" },
        { status: 400 }
      );
    }

    // Find all recipes by the specified author
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
