import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import crypto from "crypto";
import { sendEmail } from "@/lib/email";

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Find the user by email
    const user = await User.findOne({ email });

    // Even if we don't find a user, return a success response for security
    // This prevents user enumeration attacks
    if (!user) {
      return NextResponse.json(
        {
          success: true,
          message: "If that email exists, a reset link has been sent",
        },
        { status: 200 }
      );
    }

    // Generate a reset token and expiry
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now

    // Save the reset token and expiry to the user
    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    // Create the reset URL
    const resetUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password?token=${resetToken}`;
    // Email content
    const emailSubject = "Password Reset Request";
    const emailBody = `
      <h1>Password Reset</h1>
      <p>You requested a password reset. Click the link below to reset your password.</p>
      <a href="${resetUrl}" target="_blank">Reset Password</a>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `;

    // Send the email
    await sendEmail({
      to: user.email,
      subject: emailSubject,
      html: emailBody,
    });

    return NextResponse.json(
      { success: true, message: "Reset link sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process request" },
      { status: 500 }
    );
  }
}
