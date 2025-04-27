import { ActivityLog } from "../types/activitylog";

export async function createActivityLog(activityLog: ActivityLog) {
  try {
    const response = await fetch("/api/activitylog", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        activityLog,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to create activity log");
    }

    return data;
  } catch (error) {
    console.error("Error creating activity log:", error);
    throw error;
  }
}
