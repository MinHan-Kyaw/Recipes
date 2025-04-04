"use client";

import React, { useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { RecipeImage } from "@/lib/types/recipe";

export const ImageUpload = ({
  images,
  setImages,
  localImages,
  setLocalImages,
}: {
  images: RecipeImage[];
  setImages: (images: RecipeImage[]) => void;
  localImages: File[];
  setLocalImages: (files: File[]) => void;
}) => {
  const [uploadError, setUploadError] = useState("");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadError("");

    try {
      const newImages = [...images];
      const newLocalImages = [...localImages];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        // Create a temporary local URL for preview
        const tempUrl = URL.createObjectURL(file);

        // Add to local images array for later upload
        newLocalImages.push(file);

        // Add image preview to the images array
        newImages.push({
          url: tempUrl,
          filename: file.name, // Temporary, will be replaced when uploaded
          caption: "",
          isPrimary: newImages.length === 0, // First image is primary by default
          order: newImages.length,
          isLocal: true, // Flag to identify local images
        });
      }

      // Update the state with the new images
      setImages(newImages);
      setLocalImages(newLocalImages);
    } catch (error) {
      console.error("Error handling images:", error);
      setUploadError(
        error instanceof Error ? error.message : "Failed to handle images"
      );
    } finally {
      // Reset the file input
      e.target.value = "";
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];

    // If it's a local image, also remove from localImages array
    if (newImages[index].isLocal) {
      // We need to count how many local images come before this one
      let localImagePosition = 0;
      for (let i = 0; i < index; i++) {
        if (newImages[i].isLocal) {
          localImagePosition++;
        }
      }

      // Now we can remove the correct local image
      const newLocalImages = [...localImages];
      newLocalImages.splice(localImagePosition, 1);
      setLocalImages(newLocalImages);
    }

    // Revoke object URL to prevent memory leaks
    if (newImages[index].isLocal && newImages[index].url) {
      URL.revokeObjectURL(newImages[index].url);
    }

    newImages.splice(index, 1);

    // If we removed the primary image, make the first image primary
    if (newImages.length > 0 && images[index].isPrimary) {
      newImages[0].isPrimary = true;
    }

    newImages.forEach((img, idx) => {
      img.order = idx;
    });

    setImages(newImages);
  };

  const setPrimaryImage = (index: number) => {
    const newImages = [...images];
    newImages.forEach((img, idx) => {
      img.isPrimary = idx === index;
    });
    setImages(newImages);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">Recipe Images</h2>
        <div className="relative">
          <input
            type="file"
            id="image-upload"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleFileUpload}
            accept="image/*"
            multiple
          />
          <Button type="button" variant="outline" className="gap-2">
            <Upload size={18} />
            Upload Images
          </Button>
        </div>
      </div>

      {uploadError && (
        <div className="text-red-500 text-sm mt-1">{uploadError}</div>
      )}

      {images.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className={`relative group rounded-lg overflow-hidden border ${
                image.isPrimary ? "ring-2 ring-blue-500" : ""
              }`}
            >
              <div className="aspect-square relative">
                <Image
                  src={image.url}
                  alt={image.caption || `Recipe image ${index + 1}`}
                  fill
                  className="object-cover"
                  unoptimized={image.isLocal} // Skip Next.js optimization for local files
                />
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex gap-2">
                  {!image.isPrimary && (
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={() => setPrimaryImage(index)}
                      className="text-xs"
                    >
                      Set as Main
                    </Button>
                  )}
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    onClick={() => removeImage(index)}
                    className="text-xs"
                  >
                    <X size={16} />
                  </Button>
                </div>
              </div>
              {image.isPrimary && (
                <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                  Main
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="border border-dashed rounded-lg p-8 text-center text-gray-500">
          No images uploaded yet. Add images to showcase your recipe.
        </div>
      )}
    </div>
  );
};
