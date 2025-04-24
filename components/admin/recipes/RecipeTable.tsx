import React from "react";
import { Recipe } from "@/lib/types/recipe";
import { DataTable } from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Eye,
  Edit,
  Trash2,
  Clock,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

interface RecipeTableProps {
  recipes: Recipe[];
  isLoading: boolean;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  handleSort: (field: keyof Recipe) => void;
  handleViewRecipe: (recipe: Recipe) => void;
  handleEditRecipe: (recipe: Recipe) => void;
  handleDeleteRecipe: (recipe: Recipe) => void;
  handleTogglePublic: (recipeId: string) => void;
  itemsPerPage: number;
  indexOfFirstItem: number;
  totalRecipes: number;
}

export const RecipeTable: React.FC<RecipeTableProps> = ({
  recipes,
  isLoading,
  currentPage,
  setCurrentPage,
  handleSort,
  handleViewRecipe,
  handleEditRecipe,
  handleDeleteRecipe,
  handleTogglePublic,
  itemsPerPage,
  indexOfFirstItem,
  totalRecipes,
}) => {
  // Format date helper
  const formatDate = (date: Date | string | undefined) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get difficulty badge color
  const getDifficultyBadge = (difficulty?: string) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
            Easy
          </Badge>
        );
      case "medium":
        return (
          <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">
            Medium
          </Badge>
        );
      case "hard":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
            Hard
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const columns = [
    {
      key: "title",
      header: "Title",
      sortable: true,
      onSort: () => handleSort("title"),
      render: (recipe: Recipe) => (
        <div>
          <p className="font-medium line-clamp-1">{recipe.title}</p>
          <p className="text-xs text-gray-500 line-clamp-1">
            {recipe.description}
          </p>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      hidden: "sm",
      sortable: true,
      onSort: () => handleSort("category"),
      render: (recipe: Recipe) => (
        <span className="capitalize">{recipe.category || "Uncategorized"}</span>
      ),
    },
    {
      key: "cuisine",
      header: "Cuisine",
      hidden: "md",
      sortable: true,
      onSort: () => handleSort("cuisine"),
      render: (recipe: Recipe) => (
        <span className="capitalize">{recipe.cuisine || "N/A"}</span>
      ),
    },
    {
      key: "difficulty",
      header: "Difficulty",
      hidden: "lg",
      sortable: true,
      onSort: () => handleSort("difficulty"),
      render: (recipe: Recipe) => getDifficultyBadge(recipe.difficulty),
    },
    {
      key: "time",
      header: "Time",
      hidden: "xl",
      render: (recipe: Recipe) => (
        <div className="flex items-center whitespace-nowrap">
          <Clock className="h-3 w-3 mr-1 text-gray-500" />
          <span>{recipe.prepTime + (recipe.cookTime || 0)} min</span>
        </div>
      ),
    },
    {
      key: "isPublic",
      header: "Status",
      sortable: true,
      onSort: () => handleSort("isPublic"),
      render: (recipe: Recipe) => (
        <div className="flex items-center">
          {recipe.isPublic ? (
            <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
              Public
            </Badge>
          ) : (
            <Badge variant="outline">Private</Badge>
          )}
        </div>
      ),
    },
    {
      key: "createdAt",
      header: "Created",
      hidden: "lg",
      sortable: true,
      onSort: () => handleSort("createdAt"),
      render: (recipe: Recipe) => formatDate(recipe.createdAt),
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      render: (recipe: Recipe) => (
        <div className="flex justify-end gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleViewRecipe(recipe)}
            title="View"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleEditRecipe(recipe)}
            title="Edit"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => recipe._id && handleTogglePublic(recipe._id)}
            title={recipe.isPublic ? "Make Private" : "Make Public"}
          >
            {recipe.isPublic ? (
              <ToggleRight className="h-4 w-4" />
            ) : (
              <ToggleLeft className="h-4 w-4" />
            )}
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => handleDeleteRecipe(recipe)}
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      data={recipes}
      columns={columns}
      keyField={(recipe) => recipe._id || String(Math.random())}
      isLoading={isLoading}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      itemsPerPage={itemsPerPage}
      emptyMessage="No recipes found matching your filters."
    />
  );
};
