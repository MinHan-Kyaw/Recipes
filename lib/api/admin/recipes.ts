export const fetchRecipeCountsWithShop = async (shopIds: string) => {
  try {
    const response = await fetch("/api/admin/recipes/count", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ shopIds }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch recipe counts");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching recipe counts:", error);
    throw error;
  }
};

export const fetchAllRecipeAdmin = async () => {
  try {
    const response = await fetch("/api/admin/recipes", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch all recipes");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching all recipes:", error);
    throw error;
  }
};

export const fetchRecipeCounts = async () => {
  try {
    const response = await fetch("/api/admin/recipes/count", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch recipe counts");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching recipe counts:", error);
    throw error;
  }
};
