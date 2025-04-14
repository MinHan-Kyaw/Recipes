export const fetchRecipeCounts = async (shopIds: string) => {
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
