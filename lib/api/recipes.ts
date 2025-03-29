import { Recipe } from "../types/recipe";

// Create a new recipe
export async function createRecipe(recipeData: Recipe) {
  try {
    const response = await fetch("/api/recipes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(recipeData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to create recipe");
    }

    return data;
  } catch (error) {
    console.error("Error creating recipe:", error);
    throw error;
  }
}

// Get all recipes
export async function getAllRecipes() {
  try {
    const response = await fetch("/api/recipes");
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch recipes");
    }

    return data.data;
  } catch (error) {
    console.error("Error fetching recipes:", error);
    throw error;
  }
}

// Get recipes by author ID
export async function getRecipesByAuthor(authorId: string) {
  try {
    const response = await fetch(`/api/recipes/author/${authorId}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch recipes");
    }

    return data.data;
  } catch (error) {
    console.error("Error fetching recipes by author:", error);
    throw error;
  }
}

// Get a single recipe by ID
export async function getRecipeById(recipeId: string) {
  try {
    const response = await fetch(`/api/recipes/${recipeId}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch recipe");
    }

    return data.data;
  } catch (error) {
    console.error("Error fetching recipe:", error);
    throw error;
  }
}

// Update a recipe
export async function updateRecipe(recipeId: string, recipeData: Recipe) {
  try {
    const response = await fetch(`/api/recipes?id=${recipeId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(recipeData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to update recipe");
    }

    return data;
  } catch (error) {
    console.error("Error updating recipe:", error);
    throw error;
  }
}

// Delete a recipe
export async function deleteRecipe(recipeId: string) {
  try {
    const response = await fetch(`/api/recipes?id=${recipeId}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to delete recipe");
    }

    return data;
  } catch (error) {
    console.error("Error deleting recipe:", error);
    throw error;
  }
}
