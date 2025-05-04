// Helper to get base URL that works in both client and server components
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

export async function forgotPassword(email: string) {
  const baseUrl = getBaseUrl();
  const response = await fetch(`${baseUrl}/api/auth/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    throw new Error("Failed to send reset password email");
  }

  const data = await response.json();
  return data.success;
}
