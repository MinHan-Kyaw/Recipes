"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { motion } from "framer-motion";
import { XCircle } from "lucide-react";
import { Recipe } from "@/lib/types/recipe";
import { getFavoriteRecipes, removeFromFavorites } from "@/lib/api/favorite";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import RecipeItem from "@/components/meals/RecipeItem";

export default function FavoritesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [favorites, setFavorites] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFavorites() {
      if (!user?._id) {
        setLoading(false);
        return;
      }

      try {
        const favoritesData = await getFavoriteRecipes(user._id);
        setFavorites(favoritesData);
      } catch (error) {
        console.error("Error fetching favorites:", error);
        toast({
          title: "Error",
          description: "Failed to fetch your favorite recipes.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchFavorites();
  }, [user, toast]);

  const handleRemoveFavorite = async (
    recipeId: string,
    event: React.MouseEvent
  ) => {
    event.stopPropagation();

    if (!user?._id) return;

    setRemoving(recipeId);
    try {
      await removeFromFavorites(user._id, recipeId);
      setFavorites(favorites.filter((recipe) => recipe._id !== recipeId));
      toast({
        title: "Removed from favorites",
        description: "Recipe has been removed from your favorites.",
      });
    } catch (error) {
      console.error("Error removing favorite:", error);
      toast({
        title: "Error",
        description: "Failed to remove recipe from favorites.",
        variant: "destructive",
      });
    } finally {
      setRemoving(null);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-6">Favorites</h1>
        <p className="mb-8">You need to be signed in to view your favorites.</p>
        <Button onClick={() => router.push("/auth/signin")}>Sign In</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-primary">
        My Favorite Recipes
      </h1>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="h-96">
                <Skeleton className="w-full h-48" />
                <div className="mt-4">
                  <Skeleton className="w-3/4 h-8 mb-2" />
                  <Skeleton className="w-1/2 h-4 mb-4" />
                  <Skeleton className="w-full h-20" />
                  <div className="mt-4 flex justify-between">
                    <Skeleton className="w-20 h-6" />
                    <Skeleton className="w-20 h-6" />
                  </div>
                </div>
              </div>
            ))}
        </div>
      ) : favorites.length === 0 ? (
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold mb-4">No favorites yet</h2>
          <p className="text-gray-600 mb-8">
            You haven&apos;t added any recipes to your favorites.
          </p>
          <Button onClick={() => router.push("/recipes")}>
            Browse Recipes
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((recipe) => (
            <div key={recipe._id} className="relative group">
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                <RecipeItem meal={recipe} />
                <button
                  onClick={(e) =>
                    recipe._id && handleRemoveFavorite(recipe._id, e)
                  }
                  disabled={removing === recipe._id}
                  className={`
                    absolute top-2 right-2 p-2 rounded-full bg-white shadow-md 
                    opacity-0 group-hover:opacity-100 transition-opacity duration-300
                    ${
                      removing === recipe._id
                        ? "opacity-70 cursor-not-allowed"
                        : "hover:bg-red-50"
                    }
                  `}
                  aria-label="Remove from favorites"
                >
                  <XCircle className="h-5 w-5 text-red-500" />
                </button>
              </motion.div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
