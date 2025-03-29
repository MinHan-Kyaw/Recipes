"use client";

import React, { useState } from "react";
import { X, Upload, Image as ImageIcon, AlertCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AnimatedButton } from "../AnimatedButton";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RecipeImage } from "@/lib/types/recipe";

interface ImageUploadProps {
  images: RecipeImage[];
  setImages: (images: RecipeImage[]) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  images,
  setImages,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    setError(null);

    // Validate file types
    const validFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/")
    );

    if (validFiles.length !== files.length) {
      setError("Only image files are allowed");
      return;
    }

    // Process each valid file
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target?.result as string;
        // In a real app, you would upload the image to a server and get a URL back
        // For now, we'll use the data URL
        const newImage: RecipeImage = {
          url,
          caption: "",
          isPrimary: images.length === 0, // First image is primary by default
          order: images.length,
        };

        setImages([...images, newImage]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    const wasRemovingPrimary = newImages[index].isPrimary;

    newImages.splice(index, 1);

    // Reorder remaining images
    newImages.forEach((img, i) => {
      img.order = i;
    });

    // If we removed the primary image, set the first image as primary
    if (wasRemovingPrimary && newImages.length > 0) {
      newImages[0].isPrimary = true;
    }

    setImages(newImages);
  };

  const setAsPrimary = (index: number) => {
    const newImages = [...images];

    // Set all images as not primary
    newImages.forEach((img) => {
      img.isPrimary = false;
    });

    // Set selected image as primary
    newImages[index].isPrimary = true;

    setImages(newImages);
  };

  const updateCaption = (index: number, caption: string) => {
    const newImages = [...images];
    newImages[index].caption = caption;
    setImages(newImages);
  };

  return (
    <div className="w-full space-y-4">
      <Label className="text-lg font-semibold text-gray-800">
        Recipe Images
      </Label>

      {/* Drag and drop area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive
            ? "border-primary bg-primary/5"
            : "border-gray-300 hover:border-gray-400"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
        <div className="mt-2">
          <p className="text-sm text-gray-600">
            Drag and drop your recipe images here or
          </p>
          <label htmlFor="images-upload" className="mt-2 cursor-pointer">
            <span className="mt-2 inline-flex items-center text-sm font-medium text-primary hover:underline">
              browse files
            </span>
            <Input
              id="images-upload"
              type="file"
              className="sr-only"
              accept="image/*"
              multiple
              onChange={handleChange}
            />
          </label>
        </div>
        <p className="mt-2 text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
      </div>

      {error && (
        <motion.div
          className="flex items-center gap-2 text-red-500 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <AlertCircle size={16} />
          <span>{error}</span>
        </motion.div>
      )}

      {/* Image preview grid */}
      {images.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-700">Selected Images</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AnimatePresence>
              {images.map((image, index) => (
                <motion.div
                  key={index}
                  className={`relative border rounded-lg overflow-hidden ${
                    image.isPrimary ? "ring-2 ring-primary" : ""
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="relative aspect-video bg-gray-100">
                    <img
                      src={image.url}
                      alt={image.caption || `Recipe image ${index + 1}`}
                      className="object-cover w-full h-full"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-gray-900/60 text-white rounded-full p-1 hover:bg-red-500"
                    >
                      <X size={16} />
                    </button>
                    {!image.isPrimary && (
                      <button
                        onClick={() => setAsPrimary(index)}
                        className="absolute bottom-2 right-2 bg-gray-900/60 text-white text-xs py-1 px-2 rounded hover:bg-primary"
                      >
                        Set as main
                      </button>
                    )}
                    {image.isPrimary && (
                      <div className="absolute bottom-2 right-2 bg-primary text-white text-xs py-1 px-2 rounded">
                        Main image
                      </div>
                    )}
                  </div>
                  <div className="p-2">
                    <Input
                      value={image.caption}
                      onChange={(e) => updateCaption(index, e.target.value)}
                      placeholder="Add a caption..."
                      className="text-sm border-none bg-transparent focus:ring-0"
                    />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
};
