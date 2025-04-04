import { notFound } from "next/navigation";
import RecipeDetails from "@/components/meals/RecipeDetails";
import { fetchRecipeById } from "@/lib/api/recipes";

export default async function MealPage({
  params,
}: {
  params: { mealSlug: string };
}) {
  const recipe = await fetchRecipeById(params.mealSlug);

  if (!recipe) {
    notFound();
  }

  return <RecipeDetails meal={recipe} />;
}
