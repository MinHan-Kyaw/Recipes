interface ProfileUpdateData {
  name: string;
  email: string;
  avatar?: string;
}

interface UploadImageResult {
  success: boolean;
  data?: Array<{
    url: string;
    [key: string]: any;
  }>;
  error?: string;
}

interface ProfileUpdateResult {
  success: boolean;
  data?: any;
  error?: string;
}

/**
 * Uploads a profile image to the server
 * @param file The image file to upload
 * @param userId The user ID for folder organization
 * @returns Promise with the upload result
 */
export const uploadProfileImage = async (file: File, userId: string): Promise<UploadImageResult> => {
  try {
    // Only allow images
    if (!file.type.startsWith("image/")) {
      return {
        success: false,
        error: "Please upload an image file."
      };
    }

    // Create form data for upload
    const formData = new FormData();
    formData.append("files", file);
    formData.append("folder", `profile/${userId || "unknown"}`);

    // Upload image
    const response = await fetch("/api/uploads/bulk", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || "Failed to upload image");
    }

    return result;
  } catch (error) {
    console.error("Error uploading image:", error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to upload image"
    };
  }
};

/**
 * Updates a user's profile information
 * @param userId The ID of the user to update
 * @param updateData The profile data to update
 * @returns Promise with the update result
 */
export const updateUserProfile = async (
  userId: string, 
  updateData: ProfileUpdateData
): Promise<ProfileUpdateResult> => {
  try {
    const response = await fetch(`/api/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || "Failed to update profile");
    }

    return result;
  } catch (error) {
    console.error("Error updating profile:", error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update profile"
    };
  }
};
