"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { fetchUserRecipes, deleteRecipe } from "@/lib/api/recipes";
import { Recipe } from "@/lib/types/recipe";
import ItemList from "@/components/ItemList";
import { Loader2 } from "lucide-react";

export default function RecipeListPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function loadRecipes() {
      if (!user) return;

      try {
        setLoading(true);
        if (!user._id) return;
        const userRecipes = await fetchUserRecipes(user._id);
        setRecipes(userRecipes);
        setFilteredRecipes(userRecipes);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load your recipes. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    if (!authLoading) {
      loadRecipes();
    }
  }, [user, authLoading, toast]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredRecipes(recipes);
    } else {
      const filtered = recipes.filter(
        (recipe) =>
          recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          recipe.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredRecipes(filtered);
    }
  }, [searchTerm, recipes]);

  const handleDeleteClick = (recipeId: string) => {
    setRecipeToDelete(recipeId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!recipeToDelete) return;

    try {
      setIsDeleting(true);
      await deleteRecipe(recipeToDelete);

      // Update recipes list
      const updatedRecipes = recipes.filter(
        (recipe) => recipe._id !== recipeToDelete
      );
      setRecipes(updatedRecipes);
      setFilteredRecipes(updatedRecipes);

      toast({
        title: "Recipe Deleted",
        description: "Your recipe has been successfully deleted.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete recipe. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setRecipeToDelete(null);
    }
  };

  if (authLoading) {
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

  const renderRecipeImage = (recipe: Recipe) => {
    return recipe.images && recipe.images.length > 0 ? (
      <Image
        src={recipe.images[0].url}
        alt={recipe.title}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover transition-transform duration-500 hover:scale-105"
      />
    ) : (
      <div className="flex items-center justify-center h-full">
        <span className="text-gray-400">No image</span>
      </div>
    );
  };

  const renderRecipeContent = (recipe: Recipe) => (
    <>
      <h3 className="text-xl font-semibold mb-2">{recipe.title}</h3>
      <p className="text-gray-500 line-clamp-2 mb-2">{recipe.description}</p>
      <div className="flex gap-4 text-sm text-gray-500 mt-3">
        <span className="inline-flex items-center">
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Prep: {recipe.prepTime} mins
        </span>
        {recipe.cookTime > 0 && (
          <span className="inline-flex items-center">
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            Cook: {recipe.cookTime} mins
          </span>
        )}
      </div>
    </>
  );

  const getRecipeDetails = (recipe: Recipe) => ({
    id: recipe._id as string,
    viewPath: `/recipes/${recipe._id}`,
    editPath: `/my-recipes/edit/${recipe._id}`,
  });

  return (
    <ItemList
      title="My Recipes"
      items={filteredRecipes}
      loading={loading}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      createPath="/recipes/create"
      createButtonText="Add New Recipe"
      emptyStateButtonText="Create Your First Recipe"
      noItemsFoundText="No Recipes Found"
      noMatchingItemsText="No Recipes Found Matching Your Search"
      handleDelete={handleDeleteClick}
      isDeleting={isDeleting}
      deleteDialogOpen={deleteDialogOpen}
      setDeleteDialogOpen={setDeleteDialogOpen}
      confirmDelete={confirmDelete}
      deleteDialogDescription="This action cannot be undone. This will permanently delete your recipe."
      renderItemImage={renderRecipeImage}
      renderItemContent={renderRecipeContent}
      getItemDetails={getRecipeDetails}
    />
  );
}
