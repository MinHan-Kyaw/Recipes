// app/my-recipes/edit/[id]/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import RecipeForm from "@/components/recipes/RecipeForm";
import { Recipe } from "@/lib/types/recipe";
import { fetchRecipeById, updateRecipe } from "@/lib/api/recipes";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { Loader2 } from "lucide-react";

export default function EditRecipePage() {
  const router = useRouter();
  const params = useParams();
  const recipeId = params.id as string;
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [recipe, setRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    async function loadRecipe() {
      if (!recipeId) return;

      try {
        setIsLoading(true);
        const recipeData = await fetchRecipeById(recipeId);

        if (!recipeData) {
          throw new Error("Recipe not found");
        }

        // Make sure the user is the author of this recipe
        if (user && recipeData.author !== user._id) {
          toast({
            title: "Unauthorized",
            description: "You don't have permission to edit this recipe.",
            variant: "destructive",
          });
          router.push("/my-recipes");
          return;
        }

        setRecipe(recipeData);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load recipe. Please try again.",
          variant: "destructive",
        });
        router.push("/my-recipes");
      } finally {
        setIsLoading(false);
      }
    }

    if (!authLoading && user) {
      loadRecipe();
    }
  }, [recipeId, user, authLoading, router, toast]);

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
      };

      // Update the recipe
      const result = await updateRecipe(recipeId, finalRecipeData);

      if (!result) {
        throw new Error("Failed to update recipe");
      }

      toast({
        title: "Recipe Updated",
        description: "Your recipe has been updated successfully.",
      });

      // Redirect to the recipe details page
      router.push(`/recipe/${recipeId}`);
    } catch (error) {
      throw error;
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    router.push("/auth/login");
    return null;
  }

  if (!recipe) {
    return null;
  }

  return (
    <RecipeForm
      initialRecipe={recipe}
      isEdit={true}
      recipeId={recipeId}
      onSubmit={handleSubmit}
      cancelRedirectPath={`/recipe/${recipeId}`}
      submitButtonText="Update Recipe"
      title="Edit Recipe"
    />
  );
}
