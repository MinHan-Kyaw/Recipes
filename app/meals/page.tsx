import Link from "next/link";
import { Suspense } from "react";
import MealsGrid from "@/components/meals/MealsGrid";
import { getMeals } from "@/lib/utils/meals";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Meals",
  description: "Browse the most delicious meals shared by our community.",
};

async function Meals() {
  const meals = await getMeals();
  return <MealsGrid meals={meals} />;
}

export default function MealsPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <Suspense
        fallback={
          <div className="text-center animate-[loading_1.2s_ease-in-out_infinite]">
            <MealsGrid loading={true} meals={[]} />
          </div>
        }
      >
        <Meals />
      </Suspense>
    </main>
  );
}
