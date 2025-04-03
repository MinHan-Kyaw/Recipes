import { User } from "../types/user";

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

    return data;
  } catch (error) {
    console.error("Error signing up:", error);
    throw error;
  }
}
