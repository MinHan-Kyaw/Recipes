"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Loader,
  Store,
  ChevronLeft,
  Search,
  FilterX,
  SlidersHorizontal,
  X,
  ArrowUpDown,
  Clock,
  ChevronRight,
  LayoutGrid,
  List,
  Filter,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Recipe } from "@/lib/types/recipe";
import { Shop } from "@/lib/types/shop";
import { fetchShopRecipes } from "@/lib/api/recipes";
import { fetchShopById } from "@/lib/api/shops";

export default function ShopMenuPage() {
  const { id } = useParams();
  const router = useRouter();
  const [shop, setShop] = useState<Shop | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Filter states
  const [search, setSearch] = useState("");
  const [categoryFilters, setCategoryFilters] = useState<string[]>([]);
  const [cuisineFilters, setCuisineFilters] = useState<string[]>([]);
  const [difficultyFilters, setDifficultyFilters] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        // Fetch shop details
        const result = await fetchShopById(id as string);
        if (!result) {
          throw new Error("Failed to fetch shop details");
        }
        setShop(result);

        // Fetch shop recipes
        const shopRecipes = await fetchShopRecipes(id as string);
        setRecipes(shopRecipes);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  // Extract unique categories, cuisines, and difficulty levels
  const categories = Array.from(
    new Set(recipes.map((r) => r.category).filter(Boolean))
  );
  const cuisines = Array.from(
    new Set(recipes.map((r) => r.cuisine).filter(Boolean))
  );
  const difficulties = Array.from(
    new Set(recipes.map((r) => r.difficulty).filter(Boolean))
  );

  // Group recipes by category for category tabs view
  const recipesByCategory = recipes.reduce((acc, recipe) => {
    const category = recipe.category || "Uncategorized";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(recipe);
    return acc;
  }, {} as Record<string, Recipe[]>);

  // Apply filters and sorting
  const filteredRecipes = recipes
    .filter((recipe) => {
      const matchesSearch =
        search === "" ||
        recipe.title.toLowerCase().includes(search.toLowerCase()) ||
        (recipe.description &&
          recipe.description.toLowerCase().includes(search.toLowerCase()));

      const matchesCategory =
        categoryFilters.length === 0 ||
        (recipe.category && categoryFilters.includes(recipe.category));

      const matchesCuisine =
        cuisineFilters.length === 0 ||
        (recipe.cuisine && cuisineFilters.includes(recipe.cuisine));

      const matchesDifficulty =
        difficultyFilters.length === 0 ||
        (recipe.difficulty && difficultyFilters.includes(recipe.difficulty));

      return (
        matchesSearch && matchesCategory && matchesCuisine && matchesDifficulty
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.createdAt || new Date()).getTime() -
            new Date(a.createdAt || new Date()).getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt || new Date()).getTime() -
            new Date(b.createdAt || new Date()).getTime()
          );
        case "prep-asc":
          return (
            a.prepTime + (a.cookTime || 0) - (b.prepTime + (b.cookTime || 0))
          );
        case "prep-desc":
          return (
            b.prepTime + (b.cookTime || 0) - (a.prepTime + (a.cookTime || 0))
          );
        case "name-asc":
          return a.title.localeCompare(b.title);
        case "name-desc":
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

  // Filter recipes by active category for the category tabs view
  const activeRecipes = activeCategory
    ? recipes.filter((r) => r.category === activeCategory)
    : recipes;

  const clearFilters = () => {
    setSearch("");
    setCategoryFilters([]);
    setCuisineFilters([]);
    setDifficultyFilters([]);
    setSortBy("newest");
  };

  const toggleCategoryFilter = (category: string) => {
    setCategoryFilters((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const toggleCuisineFilter = (cuisine: string) => {
    setCuisineFilters((prev) =>
      prev.includes(cuisine)
        ? prev.filter((c) => c !== cuisine)
        : [...prev, cuisine]
    );
  };

  const toggleDifficultyFilter = (difficulty: string) => {
    setDifficultyFilters((prev) =>
      prev.includes(difficulty)
        ? prev.filter((d) => d !== difficulty)
        : [...prev, difficulty]
    );
  };

  const hasActiveFilters =
    search !== "" ||
    categoryFilters.length > 0 ||
    cuisineFilters.length > 0 ||
    difficultyFilters.length > 0;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[50vh]">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[50vh]">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Shop not found</h2>
        <Link href="/shops">
          <Button variant="outline">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Shops
          </Button>
        </Link>
      </div>
    );
  }

  const totalActiveFilters =
    categoryFilters.length + cuisineFilters.length + difficultyFilters.length;

  const renderGridViewItem = (recipe: Recipe) => (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col bg-white border-gray-100">
      <div
        className="relative h-56 bg-gray-50 cursor-pointer overflow-hidden group"
        onClick={() => router.push(`/recipes/${recipe._id}`)}
      >
        {recipe.images && recipe.images.length > 0 ? (
          <>
            <Image
              src={recipe.images[0].url}
              alt={recipe.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
              <Button variant="secondary" size="sm" className="gap-1">
                View Recipe <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <Store className="h-12 w-12 text-gray-300" />
          </div>
        )}
        {recipe.difficulty && (
          <div className="absolute top-3 left-3">
            <Badge
              variant={recipe.difficulty === "hard" ? "default" : "secondary"}
              className={recipe.difficulty === "hard" ? "bg-primary/90" : ""}
            >
              {recipe.difficulty === "easy"
                ? "Easy"
                : recipe.difficulty === "medium"
                ? "Medium"
                : "Advanced"}
            </Badge>
          </div>
        )}
      </div>
      <CardContent className="p-5 flex-grow">
        <div className="flex gap-2 mb-2 flex-wrap">
          {recipe.cuisine && (
            <Badge variant="secondary" className="text-xs">
              {recipe.cuisine}
            </Badge>
          )}
          {recipe.category && (
            <Badge variant="outline" className="text-xs">
              {recipe.category}
            </Badge>
          )}
        </div>
        <h3 className="font-semibold text-lg mb-2 line-clamp-1 text-gray-900">
          {recipe.title}
        </h3>
        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
          {recipe.description}
        </p>
      </CardContent>
      <CardFooter className="px-5 py-4 border-t border-gray-100 flex justify-between items-center">
        <div className="flex items-center gap-1 text-sm text-gray-500">
          <Clock className="h-4 w-4" />
          <span>{recipe.prepTime + (recipe.cookTime || 0)} mins</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-1 group"
          onClick={() => router.push(`/recipes/${recipe._id}`)}
        >
          Details
          <ChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
        </Button>
      </CardFooter>
    </Card>
  );

  const renderListViewItem = (recipe: Recipe) => (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 bg-white border-gray-100">
      <div className="flex flex-col md:flex-row">
        <div
          className="relative h-48 md:h-auto md:w-48 flex-shrink-0 bg-gray-50 cursor-pointer overflow-hidden"
          onClick={() => router.push(`/recipes/${recipe._id}`)}
        >
          {recipe.images && recipe.images.length > 0 ? (
            <Image
              src={recipe.images[0].url}
              alt={recipe.title}
              fill
              sizes="(max-width: 768px) 100vw, 150px"
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <Store className="h-12 w-12 text-gray-300" />
            </div>
          )}
        </div>
        <div className="flex flex-col flex-grow p-5">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex gap-2 mb-2 flex-wrap">
                {recipe.difficulty && (
                  <Badge
                    variant={
                      recipe.difficulty === "hard" ? "default" : "secondary"
                    }
                    className={
                      recipe.difficulty === "hard" ? "bg-primary/90" : ""
                    }
                  >
                    {recipe.difficulty === "easy"
                      ? "Easy"
                      : recipe.difficulty === "medium"
                      ? "Medium"
                      : "Advanced"}
                  </Badge>
                )}
                {recipe.cuisine && (
                  <Badge variant="secondary" className="text-xs">
                    {recipe.cuisine}
                  </Badge>
                )}
                {recipe.category && (
                  <Badge variant="outline" className="text-xs">
                    {recipe.category}
                  </Badge>
                )}
              </div>
              <h3 className="font-semibold text-lg text-gray-900">
                {recipe.title}
              </h3>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-500 ml-4 flex-shrink-0">
              <Clock className="h-4 w-4" />
              <span>{recipe.prepTime + (recipe.cookTime || 0)} mins</span>
            </div>
          </div>

          <p className="text-gray-600 text-sm my-3 line-clamp-2">
            {recipe.description}
          </p>

          <div className="mt-auto pt-2 flex justify-end">
            <Button
              variant="outline"
              size="sm"
              className="gap-1 group"
              onClick={() => router.push(`/recipes/${recipe._id}`)}
            >
              View Details
              <ChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header navigation */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link href={`/shops/${id}`}>
            <Button variant="ghost" className="pl-0 mb-2 sm:mb-0">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Shop
            </Button>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("grid")}
            title="Grid View"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("list")}
            title="List View"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Shop header */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="p-6 flex flex-col md:flex-row md:items-center gap-4">
          <div className="h-16 w-16 md:h-24 md:w-24 relative rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
            {shop.logo?.url ? (
              <Image
                src={shop.logo.url}
                alt={shop.shopName}
                fill
                className="object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center">
                <Store className="h-8 w-8 text-gray-400" />
              </div>
            )}
          </div>

          <div className="flex-grow">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {shop.shopName} - Menu
            </h1>
            {shop.categories && shop.categories.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {shop.categories.map((category) => (
                  <Badge key={category} variant="secondary" className="text-sm">
                    {category}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search and filter bar */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search menu items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-[180px]">
                <div className="flex items-center">
                  <ArrowUpDown className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Sort by" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="prep-asc">Prep Time (Shortest)</SelectItem>
                <SelectItem value="prep-desc">Prep Time (Longest)</SelectItem>
                <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                <SelectItem value="name-desc">Name (Z-A)</SelectItem>
              </SelectContent>
            </Select>

            <Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span className="hidden sm:inline">Filters</span>
                  {totalActiveFilters > 0 && (
                    <Badge className="ml-1">{totalActiveFilters}</Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>Filter Menu Items</SheetTitle>
                  <SheetDescription>
                    Narrow down recipes based on your preferences
                  </SheetDescription>
                </SheetHeader>

                <div className="py-4">
                  <Accordion type="multiple" className="w-full">
                    {categories.length > 0 && (
                      <AccordionItem value="categories">
                        <AccordionTrigger>Categories</AccordionTrigger>
                        <AccordionContent>
                          <div className="flex flex-col gap-2 pl-1">
                            {categories.map((category) => (
                              <div
                                key={category}
                                className="flex items-center space-x-2"
                              >
                                <Checkbox
                                  id={`category-${category}`}
                                  checked={
                                    category
                                      ? categoryFilters.includes(category)
                                      : false
                                  }
                                  onCheckedChange={() =>
                                    category && toggleCategoryFilter(category)
                                  }
                                />
                                <label
                                  htmlFor={`category-${category}`}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  {category}
                                </label>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )}

                    {cuisines.length > 0 && (
                      <AccordionItem value="cuisines">
                        <AccordionTrigger>Cuisines</AccordionTrigger>
                        <AccordionContent>
                          <div className="flex flex-col gap-2 pl-1">
                            {cuisines.map((cuisine) => (
                              <div
                                key={cuisine}
                                className="flex items-center space-x-2"
                              >
                                <Checkbox
                                  id={`cuisine-${cuisine}`}
                                  checked={
                                    cuisine
                                      ? cuisineFilters.includes(cuisine)
                                      : false
                                  }
                                  onCheckedChange={() =>
                                    cuisine && toggleCuisineFilter(cuisine)
                                  }
                                />
                                <label
                                  htmlFor={`cuisine-${cuisine}`}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  {cuisine}
                                </label>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )}

                    {difficulties.length > 0 && (
                      <AccordionItem value="difficulty">
                        <AccordionTrigger>Difficulty</AccordionTrigger>
                        <AccordionContent>
                          <div className="flex flex-col gap-2 pl-1">
                            {difficulties.map((difficulty) => (
                              <div
                                key={difficulty}
                                className="flex items-center space-x-2"
                              >
                                <Checkbox
                                  id={`difficulty-${difficulty}`}
                                  checked={
                                    difficulty
                                      ? difficultyFilters.includes(difficulty)
                                      : false
                                  }
                                  onCheckedChange={() =>
                                    difficulty &&
                                    toggleDifficultyFilter(difficulty)
                                  }
                                />
                                <label
                                  htmlFor={`difficulty-${difficulty}`}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  {difficulty === "easy"
                                    ? "Easy"
                                    : difficulty === "medium"
                                    ? "Medium"
                                    : "Advanced"}
                                </label>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )}
                  </Accordion>
                </div>

                <SheetFooter className="flex flex-col sm:flex-row gap-3 sm:justify-between">
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    disabled={!hasActiveFilters}
                    className="w-full sm:w-auto"
                  >
                    Clear All
                  </Button>
                  <SheetClose asChild>
                    <Button className="w-full sm:w-auto">Apply Filters</Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>

            {hasActiveFilters && (
              <Button
                variant="outline"
                size="icon"
                onClick={clearFilters}
                title="Clear all filters"
              >
                <FilterX className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main content with tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-6 flex overflow-x-auto pb-1 -mx-1 px-1">
          <TabsTrigger value="all" className="flex-shrink-0">
            All Items
          </TabsTrigger>
          {Object.keys(recipesByCategory).map((category) => (
            <TabsTrigger
              key={category}
              value={category}
              className="flex-shrink-0"
            >
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all" className="mt-0">
          {filteredRecipes.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <p className="text-gray-500 mb-4">
                No menu items match your search criteria.
              </p>
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <p className="text-gray-500">
                  Showing {filteredRecipes.length} of {recipes.length} items
                </p>
              </div>

              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredRecipes.map((recipe, index) => (
                    <motion.div
                      key={recipe._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                    >
                      {renderGridViewItem(recipe)}
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {filteredRecipes.map((recipe, index) => (
                    <motion.div
                      key={recipe._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      {renderListViewItem(recipe)}
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          )}
        </TabsContent>

        {Object.entries(recipesByCategory).map(
          ([category, categoryRecipes]) => (
            <TabsContent key={category} value={category} className="mt-0">
              <div className="mb-4">
                <h2 className="text-xl font-semibold">{category}</h2>
                <p className="text-gray-500">
                  {categoryRecipes.length}{" "}
                  {categoryRecipes.length === 1 ? "item" : "items"}
                </p>
              </div>

              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryRecipes.map((recipe, index) => (
                    <motion.div
                      key={recipe._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                    >
                      {renderGridViewItem(recipe)}
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {categoryRecipes.map((recipe, index) => (
                    <motion.div
                      key={recipe._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      {renderListViewItem(recipe)}
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>
          )
        )}
      </Tabs>
    </div>
  );
}
