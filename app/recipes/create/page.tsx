// app/recipes/create/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import RecipeForm from "@/components/recipes/RecipeForm";
import { Recipe } from "@/lib/types/recipe";
import { createRecipe } from "@/lib/api/recipes";
import { useToast } from "@/hooks/use-toast";
import Cookies from "js-cookie";

const CreateRecipePage: React.FC = () => {
  const router = useRouter();
  const { toast } = useToast();

  // Function to upload images to DigitalOcean Spaces
  const uploadImages = async (localImages: File[]) => {
    if (localImages.length === 0) return [];

    try {
      const formData = new FormData();
      localImages.forEach((file) => {
        formData.append("files", file);
      });

      const response = await fetch("/api/uploads/bulk", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to upload images");
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error("Error uploading images:", error);
      throw error;
    }
  };

  const handleSubmit = async (recipeData: Recipe, localImages: File[]) => {
    try {
      // Process and upload images if there are any local images
      let finalImages = [...recipeData.images];

      if (localImages.length > 0) {
        // First, find which images in the recipe are local
        const localImageIndexes = recipeData.images
          .map((img, index) => (img.isLocal ? index : -1))
          .filter((index) => index !== -1);

        // Upload the local images
        const uploadedImages = await uploadImages(localImages);

        if (!uploadedImages || uploadedImages.length !== localImages.length) {
          throw new Error("Some images failed to upload");
        }

        // Replace local images with uploaded ones
        finalImages = recipeData.images.map((img, index) => {
          if (img.isLocal) {
            const localIndex = localImageIndexes.indexOf(index);
            if (localIndex !== -1 && uploadedImages[localIndex]) {
              return {
                ...img,
                url: uploadedImages[localIndex].url,
                filename: uploadedImages[localIndex].filename,
                isLocal: false,
              };
            }
          }
          return img;
        });
      }

      // Get user ID from token
      const token = Cookies.get("token");
      const userId = token
        ? JSON.parse(atob(token.split(".")[1])).userId
        : null;

      // Prepare final recipe data with uploaded images
      const finalRecipeData = {
        ...recipeData,
        images: finalImages.map((img) => ({
          url: img.url,
          filename: img.filename || "",
          caption: img.caption || "",
          isPrimary: img.isPrimary,
          order: img.order,
        })),
        author: userId || recipeData.author,
      };

      // Create the recipe
      const result = await createRecipe(finalRecipeData,userId);

      if (!result) {
        throw new Error("Failed to create recipe");
      }

      toast({
        title: "Recipe Created",
        description: "Your recipe has been created successfully.",
      });

      // Redirect to the recipe page or recipes list
      router.push("/recipes");
    } catch (error) {
      throw error;
    }
  };

  return (
    <RecipeForm
      onSubmit={handleSubmit}
      cancelRedirectPath="/recipes"
      submitButtonText="Save Recipe"
      title="Add a Recipe"
    />
  );
};

export default CreateRecipePage;
