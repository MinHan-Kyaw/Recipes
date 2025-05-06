import { ActivityLog } from "../types/activitylog";

export async function createActivityLog(
  user: string,
  userName: string,
  actionType: string,
  detail: string,
  entityType: string,
  entityName: string,
  entityId: string
) {
  try {
    const response = await fetch("/api/log", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user,
        userName,
        actionType,
        detail,
        entityType,
        entityName,
        entityId,
      }),
    });

    const data = await response.json();
    console.log("Activity log response:", data);

    if (!response.ok) {
      throw new Error(data.error || "Failed to create activity log");
    }

    return data;
  } catch (error) {
    console.error("Error creating activity log:", error);
    throw error;
  }
}
