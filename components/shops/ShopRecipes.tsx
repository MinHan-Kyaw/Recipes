"use client";

import React, { useEffect, useState } from "react";
import {
  Loader2,
  Utensils,
  Clock,
  ExternalLink,
  Star,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { fetchShopRecipes } from "@/lib/api/recipes";
import { Recipe } from "@/lib/types/recipe";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface ShopRecipesProps {
  shopId: string;
}

export function ShopRecipes({ shopId }: ShopRecipesProps) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function loadRecipes() {
      try {
        setLoading(true);
        const shopRecipes = await fetchShopRecipes(shopId);
        setRecipes(shopRecipes);
      } catch (error) {
        console.error("Failed to load recipes:", error);
      } finally {
        setLoading(false);
      }
    }

    loadRecipes();
  }, [shopId]);

  // Get unique categories from all recipes
  const categories = React.useMemo(() => {
    if (!recipes.length) return [];
    const allCategories = recipes
      .map((recipe) => recipe.category)
      .filter(Boolean);
    return Array.from(new Set(allCategories));
  }, [recipes]);

  const filteredRecipes = React.useMemo(() => {
    if (!filter) return recipes;
    return recipes.filter((recipe) => recipe.category === filter);
  }, [recipes, filter]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="flex flex-col items-center">
          <Loader2 className="animate-spin h-8 w-8 text-primary mb-4" />
          <p className="text-sm text-gray-500">Loading menu items...</p>
        </div>
      </div>
    );
  }

  if (recipes.length === 0) {
    return (
      <motion.div
        className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="bg-gray-50 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <Utensils className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-medium text-gray-800 mb-2">
          No Menu Items Yet
        </h3>
        <p className="text-gray-500 max-w-md mx-auto">
          This shop hasn&apos;t added any recipes to their menu yet. Check back
          later for delicious options!
        </p>
      </motion.div>
    );
  }

  return (
    <div className="py-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Menu Items</h2>
          <p className="text-gray-500">
            Discover {recipes.length} delicious recipes from this shop
          </p>
        </div>

        {categories.length > 0 && (
          <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
            <Badge
              variant={!filter ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setFilter(null)}
            >
              All
            </Badge>
            {categories.map((category) => (
              <Badge
                key={category}
                variant={filter === category ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => category && setFilter(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecipes.map((recipe, index) => (
          <motion.div
            key={recipe._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
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
                    <Utensils className="h-12 w-12 text-gray-300" />
                  </div>
                )}
                {recipe.difficulty === "hard" && (
                  <div className="absolute top-3 left-3">
                    <Badge variant="default" className="bg-primary/90">
                      Advanced
                    </Badge>
                  </div>
                )}
              </div>
              <CardContent className="p-5 flex-grow">
                {recipe.cuisine && (
                  <div className="mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {recipe.cuisine}
                    </Badge>
                  </div>
                )}
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
                  <ExternalLink className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
