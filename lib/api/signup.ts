import { User } from "../types/user";
import { createActivityLog } from "./activitylog";

export async function signupUser(userData: User) {
  try {
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response) {
      throw new Error(data.error || "Failed to sign up");
    }
    if (data.success) {
      await createActivityLog(
        data.data._id,
        userData.name,
        "register",
        "New user registration",
        "user",
        userData.name + " registered",
        data.data._id
      );
    }

    return data;
  } catch (error) {
    console.error("Error signing up:", error);
    throw error;
  }
}
