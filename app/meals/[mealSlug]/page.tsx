import Image from "next/image";
import { notFound } from "next/navigation";
import { getMeal } from "@/lib/utils/meals"; // Ensure this path is correct

interface MealParams {
  mealSlug: string;
}

interface GenerateMetadataParams {
  params: MealParams;
}

const ingredients = [
  "1 (8-ounce) package cream cheese, softened",
  "1 teaspoon onion powder",
  "1/4 cup sour cream, divided",
  "2 tablespoons canola oil",
  "1 pound 80/20 ground beef",
  "1 teaspoon kosher salt, plus more to taste",
  "1 (15-ounce) can chili with beans or 2 cups homemade chili with beans",
  "4 ounces pre-shredded Mexican-style 4-cheese blend (about 1 cup)",
  "1 green onion, sliced",
  "1 plum tomato, chopped (about 1/2 cup)",
  "1/4 cup crispy fried onions (such as French's)",
  "Corn chip scoops (such as Fritos Scoops), for serving",
];

export async function generateMetadata({ params }: GenerateMetadataParams) {
  const meal = getMeal(params.mealSlug);
  if (!meal) {
    notFound();
  }
  return {
    title: meal.title,
    description: meal.summary,
  };
}

interface MealDetailsPageProps {
  params: MealParams;
}

export default function MealDetailsPage({ params }: MealDetailsPageProps) {
  const meal = getMeal(params.mealSlug);
  if (!meal) {
    return <div>Meal not found</div>;
  }

  meal.instructions = meal.instructions.replace(/\n/g, "<br>");

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <header className="relative overflow-hidden bg-white">
        <div className="container mx-auto px-4 py-8 md:py-16">
          <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-center">
            {/* Image with animation */}
            <div className="relative w-full md:w-1/2 h-64 md:h-96 animate-[fadeIn_1s_ease-out]">
              <Image
                src={meal.image}
                alt={meal.title}
                fill
                className="object-cover rounded-2xl shadow-lg"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>

            {/* Text content with animation */}
            <div className="w-full md:w-1/2 space-y-4 animate-[fadeIn_1s_ease-out_0.3s]">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-amber-500 bg-clip-text text-transparent">
                {meal.title}
              </h1>
              <p className="text-lg text-rose-300 italic">
                by{" "}
                <a
                  href={`mailto:${meal.creator_email}`}
                  className="bg-gradient-to-r from-orange-500 to-amber-400 bg-clip-text text-transparent hover:text-shadow transition duration-300"
                >
                  {meal.creator}
                </a>
              </p>
              <p className="text-xl text-gray-700">{meal.summary}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Recipe Card */}
      <main className="container mx-auto px-4 py-8 md:py-16">
        <div className="relative bg-white rounded-2xl shadow-md p-8 max-w-4xl mx-auto animate-[fadeIn_1s_ease-out_0.6s]">
          {/* Recipe Title */}
          <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-white px-6 py-2 border border-dashed border-emerald-500 rounded-full">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-800">
              Recipe
            </h2>
          </div>

          {/* Time Information */}
          <div className="mt-8 mb-10">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg flex-1">
                <h3 className="text-sm font-medium text-emerald-600 mb-2">
                  PREP TIME
                </h3>
                <p className="text-lg font-medium text-gray-800">10 mins</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg flex-1">
                <h3 className="text-sm font-medium text-emerald-600 mb-2">
                  COOK TIME
                </h3>
                <p className="text-lg font-medium text-gray-800">35 mins</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg flex-1">
                <h3 className="text-sm font-medium text-emerald-600 mb-2">
                  TOTAL TIME
                </h3>
                <p className="text-lg font-medium text-gray-800">45 mins</p>
              </div>
            </div>
          </div>

          {/* Ingredients */}
          <div className="mb-10">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">
              Ingredients
            </h3>
            <ul className="space-y-3">
              {ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-start text-gray-700">
                  <span className="text-emerald-500 text-xl mr-3">•</span>
                  <span className="text-base">{ingredient}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Instructions (commented out in original code) */}
          {/* <div className="mb-10">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">Instructions</h3>
            <div 
              className="text-base text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: meal.instructions }}
            />
          </div> */}
        </div>
      </main>
    </div>
  );
}
