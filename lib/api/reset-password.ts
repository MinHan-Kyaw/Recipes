import exp from "constants";

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

export async function resetPassword(token: string, password: string) {
  const baseUrl = getBaseUrl();
  const response = await fetch(`${baseUrl}/api/auth/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token, password }),
  });

  if (!response.ok) {
    throw new Error("Failed to reset password");
  }

  const data = await response.json();
  return data.success;
}
