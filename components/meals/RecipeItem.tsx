"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Clock, Star } from "lucide-react";
import { Recipe } from "@/lib/types/recipe";

interface RecipeItemProps {
  meal: Recipe;
}

export default function RecipeItem({ meal }: RecipeItemProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/recipes/${meal._id}`);
  };

  // Find the primary image or use the first one if no primary is set
  const primaryImage =
    meal.images.find((img) => img.isPrimary) || meal.images[0];

  // Calculate total time (prep + cook)
  const totalTime = meal.prepTime + meal.cookTime;

  return (
    <Card
      id={`meal-${meal._id}`}
      className="cursor-pointer h-full transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1"
      onClick={handleClick}
    >
      <CardHeader className="p-0">
        <motion.div
          className="relative w-full h-48 overflow-hidden"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
        >
          {primaryImage && (
            <Image
              src={primaryImage.url}
              alt={primaryImage.caption || meal.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 ease-in-out hover:scale-105"
            />
          )}
        </motion.div>
        <div className="p-4 pb-2">
          <h2 className="m-0 text-2xl font-['Montserrat'] text-primary">
            {meal.title}
          </h2>
          <p className="text-sm text-muted-foreground italic">
            {meal.authorDetails ? `by ${meal.authorDetails.name}` : ""}
          </p>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-base text-foreground/80 line-clamp-3">
          {meal.description}
        </p>
      </CardContent>
      <CardFooter className="text-left flex items-center text-primary justify-between">
        <div className="flex items-center mr-2">
          <div className="flex items-center space-x-1">
            <Star
              className={`h-4 w-4 ${
                meal.averageRating
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300"
              }`}
            />
            <span className="text-sm">
              {meal.averageRating ? meal.averageRating.toFixed(1) : "N/A"}
            </span>
          </div>
          {meal.ratingsCount && meal.ratingsCount > 0 && (
            <span className="text-xs text-gray-500 ml-1">
              ({meal.ratingsCount})
            </span>
          )}
        </div>
        <div className="flex items-center">
          <Clock className="mr-2 h-4 w-4" />
          <span>{totalTime} mins</span>
        </div>
        {meal.difficulty && (
          <span className="text-xs px-2 py-1 rounded-full bg-primary/10">
            {meal.difficulty}
          </span>
        )}
      </CardFooter>
    </Card>
  );
}
