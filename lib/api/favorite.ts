export async function addToFavorites(
  user: string,
  recipe: string,
  note: string
) {
  try {
    const response = await fetch("/api/favorites", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user, recipe, note }),
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to add to favorites");
    }

    return await response.json();
  } catch (error) {
    console.error("Error adding to favorites:", error);
    throw error;
  }
}

export async function removeFromFavorites(user: string, recipe: string) {
  try {
    const response = await fetch("/api/favorites", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user, recipe }),
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to remove from favorites");
    }

    return await response.json();
  } catch (error) {
    console.error("Error removing from favorites:", error);
    throw error;
  }
}

export async function getFavorites(user: string, recipe: string) {
  try {
    const response = await fetch(
      `/api/favorites?user=${user}&recipe=${recipe}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch favorites");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching favorites:", error);
    throw error;
  }
}

export async function getFavoriteRecipes(user: string) {
  try {
    const response = await fetch(`/api/favorites?user=${user}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch favorite recipes");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching favorite recipes:", error);
    throw error;
  }
}
