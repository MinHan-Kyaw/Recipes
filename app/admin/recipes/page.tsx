"use client";

import { useState, useEffect } from "react";
import {
  Utensils,
  Plus,
  Store,
  Tag,
  ChevronLeft,
  Clock,
  Eye,
  Star,
  Filter,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Recipe } from "@/lib/types/recipe";
import Link from "next/link";
import { createRecipe, updateRecipe, deleteRecipe } from "@/lib/api/recipes";
import {
  PublicTabContent,
  PrivateTabContent,
  FeaturedTabContent,
} from "@/components/admin/recipes/RecipeTabContent";
import { RecipeDetailsDialog } from "@/components/admin/recipes/RecipeDetailsDialog";
import { RecipeTable } from "@/components/admin/recipes/RecipeTable";
import { RecipeStatsCards } from "@/components/admin/recipes/RecipeStatsCards";
import { RecipeFilters } from "@/components/admin/recipes/RecipeFilters";
import { fetchAllRecipeAdmin } from "@/lib/api/admin/recipes";
import { RecentTabContent } from "@/components/admin/recipes/RecentTabContent";
import Cookies from "js-cookie";
import Sidebar from "@/components/admin/SideBar";

export default function RecipesPage() {
  const { toast } = useToast();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterCuisine, setFilterCuisine] = useState("all");
  const [filterDifficulty, setFilterDifficulty] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof Recipe>("title");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<
    "view" | "add" | "edit" | "delete"
  >("view");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    ingredients: [] as string[],
    directions: [] as string[],
    servings: "",
    yield: "",
    prepTime: 0,
    cookTime: 0,
    notes: "",
    videoUrl: "",
    tags: [] as string[],
    category: "",
    cuisine: "",
    difficulty: "easy" as "easy" | "medium" | "hard",
    isPublic: true,
  });

  // Form errors state
  const [errors, setErrors] = useState({
    title: "",
    description: "",
    ingredients: "",
    directions: "",
    servings: "",
    prepTime: "",
  });
  const [sortBy, setSortBy] = useState("newest");
  const [userId, setUserId] = useState<string | null>(null);

  const itemsPerPage = 5;

  const sortRecipes = (recipes: Recipe[]) => {
    const sortedRecipes = [...recipes];

    switch (sortBy) {
      case "newest":
        return sortedRecipes.sort(
          (a, b) =>
            new Date(b.createdAt || new Date()).getTime() -
            new Date(a.createdAt || new Date()).getTime()
        );
      case "oldest":
        return sortedRecipes.sort(
          (a, b) =>
            new Date(a.createdAt ?? new Date()).getTime() -
            new Date(b.createdAt ?? new Date()).getTime()
        );
      case "title-asc":
        return sortedRecipes.sort((a, b) => a.title.localeCompare(b.title));
      case "title-desc":
        return sortedRecipes.sort((a, b) => b.title.localeCompare(a.title));
      case "prep-asc":
        return sortedRecipes.sort((a, b) => a.prepTime - b.prepTime);
      case "prep-desc":
        return sortedRecipes.sort((a, b) => b.prepTime - a.prepTime);
      default:
        return sortedRecipes;
    }
  };

  // Fetch recipes on component mount
  useEffect(() => {
    const loadRecipes = async () => {
      try {
        setIsLoading(true);
        // const data = await getAllRecipes();
        const data = await fetchAllRecipeAdmin();
        console.log("Fetched recipes:", data);
        setRecipes(data.data || []);
        const token = Cookies.get("token");
        const userId = token
          ? JSON.parse(atob(token.split(".")[1])).userId
          : null;
        setUserId(userId);
      } catch (error) {
        console.error("Failed to fetch recipes:", error);
        setRecipes([]);
        toast({
          title: "Error",
          description: "Failed to load recipes. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadRecipes();
  }, [toast]);

  // Update form data when editing a recipe
  useEffect(() => {
    if (selectedRecipe && dialogMode === "edit") {
      setFormData({
        title: selectedRecipe.title || "",
        description: selectedRecipe.description || "",
        ingredients: selectedRecipe.ingredients || [],
        directions: selectedRecipe.directions || [],
        servings: selectedRecipe.servings || "",
        yield: selectedRecipe.yield || "",
        prepTime: selectedRecipe.prepTime || 0,
        cookTime: selectedRecipe.cookTime || 0,
        notes: selectedRecipe.notes || "",
        videoUrl: selectedRecipe.videoUrl || "",
        tags: selectedRecipe.tags || [],
        category: selectedRecipe.category || "",
        cuisine: selectedRecipe.cuisine || "",
        difficulty: selectedRecipe.difficulty || "easy",
        isPublic: selectedRecipe.isPublic || true,
      });
    } else if (dialogMode === "add") {
      // Reset form for adding new recipe
      setFormData({
        title: "",
        description: "",
        ingredients: [],
        directions: [],
        servings: "",
        yield: "",
        prepTime: 0,
        cookTime: 0,
        notes: "",
        videoUrl: "",
        tags: [],
        category: "",
        cuisine: "",
        difficulty: "easy",
        isPublic: true,
      });
    }
  }, [selectedRecipe, dialogMode]);

  // Validate form
  const validateForm = () => {
    const newErrors = {
      title: "",
      description: "",
      ingredients: "",
      directions: "",
      servings: "",
      prepTime: "",
    };
    let isValid = true;

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
      isValid = false;
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
      isValid = false;
    }

    if (!formData.ingredients || formData.ingredients.length === 0) {
      newErrors.ingredients = "At least one ingredient is required";
      isValid = false;
    }

    if (!formData.directions || formData.directions.length === 0) {
      newErrors.directions = "At least one direction step is required";
      isValid = false;
    }

    if (!formData.servings) {
      newErrors.servings = "Servings is required";
      isValid = false;
    }

    if (!formData.prepTime) {
      newErrors.prepTime = "Preparation time is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      if (dialogMode === "add") {
        const newRecipe: Recipe = {
          _id: `temp-${Date.now()}`,
          title: formData.title,
          description: formData.description,
          ingredients: formData.ingredients,
          directions: formData.directions,
          servings: formData.servings,
          yield: formData.yield,
          prepTime: formData.prepTime,
          cookTime: formData.cookTime,
          notes: formData.notes,
          videoUrl: formData.videoUrl,
          tags: formData.tags,
          category: formData.category,
          cuisine: formData.cuisine,
          difficulty: formData.difficulty,
          isPublic: formData.isPublic,
          images: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        if (!userId) {
          throw new Error("User ID is required");
        }
        await createRecipe(newRecipe, userId);
        setRecipes((prev) => [...prev, newRecipe]);

        toast({
          title: "Success",
          description: "Recipe created successfully",
        });
      } else if (dialogMode === "edit" && selectedRecipe) {
        const updatedRecipe: Recipe = {
          ...selectedRecipe,
          title: formData.title,
          description: formData.description,
          ingredients: formData.ingredients,
          directions: formData.directions,
          servings: formData.servings,
          yield: formData.yield,
          prepTime: formData.prepTime,
          cookTime: formData.cookTime,
          notes: formData.notes,
          videoUrl: formData.videoUrl,
          tags: formData.tags,
          category: formData.category,
          cuisine: formData.cuisine,
          difficulty: formData.difficulty,
          isPublic: formData.isPublic,
          updatedAt: new Date(),
        };
        if (!selectedRecipe._id) {
          throw new Error("Recipe ID is required");
        }
        await updateRecipe(selectedRecipe._id, updatedRecipe);
        setRecipes((prev) =>
          prev.map((recipe) =>
            recipe._id === selectedRecipe._id ? updatedRecipe : recipe
          )
        );
        toast({
          title: "Success",
          description: "Recipe updated successfully",
        });
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to save recipe:", error);
      toast({
        title: "Error",
        description: "Failed to save recipe. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle delete recipe
  const confirmDeleteRecipe = async () => {
    if (!selectedRecipe || !selectedRecipe._id) return;

    try {
      await deleteRecipe(selectedRecipe._id);
      setRecipes((prev) =>
        prev.filter((recipe) => recipe._id !== selectedRecipe._id)
      );
      toast({
        title: "Success",
        description: "Recipe deleted successfully",
      });
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to delete recipe:", error);
      toast({
        title: "Error",
        description: "Failed to delete recipe. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle toggle recipe public status
  const handleTogglePublic = async (recipeId: string) => {
    try {
      const recipeToUpdate = recipes.find((r) => r._id === recipeId);
      if (!recipeToUpdate) return;

      const updatedRecipe = {
        ...recipeToUpdate,
        isPublic: !recipeToUpdate.isPublic,
        updatedAt: new Date(),
      };

      await updateRecipe(recipeId, updatedRecipe);
      setRecipes((prev) =>
        prev.map((recipe) => (recipe._id === recipeId ? updatedRecipe : recipe))
      );
      toast({
        title: "Success",
        description: `Recipe ${
          updatedRecipe.isPublic ? "published" : "unpublished"
        } successfully`,
      });
    } catch (error) {
      console.error("Failed to update recipe status:", error);
      toast({
        title: "Error",
        description: "Failed to update recipe status. Please try again.",
        variant: "destructive",
      });
    }
  };
  // Get filtered and sorted recipes
  const filteredRecipes =
    recipes?.filter((recipe) => {
      const matchesSearch =
        searchTerm === "" ||
        (recipe.title || "")
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (recipe.description || "")
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (recipe.tags || [])?.some((tag) =>
          tag?.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        false;

      const matchesCategory =
        filterCategory === "all" || recipe.category === filterCategory;

      const matchesCuisine =
        filterCuisine === "all" || recipe.cuisine === filterCuisine;

      const matchesDifficulty =
        filterDifficulty === "all" || recipe.difficulty === filterDifficulty;

      return (
        matchesSearch && matchesCategory && matchesCuisine && matchesDifficulty
      );
    }) || [];

  const sortedAndFilteredRecipes = sortRecipes(filteredRecipes);

  const sortedRecipes = [...filteredRecipes].sort((a, b) => {
    let fieldA = a[sortField as keyof Recipe];
    let fieldB = b[sortField as keyof Recipe];

    // Convert arrays and objects to strings for comparison
    if (Array.isArray(fieldA)) fieldA = fieldA.join(",");
    if (Array.isArray(fieldB)) fieldB = fieldB.join(",");
    if (typeof fieldA === "object" && fieldA !== null)
      fieldA = JSON.stringify(fieldA);
    if (typeof fieldB === "object" && fieldB !== null)
      fieldB = JSON.stringify(fieldB);
    if (fieldA === null) fieldA = "";
    if (fieldB === null) fieldB = "";

    // Handle special cases for sorting
    if (sortField === "createdAt" || sortField === "updatedAt") {
      fieldA = fieldA ? new Date(fieldA as string).getTime() : 0;
      fieldB = fieldB ? new Date(fieldB as string).getTime() : 0;
    }

    if (fieldA === undefined) fieldA = "";
    if (fieldB === undefined) fieldB = "";

    const sortOrder = sortDirection === "asc" ? 1 : -1;

    if (fieldA < fieldB) return -1 * sortOrder;
    if (fieldA > fieldB) return 1 * sortOrder;
    return 0;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // const currentRecipes = sortedRecipes.slice(indexOfFirstItem, indexOfLastItem);
  const currentRecipes = sortedAndFilteredRecipes.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Handle sorting
  const handleSort = (field: keyof Recipe) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Handle recipe actions
  const handleViewRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setDialogMode("view");
    setIsDialogOpen(true);
  };

  const handleEditRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setDialogMode("edit");
    setIsDialogOpen(true);
  };

  const handleDeleteRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setDialogMode("delete");
    setIsDialogOpen(true);
  };

  const handleAddRecipe = () => {
    setSelectedRecipe(null);
    setDialogMode("add");
    setIsDialogOpen(true);
  };

  // Get unique categories and cuisines for filters
  // Get unique categories and cuisines for filters
  const categories = [
    "all",
    ...Array.from(
      new Set(
        (recipes || [])
          .map((recipe) => recipe.category)
          .filter(
            (category): category is string =>
              category !== undefined && category !== null && category !== ""
          )
      )
    ),
  ];

  const cuisines = [
    "all",
    ...Array.from(
      new Set(
        (recipes || [])
          .map((recipe) => recipe.cuisine)
          .filter(
            (cuisine): cuisine is string =>
              cuisine !== undefined && cuisine !== null && cuisine !== ""
          )
      )
    ),
  ];

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-6 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Recipe Management
              </h1>
              <p className="text-gray-500">Manage and monitor recipes</p>
            </div>
            <Button
              onClick={handleAddRecipe}
              className="mt-4 md:mt-0 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Recipe
            </Button>
          </div>

          {/* Stats Cards */}
          <RecipeStatsCards recipes={recipes || []} />

          {/* Tabs for different recipe views */}
          <Tabs defaultValue="all-recipes" className="mb-6">
            <TabsList className="mb-4">
              <TabsTrigger
                value="all-recipes"
                className="flex items-center gap-2"
              >
                <Utensils className="h-4 w-4" />
                <span>All Recipes</span>
              </TabsTrigger>
              <TabsTrigger value="recent" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Recent</span>
              </TabsTrigger>
              <TabsTrigger value="public" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span>Public</span>
              </TabsTrigger>
              <TabsTrigger value="private" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>Private</span>
              </TabsTrigger>
              <TabsTrigger value="featured" className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                <span>Featured</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all-recipes">
              {/* Search and Filters */}
              <RecipeFilters
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                filterCategory={filterCategory}
                setFilterCategory={setFilterCategory}
                filterCuisine={filterCuisine}
                setFilterCuisine={setFilterCuisine}
                filterDifficulty={filterDifficulty}
                setFilterDifficulty={setFilterDifficulty}
                sortBy={sortBy}
                setSortBy={setSortBy}
                categories={categories}
                cuisines={cuisines}
              />

              {/* Recipes Table */}
              <Card className="mb-6">
                <CardContent className="p-0">
                  <RecipeTable
                    recipes={currentRecipes}
                    isLoading={isLoading}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    handleSort={handleSort}
                    handleViewRecipe={handleViewRecipe}
                    handleEditRecipe={handleEditRecipe}
                    handleDeleteRecipe={handleDeleteRecipe}
                    handleTogglePublic={handleTogglePublic}
                    itemsPerPage={itemsPerPage}
                    indexOfFirstItem={indexOfFirstItem}
                    totalRecipes={filteredRecipes.length}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="recent">
              <RecentTabContent
                recipes={
                  recipes
                    ?.sort(
                      (a, b) =>
                        new Date(b.createdAt || new Date()).getTime() -
                        new Date(a.createdAt || new Date()).getTime()
                    )
                    .slice(0, 10) || []
                }
                isLoading={isLoading}
                handleViewRecipe={handleViewRecipe}
                handleEditRecipe={handleEditRecipe}
              />
            </TabsContent>

            <TabsContent value="public">
              <PublicTabContent
                recipes={recipes?.filter((r) => r.isPublic) || []}
                isLoading={isLoading}
                handleViewRecipe={handleViewRecipe}
                handleEditRecipe={handleEditRecipe}
              />
            </TabsContent>

            <TabsContent value="private">
              <PrivateTabContent
                recipes={recipes?.filter((r) => !r.isPublic) || []}
                isLoading={isLoading}
                handleViewRecipe={handleViewRecipe}
                handleTogglePublic={handleTogglePublic}
              />
            </TabsContent>

            <TabsContent value="featured">
              <FeaturedTabContent
                recipes={
                  recipes?.filter((r) => r.tags?.includes("featured")) || []
                }
                isLoading={isLoading}
                handleViewRecipe={handleViewRecipe}
              />
            </TabsContent>
          </Tabs>

          {/* Recipe Details Dialog */}
          <RecipeDetailsDialog
            isOpen={isDialogOpen}
            setIsOpen={setIsDialogOpen}
            mode={dialogMode}
            selectedRecipe={selectedRecipe}
            handleSubmit={handleSubmit}
            confirmDeleteRecipe={confirmDeleteRecipe}
            handleEditRecipe={handleEditRecipe}
            formData={formData}
            setFormData={setFormData}
            errors={errors}
          />
        </div>
      </div>
    </div>
  );
}
