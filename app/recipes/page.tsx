"use client";

import { Suspense, useState } from "react";
import { Recipe } from "@/lib/types/recipe";
import RecipeItem from "@/components/meals/RecipeItem";
import RecipeLoadingSkeleton from "@/components/meals/RecipeLoadingSkeleton";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import SearchBar from "@/components/recipes/SearchBar";
import { getAllRecipes } from "@/lib/api/recipes";

// RecipesGrid functionality directly in the page
function RecipesGrid({
  meals,
  loading = false,
}: {
  meals: Recipe[];
  loading?: boolean;
}) {
  const gridClasses =
    "w-[90%] max-w-[90rem] grid grid-cols-[repeat(auto-fill,minmax(15rem,1fr))] gap-8 mx-auto my-8 list-none p-0";

  if (loading) {
    return (
      <ul className={gridClasses}>
        {[...Array(8)].map((_, index) => (
          <li key={index}>
            <RecipeLoadingSkeleton />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul className={gridClasses}>
      {meals && meals.length > 0 ? (
        meals.map((meal) => (
          <li key={meal._id}>
            <RecipeItem meal={meal} />
          </li>
        ))
      ) : (
        <li className="col-span-full text-center text-gray-500 text-lg">
          No recipes found. Be the first to add one!
        </li>
      )}
    </ul>
  );
}

// Client component for handling search functionality
export default function RecipesPageClient() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Function to fetch recipes with optional search query
  const fetchRecipes = async (searchQuery?: string) => {
    setLoading(true);
    try {
      const data = await getAllRecipes(searchQuery);
      if (data) {
        setRecipes(data);
      }
    } catch (error) {
      console.error("Error fetching recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle search submission
  const handleSearch = (query: string) => {
    // Update URL with search query
    const params = new URLSearchParams(searchParams);
    if (query) {
      params.set("search", query);
    } else {
      params.delete("search");
    }

    router.push(`${pathname}?${params.toString()}`);
    fetchRecipes(query);
  };

  // Initial fetch on component mount
  useState(() => {
    const currentSearch = searchParams.get("search") || "";
    fetchRecipes(currentSearch);
  });

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-8">All Recipes</h1>

      {/* Search bar component */}
      <SearchBar
        onSearch={handleSearch}
        placeholder="Search recipes by title..."
      />

      <RecipesGrid meals={recipes} loading={loading} />
    </div>
  );
}

// Export for server component page
export function RecipesPage() {
  return (
    <Suspense fallback={<RecipesGrid meals={[]} loading={true} />}>
      <RecipesPageClient />
    </Suspense>
  );
}

export const dynamic = "force-dynamic";
