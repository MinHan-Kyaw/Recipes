import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import {
  addToFavorites,
  getFavorites,
  removeFromFavorites,
} from "@/lib/api/favorite";

interface FavoriteButtonProps {
  recipeId: string;
  className?: string;
  size?: "small" | "medium" | "large";
}

export default function FavoriteButton({
  recipeId,
  className = "",
  size = "medium",
}: FavoriteButtonProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    async function checkFavoriteStatus() {
      if (user?._id && recipeId) {
        try {
          const result = await getFavorites(user._id, recipeId);
          if (result.length > 0) {
            setIsFavorite(true);
          }
        } catch (error) {
          console.error("Error checking favorite status:", error);
        }
      }
    }

    checkFavoriteStatus();
  }, [user, recipeId]);

  const handleFavoriteToggle = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to save recipes to favorites.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      if (!user?._id || !recipeId) {
        throw new Error("User or recipe ID is missing");
      }

      if (isFavorite) {
        await removeFromFavorites(user._id, recipeId);
        setIsFavorite(false);
        toast({
          title: "Removed from favorites",
          description: "Recipe has been removed from your favorites.",
        });
      } else {
        await addToFavorites(user._id, recipeId, "");
        setIsFavorite(true);
        toast({
          title: "Added to favorites",
          description: "Recipe has been added to your favorites.",
        });
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast({
        title: "Error",
        description: "Failed to update favorites. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Determine size classes
  const sizeClasses = {
    small: "p-2",
    medium: "p-3",
    large: "p-4",
  };

  const iconSizes = {
    small: "h-4 w-4",
    medium: "h-6 w-6",
    large: "h-7 w-7",
  };

  return (
    <motion.button
      onClick={handleFavoriteToggle}
      disabled={isProcessing}
      whileTap={{ scale: 0.9 }}
      className={`
        ${sizeClasses[size]} rounded-full shadow-md transition-all duration-300
        ${isProcessing ? "opacity-70" : ""}
        ${
          isFavorite
            ? "bg-rose-500 text-white"
            : "bg-white/90 text-gray-500 hover:bg-white"
        }
        ${className}
      `}
    >
      <Heart
        className={`${iconSizes[size]} ${isFavorite ? "fill-white" : ""}`}
        strokeWidth={isFavorite ? 2 : 1.5}
      />
      {isFavorite && (
        <motion.div
          className="absolute inset-0 rounded-full bg-rose-500"
          initial={{ scale: 0 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 0.5 }}
        />
      )}
    </motion.button>
  );
}
