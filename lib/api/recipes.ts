import { Recipe } from "../types/recipe";

// Helper to get base URL that works in both client and server components
const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // Check if window is defined (client-side)
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  // Server-side with no env var set
  return "http://localhost:3000";
};

// Create a new recipe
export async function createRecipe(recipeData: Recipe) {
  try {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/recipes`, {
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
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/recipes`, {
      // For server components
      cache: "no-store",
    });

    // Check for HTML response (error page)
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("text/html")) {
      console.error(
        "Received HTML instead of JSON. API endpoint might be returning an error page."
      );
      return [];
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch recipes");
    }

    return data.data;
  } catch (error) {
    console.error("Error fetching recipes:", error);
    // Return empty array instead of throwing to prevent page crashes
    return [];
  }
}

// Get recipes by author ID
export async function getRecipesByAuthor(authorId: string) {
  try {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/recipes/author/${authorId}`, {
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch recipes");
    }

    return data.data;
  } catch (error) {
    console.error("Error fetching recipes by author:", error);
    return [];
  }
}

// Get a single recipe by ID
export async function getRecipeById(recipeId: string) {
  try {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/recipes/${recipeId}`, {
      cache: "no-store",
    });

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
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/recipes/${recipeId}`, {
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
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/recipes/${recipeId}`, {
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

// Fetch user recipes
export async function fetchUserRecipes(userId: string) {
  try {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/recipes/author/${userId}`, {
      cache: "no-store",
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch user recipes");
    }

    return data.data;
  } catch (error) {
    console.error("Error fetching user recipes:", error);
    return [];
  }
}

// Fetch recipes by Id
export async function fetchRecipeById(recipeId: string) {
  try {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/recipes/${recipeId}`, {
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch recipe");
    }
    if (data.data.author) {
      const authorResponse = await fetch(
        `${baseUrl}/api/users/${data.data.author}`,
        {
          cache: "no-store",
        }
      );

      if (authorResponse.ok) {
        const authorData = await authorResponse.json();
        // Add author info to the recipe data
        data.data.authorDetails = authorData.data;
      }
    }

    return data.data;
  } catch (error) {
    console.error("Error fetching recipe by ID:", error);
    throw error;
  }
}
