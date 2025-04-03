import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// Configure the S3 client for DigitalOcean Spaces
if (!process.env.SPACE_ACCESSKEY_ID || !process.env.SPACE_SECRET_KEY) {
  throw new Error('Space credentials are not configured');
}

const s3Client = new S3Client({
  region: "nyc3", // Your DO Spaces region
  endpoint:
    process.env.DO_SPACES_ENDPOINT,
  credentials: {
    accessKeyId: process.env.SPACE_ACCESSKEY_ID,
    secretAccessKey: process.env.SPACE_SECRET_KEY,
  },
  forcePathStyle: true, // Important for Digital Ocean Spaces compatibility
});

/**
 * Uploads a file to DigitalOcean Spaces
 *
 * @param {Buffer} fileBuffer - The file buffer to upload
 * @param {string} originalFilename - Original filename
 * @param {string} contentType - MIME type of the file
 * @returns {Promise<Object>} - The URL and filename of the uploaded file
 */
export async function uploadToSpaces(
  fileBuffer: Buffer,
  originalFilename: string,
  contentType: string,
  folderPath: string = "Recipes"
) {
  try {
    // Create a timestamp prefix for the filename
    const timestamp = new Date().getTime();
    const filenameParts = originalFilename.split(".");
    const extension = filenameParts.pop();
    const basename = filenameParts.join(".");

    // Create new filename with timestamp and sanitize it
    // Remove special characters that could cause issues
    const sanitizedBasename = basename.replace(/[^a-zA-Z0-9]/g, "-");
    const newFilename = `${timestamp}-${sanitizedBasename}.${extension}`;
    const spacesPath = `${folderPath}/${newFilename}`;

    // Prepare the upload command
    const uploadParams = {
      Bucket: "mmrecipes", // Your bucket name
      Key: spacesPath,
      Body: fileBuffer,
      ContentType: contentType,
      ACL: "public-read" as const, // Make the file publicly accessible
    };

    // Execute the upload
    const command = new PutObjectCommand(uploadParams);
    await s3Client.send(command);

    // Return the URL of the uploaded file
    return {
      url: `https://mmrecipes.nyc3.digitaloceanspaces.com/${spacesPath}`,
      filename: newFilename,
    };
  } catch (error: unknown) {
    console.error("Error uploading to DigitalOcean Spaces:", error);
    throw new Error(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
