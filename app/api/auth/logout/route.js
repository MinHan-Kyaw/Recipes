// app/api/auth/logout/route.js
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });

    // Clear cookies
    response.cookies.set("token", "", {
      httpOnly: true,
      expires: new Date(0),
      path: "/",
    });

    response.cookies.set("isLoggedIn", "", {
      httpOnly: false,
      expires: new Date(0),
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Error logging out:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Something went wrong" },
      { status: 400 }
    );
  }
}
