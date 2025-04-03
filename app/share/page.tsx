"use client";

import React, { useState } from "react";
import { X, ChefHat, Pencil, Clock, Users, Book, Loader2 } from "lucide-react";
import { IngredientList } from "@/components/share/IngredientList";
import DirectionList from "@/components/share/DirectionList";
import { useRouter } from "next/navigation";

// Import shadcn components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { VideoLink } from "@/components/share/VideoLink";
import { ImageUpload } from "@/components/share/ImageUpload";
import { Recipe, RecipeImage } from "@/lib/types/recipe";
import { useToast } from "@/hooks/use-toast";
import { createRecipe } from "@/lib/api/recipes";
import Cookies from "js-cookie";

// Shadcn form field component
const FormField: React.FC<{
  id: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  type?: string;
  suffix?: string;
}> = ({
  id,
  name,
  value,
  onChange,
  placeholder,
  label,
  icon,
  type = "text",
  suffix,
}) => {
  return (
    <div className="mb-6 space-y-2">
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
      </Label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <Input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`${icon ? "pl-10" : "pl-3"} ${suffix ? "pr-16" : "pr-3"}`}
        />
        {suffix && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
            {suffix}
          </div>
        )}
      </div>
    </div>
  );
};

// Shadcn textarea field component
const TextareaField: React.FC<{
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  label: React.ReactNode;
  rows?: number;
}> = ({ id, name, value, onChange, placeholder, label, rows = 4 }) => {
  return (
    <div className="mb-6 space-y-2">
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
      </Label>
      <Textarea
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className="resize-vertical"
      />
    </div>
  );
};

