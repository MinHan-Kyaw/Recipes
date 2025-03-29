"use client";

import React, { useState } from "react";
import { X, ChefHat, Pencil, Clock, Users, Book } from "lucide-react";
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

// Shadcn form field component
const FormField: React.FC<{
  id: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  label: string;
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
  label: string;
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
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setRecipe((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log(recipe);
  };

  const router = useRouter();

  const handleCancelClick = () => {
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
            label="Recipe Title"
            icon={<ChefHat size={20} />}
          />

          {/* Description */}
          <TextareaField
            id="description"
            name="description"
            value={recipe.description}
            onChange={handleInputChange}
            placeholder="Share the story behind your recipe and what makes it special."
            label="Description"
            rows={4}
          />

          {/* Recipe Images - New section */}
          <div className="mb-6">
            <ImageUpload
              images={recipe.images}
              setImages={(images: RecipeImage[]) =>
                setRecipe((prev) => ({ ...prev, images }))
              }
            />
          </div>

          <Separator className="my-6" />

          {/* Ingredients Section */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Ingredients
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
              Directions
            </h2>
            <DirectionList
              directions={recipe.directions}
              setDirections={(directions) =>
                setRecipe((prev) => ({ ...prev, directions }))
              }
            />
          </div>

          <Separator className="my-6" />

          {/* Video Link - New field */}
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
              label="Servings"
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
              onChange={handleInputChange}
              type="number"
              label="Prep Time"
              icon={<Clock size={20} />}
              suffix="mins"
            />

            <FormField
              id="cookTime"
              name="cookTime"
              value={recipe.cookTime}
              onChange={handleInputChange}
              type="number"
              label="Cook Time (optional)"
              icon={<Clock size={20} />}
              suffix="mins"
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
            <Button type="submit" className="gap-2">
              <Pencil size={18} />
              Submit Recipe
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateRecipe;
