import { NextResponse } from "next/server";
import { uploadToSpaces } from "@/lib/utils/spaceUpload";

export async function POST(request) {
  try {
    // Get the form data from the request
    const formData = await request.formData();
    const files = formData.getAll("files");
    const folder = formData.get("folder") || "Recipes";

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, error: "No files provided" },
        { status: 400 }
      );
    }

    const uploadedImages = [];

    // Process each file
    for (const file of files) {
      // Check if the file is an image
      if (!file.type.startsWith("image/")) {
        continue; // Skip non-image files
      }

      // Convert file to buffer
      const buffer = Buffer.from(await file.arrayBuffer());

      // Upload to DigitalOcean Spaces
      const { url, filename } = await uploadToSpaces(
        buffer,
        file.name,
        file.type,
        folder
      );

      uploadedImages.push({ url, filename });
    }

    return NextResponse.json(
      {
        success: true,
        data: uploadedImages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error handling bulk image upload:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to upload images" },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
export const maxDuration = 60;
export const fetchCache = 'force-no-store';