// Main component
const CreateRecipe: React.FC = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localImages, setLocalImages] = useState<File[]>([]);

  const [recipe, setRecipe] = useState<Recipe>({
    title: "",
    description: "",
    ingredients: [],
    directions: [],
    servings: "",
    yield: "",
    prepTime: 0,
    cookTime: 0,
    notes: "",
    // New fields
    images: [],
    videoUrl: "",
    category: "",
    cuisine: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setRecipe((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRecipe((prev) => ({
      ...prev,
      [name]: value === "" ? 0 : parseInt(value, 10),
    }));
  };

  // Function to upload images to DigitalOcean Spaces
  const uploadImages = async () => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      const requiredFields = [
        "title",
        "description",
        "ingredients",
        "directions",
        "servings",
        "prepTime",
      ];

      const missingFields = requiredFields.filter((field) => {
        if (Array.isArray((recipe as Record<string, any>)[field])) {
          return (recipe as Record<string, any>)[field].length === 0;
        }
        return !(recipe as Record<string, any>)[field];
      });

      if (missingFields.length > 0) {
        throw new Error(
          `Please fill in all required fields: ${missingFields.join(", ")}`
        );
      }

      // Process and upload images if there are any local images
      let finalImages = [...recipe.images];

      if (localImages.length > 0) {
        // First, find which images in the recipe are local
        const localImageIndexes = recipe.images
          .map((img, index) => (img.isLocal ? index : -1))
          .filter((index) => index !== -1);

        // Upload the local images
        const uploadedImages = await uploadImages();

        if (!uploadedImages || uploadedImages.length !== localImages.length) {
          throw new Error("Some images failed to upload");
        }

        // Replace local images with uploaded ones
        finalImages = recipe.images.map((img, index) => {
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
      const recipeData = {
        ...recipe,
        images: finalImages.map((img) => ({
          url: img.url,
          filename: img.filename || "",
          caption: img.caption || "",
          isPrimary: img.isPrimary,
          order: img.order,
        })),
        author: userId || recipe.author,
      };

      // Create the recipe
      const result = await createRecipe(recipeData);

      if (!result) {
        throw new Error("Failed to create recipe");
      }

      toast({
        title: "Recipe Created",
        description: "Your recipe has been created successfully.",
      });

      // Revoke all object URLs to prevent memory leaks
      recipe.images.forEach((img) => {
        if (img.isLocal && img.url) {
          URL.revokeObjectURL(img.url);
        }
      });
      // Clear the recipe state and local images
      setRecipe({
        title: "",
        description: "",
        ingredients: [],
        directions: [],
        servings: "",
        yield: "",
        prepTime: 0,
        cookTime: 0,
        notes: "",
        images: [],
        videoUrl: "",
        category: "",
        cuisine: "",
      });
      setLocalImages([]);
      // Redirect to the recipe page or recipes list
      router.push("/share");
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelClick = () => {
    // Revoke all object URLs to prevent memory leaks
    recipe.images.forEach((img) => {
      if (img.isLocal && img.url) {
        URL.revokeObjectURL(img.url);
      }
    });
    router.push(`/meals`);
  };

  return (
    <Card className="max-w-3xl mx-auto shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-800">
          Add a Recipe
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          {/* Recipe Title */}
          <FormField
            id="title"
            name="title"
            value={recipe.title}
            onChange={handleInputChange}
            placeholder="Give your recipe a title"
            label={
              <>
                Recipe Title <span className="text-red-500">*</span>
              </>
            }
            icon={<ChefHat size={20} />}
          />

          {/* Description */}
          <TextareaField
            id="description"
            name="description"
            value={recipe.description}
            onChange={handleInputChange}
            placeholder="Share the story behind your recipe and what makes it special."
            label={
              <>
                Description <span className="text-red-500">*</span>
              </>
            }
            rows={4}
          />

          {/* Recipe Images */}
          <div className="mb-6">
            <ImageUpload
              images={recipe.images}
              setImages={(images: RecipeImage[]) =>
                setRecipe((prev) => ({ ...prev, images }))
              }
              localImages={localImages}
              setLocalImages={setLocalImages}
            />
          </div>

          <Separator className="my-6" />

          {/* Ingredients Section */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Ingredients <span className="text-red-500">*</span>
            </h2>
            <IngredientList
              ingredients={recipe.ingredients}
              setIngredients={(ingredients: string[]) =>
                setRecipe((prev) => ({ ...prev, ingredients }))
              }
            />
          </div>

          <Separator className="my-6" />

          {/* Directions Section */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Directions <span className="text-red-500">*</span>
            </h2>
            <DirectionList
              directions={recipe.directions}
              setDirections={(directions) =>
                setRecipe((prev) => ({ ...prev, directions }))
              }
            />
          </div>

          <Separator className="my-6" />

          {/* Video Link */}
          <div className="mb-6">
            <VideoLink
              videoUrl={recipe.videoUrl}
              setVideoUrl={(videoUrl: string) =>
                setRecipe((prev) => ({ ...prev, videoUrl }))
              }
            />
          </div>

          <Separator className="my-6" />

          {/* Recipe Details Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <FormField
              id="servings"
              name="servings"
              value={recipe.servings}
              onChange={handleInputChange}
              placeholder="e.g. 8"
              label={
                <>
                  Servings <span className="text-red-500">*</span>
                </>
              }
              icon={<Users size={20} />}
            />

            <FormField
              id="yield"
              name="yield"
              value={recipe.yield}
              onChange={handleInputChange}
              placeholder="e.g. 1 9-inch cake"
              label="Yield (Optional)"
              icon={<Book size={20} />}
            />

            <FormField
              id="prepTime"
              name="prepTime"
              value={recipe.prepTime}
              onChange={handleNumberInputChange}
              type="number"
              label={
                <>
                  Prep Time <span className="text-red-500">*</span>
                </>
              }
              icon={<Clock size={20} />}
              suffix="mins"
            />

            <FormField
              id="cookTime"
              name="cookTime"
              value={recipe.cookTime}
              onChange={handleNumberInputChange}
              type="number"
              label="Cook Time (optional)"
              icon={<Clock size={20} />}
              suffix="mins"
            />
          </div>

          {/* Additional Recipe Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <FormField
              id="category"
              name="category"
              value={recipe.category || ""}
              onChange={handleInputChange}
              placeholder="e.g. Dessert, Main Course"
              label="Category (Optional)"
            />

            <FormField
              id="cuisine"
              name="cuisine"
              value={recipe.cuisine || ""}
              onChange={handleInputChange}
              placeholder="e.g. Italian, Asian"
              label="Cuisine (Optional)"
            />
          </div>

          {/* Notes */}
          <TextareaField
            id="notes"
            name="notes"
            value={recipe.notes}
            onChange={handleInputChange}
            placeholder="Add any helpful tips about ingredient substitutions, serving, or storage here."
            label="Notes (Optional)"
            rows={3}
          />

          {/* Required Fields Note */}
          <div className="mt-4 text-sm text-gray-500">
            <span className="text-red-500">*</span> Required fields
          </div>

          {/* Submit Section */}
          <div className="mt-8 flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={handleCancelClick}
              className="gap-2"
            >
              <X size={18} />
              Cancel
            </Button>
            <Button type="submit" className="gap-2" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  {"Saving..."}
                </>
              ) : (
                <>
                  <Pencil size={18} />
                  {"Save Recipe"}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateRecipe;
