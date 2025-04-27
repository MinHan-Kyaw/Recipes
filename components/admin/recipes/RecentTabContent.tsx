import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Recipe } from "@/lib/types/recipe";
import { Button } from "@/components/ui/button";
import {
  Eye,
  Edit,
  Loader2,
  FileX,
  Utensils,
  Clock,
  Timer,
} from "lucide-react";

interface TabContentProps {
  recipes: Recipe[];
  isLoading: boolean;
  handleViewRecipe: (recipe: Recipe) => void;
}

interface PublicTabContentProps extends TabContentProps {
  handleEditRecipe: (recipe: Recipe) => void;
}

export const RecentTabContent: React.FC<PublicTabContentProps> = ({
  recipes,
  isLoading,
  handleViewRecipe,
  handleEditRecipe,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Recently Added Recipes</h3>
        <span className="text-sm text-muted-foreground">
          Showing last {recipes.length} recipes
        </span>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : recipes.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex flex-col items-center space-y-2">
              <FileX className="h-8 w-8 text-muted-foreground" />
              <h3 className="font-medium">No recent recipes found</h3>
              <p className="text-sm text-muted-foreground">
                No recipes have been added recently.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe) => (
            <Card key={recipe._id} className="overflow-hidden">
              <div className="relative h-48">
                {recipe.images && recipe.images.length > 0 ? (
                  <img
                    src={recipe.images[0].url}
                    alt={recipe.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-muted">
                    <Utensils className="h-10 w-10 text-muted-foreground" />
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <h3 className="text-lg font-medium text-white">
                    {recipe.title}
                  </h3>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Clock className="mr-1 h-3 w-3" />
                    <span>
                      {recipe.createdAt
                        ? new Date(recipe.createdAt).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Timer className="mr-1 h-3 w-3" />
                    <span>{recipe.prepTime + (recipe.cookTime || 0)} min</span>
                  </div>
                </div>
                <p className="mt-2 line-clamp-2 text-sm">
                  {recipe.description}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between p-4 pt-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewRecipe(recipe)}
                >
                  <Eye className="mr-1 h-4 w-4" />
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditRecipe(recipe)}
                >
                  <Edit className="mr-1 h-4 w-4" />
                  Edit
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
