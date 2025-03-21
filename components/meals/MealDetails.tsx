"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Meal {
  title: string;
  image: string;
  creator: string;
  creator_email: string;
  summary: string;
  instructions: string;
}

const ingredients = [
  "1 (8-ounce) package cream cheese, softened",
  "1 teaspoon onion powder",
  "1/4 cup sour cream, divided",
  "2 tablespoons canola oil",
  "1 pound 80/20 ground beef",
  "1 teaspoon kosher salt, plus more to taste",
  "4 ounces pre-shredded Mexican-style 4-cheese blend (about 1 cup)",
  "1 green onion, sliced",
  "1 plum tomato, chopped (about 1/2 cup)",
  "1/4 cup crispy fried onions (such as French's)",
  "Corn chip scoops (such as Fritos Scoops), for serving",
];

export default function MealDetailsPage({ meal }: { meal: Meal }) {
  if (!meal) {
    return <div>Meal not found</div>;
  }

  meal.instructions = meal.instructions.replace(/\n/g, "<br>");
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

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <header className="relative overflow-hidden bg-white">
        <div className="container mx-auto px-4 py-8 md:py-16">
          <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-center">
            {/* Image with animation */}
            <motion.div
              className="relative w-full md:w-1/2 h-64 md:h-96"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Image
                src={meal.image}
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
              <p className="text-lg text-secondary italic">
                by{" "}
                <a
                  href={`mailto:${meal.creator_email}`}
                  className="text-accent hover:underline transition duration-300"
                >
                  {meal.creator}
                </a>
              </p>
              <p className="text-xl text-gray-700">{meal.summary}</p>
            </motion.div>
          </div>
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
                    <p className="text-lg font-medium text-gray-800">10 mins</p>
                  </motion.div>
                  <motion.div
                    className="text-center p-4 bg-gray-50 rounded-lg flex-1"
                    variants={fadeInUp}
                  >
                    <h3 className="text-sm font-medium text-primary mb-2">
                      COOK TIME
                    </h3>
                    <p className="text-lg font-medium text-gray-800">35 mins</p>
                  </motion.div>
                  <motion.div
                    className="text-center p-4 bg-gray-50 rounded-lg flex-1"
                    variants={fadeInUp}
                  >
                    <h3 className="text-sm font-medium text-primary mb-2">
                      TOTAL TIME
                    </h3>
                    <p className="text-lg font-medium text-gray-800">45 mins</p>
                  </motion.div>
                </div>
              </motion.div>
            </CardHeader>

            <CardContent>
              {/* Ingredients */}
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
                  {ingredients.map((ingredient, index) => (
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

              {/* Instructions (commented out in original code) */}
              {/* <div className="mb-10">
                <h3 className="text-2xl font-semibold text-gray-800 mb-6">Instructions</h3>
                <div 
                  className="text-base text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: meal.instructions }}
                />
              </div> */}
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
