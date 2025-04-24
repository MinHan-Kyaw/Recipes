import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Recipe } from "@/lib/types/recipe";
import { ChefHat, Eye, EyeOff, Clock, Tag } from "lucide-react";

export const RecipeStatsCards = ({ recipes }: { recipes: Recipe[] }) => {
  const totalRecipes = recipes.length;
  const publicRecipes = recipes.filter((recipe) => recipe.isPublic).length;
  const privateRecipes = recipes.filter((recipe) => !recipe.isPublic).length;

  // Calculate average prep time
  const totalPrepTime = recipes.reduce(
    (acc, recipe) => acc + (recipe.prepTime || 0),
    0
  );
  const avgPrepTime = totalRecipes
    ? Math.round(totalPrepTime / totalRecipes)
    : 0;

  // Get all unique tags
  const uniqueTags = new Set();
  recipes.forEach((recipe) => {
    recipe.tags?.forEach((tag) => uniqueTags.add(tag));
  });

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Recipes</CardTitle>
          <ChefHat className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalRecipes}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Public Recipes</CardTitle>
          <Eye className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{publicRecipes}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Private Recipes</CardTitle>
          <EyeOff className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{privateRecipes}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            Categories & Tags
          </CardTitle>
          <Tag className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{uniqueTags.size}</div>
        </CardContent>
      </Card>
    </div>
  );
};
