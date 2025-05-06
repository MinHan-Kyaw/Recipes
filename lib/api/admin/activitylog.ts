export default async function fetchActivityLogs(
  entityType: "user" | "shop" | "recipe" | null = null,
  limit = 5
) {
  try {
    let url = "/api/admin/logs";

    // Add query parameters if provided
    const params = new URLSearchParams();
    if (entityType) params.append("entityType", entityType);
    if (limit) params.append("limit", limit.toString());

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Error fetching activity logs: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching activity logs:", error);
    throw error;
  }
}
