"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Recipe } from "@/lib/types/recipe";
import RatingsAndComments from "./RatingsAndComments";
import { useAuth } from "@/components/AuthProvider";
import FavoriteButton from "../FavoriteButton";

export default function MealDetails({ meal }: { meal: Recipe }) {
  const { user } = useAuth();

  if (!meal) {
    return <div>Meal not found</div>;
  }

  // Join directions array with line breaks instead of using instructions
  const formattedDirections = meal.directions?.join("<br><br>") || "";

  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // Get primary image or first image
  const primaryImage =
    meal.images?.find((img) => img.isPrimary)?.url ||
    meal.images?.[0]?.url ||
    "/placeholder-image.jpg";

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <header className="relative overflow-hidden bg-white">
        <div className="container mx-auto px-4 py-8 md:py-16">
          <div className="hidden md:block">
            {user && meal._id && (
              <div className="absolute top-4 right-4 z-10">
                <FavoriteButton recipeId={meal._id} size="medium" />
              </div>
            )}
          </div>
          <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-center">
            {/* Image with animation */}
            <motion.div
              className="relative w-full md:w-1/2 h-64 md:h-96"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Image
                src={primaryImage}
                alt={meal.title}
                fill
                className="object-cover rounded-2xl shadow-lg"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </motion.div>

            {/* Text content with animation */}
            <motion.div
              className="w-full md:w-1/2 space-y-4"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-primary">
                {meal.title}
              </h1>
              <div className="recipe-meta">
                {meal.authorDetails && (
                  <p className="recipe-author">by {meal.authorDetails.name}</p>
                )}
              </div>
              <p className="text-xl text-gray-700">{meal.description}</p>
            </motion.div>
          </div>
        </div>
        {/* Add floating favorite button for mobile */}
        <div className="md:hidden">
          {user && meal._id && (
            <div className="fixed bottom-6 right-6 z-30">
              <FavoriteButton recipeId={meal._id} size="large" />
            </div>
          )}
        </div>
      </header>

      {/* Recipe Card */}
      <main className="container mx-auto px-4 py-8 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-4xl mx-auto"
        >
          <Card className="relative">
            {/* Recipe Title Badge */}
            <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
              <Badge
                variant="outline"
                className="bg-white border-primary px-6 py-2"
              >
                <span className="text-sm font-bold uppercase tracking-wider text-gray-800">
                  Recipe
                </span>
              </Badge>
            </div>

            <CardHeader className="pt-10">
              {/* Time Information */}
              <motion.div
                className="mt-4"
                variants={stagger}
                initial="initial"
                animate="animate"
              >
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <motion.div
                    className="text-center p-4 bg-gray-50 rounded-lg flex-1"
                    variants={fadeInUp}
                  >
                    <h3 className="text-sm font-medium text-primary mb-2">
                      PREP TIME
                    </h3>
                    <p className="text-lg font-medium text-gray-800">
                      {meal.prepTime || 0} mins
                    </p>
                  </motion.div>
                  <motion.div
                    className="text-center p-4 bg-gray-50 rounded-lg flex-1"
                    variants={fadeInUp}
                  >
                    <h3 className="text-sm font-medium text-primary mb-2">
                      COOK TIME
                    </h3>
                    <p className="text-lg font-medium text-gray-800">
                      {meal.cookTime || 0} mins
                    </p>
                  </motion.div>
                  <motion.div
                    className="text-center p-4 bg-gray-50 rounded-lg flex-1"
                    variants={fadeInUp}
                  >
                    <h3 className="text-sm font-medium text-primary mb-2">
                      TOTAL TIME
                    </h3>
                    <p className="text-lg font-medium text-gray-800">
                      {(meal.prepTime || 0) + (meal.cookTime || 0)} mins
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            </CardHeader>

            <CardContent>
              {/* Servings and Yield */}
              <motion.div
                className="mb-8 flex gap-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                {meal.servings && (
                  <div>
                    <h3 className="text-sm font-medium text-primary mb-2">
                      SERVINGS
                    </h3>
                    <p className="text-lg font-medium text-gray-800">
                      {meal.servings}
                    </p>
                  </div>
                )}
                {meal.yield && (
                  <div>
                    <h3 className="text-sm font-medium text-primary mb-2">
                      YIELD
                    </h3>
                    <p className="text-lg font-medium text-gray-800">
                      {meal.yield}
                    </p>
                  </div>
                )}
              </motion.div>

              {/* Ingredients */}
              {meal.ingredients && meal.ingredients.length > 0 && (
                <motion.div
                  className="mb-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <h3 className="text-2xl font-semibold text-gray-800 mb-6">
                    Ingredients
                  </h3>
                  <motion.ul
                    className="space-y-3"
                    variants={stagger}
                    initial="initial"
                    animate="animate"
                  >
                    {meal.ingredients.map((ingredient, index) => (
                      <motion.li
                        key={index}
                        className="flex items-start text-gray-700"
                        variants={fadeInUp}
                      >
                        <span className="text-secondary text-xl mr-3">•</span>
                        <span className="text-base">{ingredient}</span>
                      </motion.li>
                    ))}
                  </motion.ul>
                </motion.div>
              )}

              {/* Directions (formerly Instructions) */}
              {meal.directions && meal.directions.length > 0 && (
                <motion.div
                  className="mb-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  <h3 className="text-2xl font-semibold text-gray-800 mb-6">
                    Directions
                  </h3>
                  <div
                    className="text-base text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: formattedDirections }}
                  />
                </motion.div>
              )}

              {/* Notes */}
              {meal.notes && (
                <motion.div
                  className="mb-10 bg-amber-50 p-5 rounded-lg border border-amber-100"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 1.0 }}
                >
                  <h3 className="text-xl font-semibold text-amber-800 mb-3">
                    Notes
                  </h3>
                  <p className="text-base text-amber-700">{meal.notes}</p>
                </motion.div>
              )}

              {/* Tags */}
              {meal.tags && meal.tags.length > 0 && (
                <motion.div
                  className="mt-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 1.1 }}
                >
                  <div className="flex flex-wrap gap-2">
                    {meal.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          className="max-w-4xl mx-auto mt-16"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <Card>
            <CardHeader>
              <h3 className="text-2xl font-semibold text-gray-800">
                Ratings & Reviews
              </h3>
            </CardHeader>
            <CardContent>
              {meal._id && <RatingsAndComments recipeId={meal._id} />}
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
