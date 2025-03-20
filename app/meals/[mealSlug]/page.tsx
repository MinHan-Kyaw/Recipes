import { notFound } from "next/navigation";
import { getMeal } from "@/lib/utils/meals";
import MealDetails from '@/components/meals/MealDetails';

interface MealParams {
  mealSlug: string;
}

interface GenerateMetadataParams {
  params: MealParams;
}

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

export default async function MealPage({ params }: { params: { mealSlug: string } }) {
  const meal = await getMeal(params.mealSlug);
  
  if (!meal) {
    notFound();
  }
  
  return <MealDetails meal={meal} />;
}
