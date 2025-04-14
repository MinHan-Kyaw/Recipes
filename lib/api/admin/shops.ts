export const fetchShops = async () => {
  try {
    const response = await fetch("/api/admin/shops", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch shops");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching shops:", error);
    throw error;
  }
};
