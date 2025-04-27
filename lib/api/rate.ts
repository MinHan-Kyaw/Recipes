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

export async function addRating(
  recipeId: string,
  rating: number,
  userId: string
) {
  try {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/recipes/${recipeId}/rate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ recipeId, rating, userId }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to add rating");
    }

    return data;
  } catch (error) {
    console.error("Error adding rating:", error);
    throw error;
  }
}

export async function getRatings(recipeId: string) {
  try {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/recipes/${recipeId}/rate`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch ratings");
    }

    return data;
  } catch (error) {
    console.error("Error fetching ratings:", error);
    throw error;
  }
}
