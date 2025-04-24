import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Recipe } from "@/lib/types/recipe";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Edit, Star } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface TabContentProps {
  recipes: Recipe[];
  isLoading: boolean;
  handleViewRecipe: (recipe: Recipe) => void;
}

interface PublicTabContentProps extends TabContentProps {
  handleEditRecipe: (recipe: Recipe) => void;
}

interface PrivateTabContentProps extends TabContentProps {
  handleTogglePublic: (recipeId: string) => void;
}

export const PublicTabContent: React.FC<PublicTabContentProps> = ({
  recipes,
  isLoading,
  handleViewRecipe,
  handleEditRecipe,
}) => {
  if (isLoading) {
    return (
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5 mt-2" />
                <div className="flex justify-end mt-4">
                  <Skeleton className="h-9 w-16 mr-2" />
                  <Skeleton className="h-9 w-16" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (recipes.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="text-gray-500">No public recipes found.</p>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
      {recipes.map((recipe) => (
        <Card key={recipe._id} className="overflow-hidden">
          <CardContent className="p-4">
            <h3 className="font-medium text-lg mb-1">{recipe.title}</h3>
            <p className="text-gray-500 text-sm line-clamp-2">
              {recipe.description}
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {recipe.tags?.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                >
                  {tag}
                </span>
              ))}
              {(recipe.tags?.length || 0) > 3 && (
                <span className="text-xs text-gray-500">
                  +{(recipe.tags?.length || 3) - 3} more
                </span>
              )}
            </div>
            <div className="flex justify-end mt-4 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleViewRecipe(recipe)}
              >
                <Eye className="mr-1 h-4 w-4" />
                View
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => handleEditRecipe(recipe)}
              >
                <Edit className="mr-1 h-4 w-4" />
                Edit
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export const PrivateTabContent: React.FC<PrivateTabContentProps> = ({
  recipes,
  isLoading,
  handleViewRecipe,
  handleTogglePublic,
}) => {
  if (isLoading) {
    return (
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5 mt-2" />
                <div className="flex justify-end mt-4">
                  <Skeleton className="h-9 w-16 mr-2" />
                  <Skeleton className="h-9 w-16" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (recipes.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="text-gray-500">No private recipes found.</p>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
      {recipes.map((recipe) => (
        <Card key={recipe._id} className="overflow-hidden">
          <CardContent className="p-4">
            <h3 className="font-medium text-lg mb-1">{recipe.title}</h3>
            <p className="text-gray-500 text-sm line-clamp-2">
              {recipe.description}
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {recipe.category && (
                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                  {recipe.category}
                </span>
              )}
              {recipe.cuisine && (
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                  {recipe.cuisine}
                </span>
              )}
            </div>
            <div className="flex justify-end mt-4 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleViewRecipe(recipe)}
              >
                <Eye className="mr-1 h-4 w-4" />
                View
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => recipe._id && handleTogglePublic(recipe._id)}
              >
                <EyeOff className="mr-1 h-4 w-4" />
                Publish
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export const FeaturedTabContent: React.FC<TabContentProps> = ({
  recipes,
  isLoading,
  handleViewRecipe,
}) => {
  if (isLoading) {
    return (
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5 mt-2" />
                <div className="flex justify-end mt-4">
                  <Skeleton className="h-9 w-16" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (recipes.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="text-gray-500">No featured recipes found.</p>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
      {recipes.map((recipe) => (
        <Card key={recipe._id} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-medium text-lg">{recipe.title}</h3>
              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
            </div>
            <p className="text-gray-500 text-sm line-clamp-2">
              {recipe.description}
            </p>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
              {recipe.prepTime && (
                <span className="flex items-center">
                  <span className="font-medium">Prep:</span>{" "}
                  <span className="ml-1">{recipe.prepTime} mins</span>
                </span>
              )}
              {recipe.cookTime && (
                <span className="flex items-center">
                  <span className="font-medium">Cook:</span>{" "}
                  <span className="ml-1">{recipe.cookTime} mins</span>
                </span>
              )}
            </div>
            <div className="flex justify-end mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleViewRecipe(recipe)}
              >
                <Eye className="mr-1 h-4 w-4" />
                View
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
