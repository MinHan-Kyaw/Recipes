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
    <>
      {/* <header className="gap-12 mx-auto my-12 mb-20 w-[90%] max-w-6xl text-[#2e8b57] text-2xl">
        <h1 className="font-['Montserrat',_sans-serif]">
          Delicious meals, created{" "}
          <span className="bg-[#daa520] bg-clip-text text-transparent">
            by you
          </span>
        </h1>
        <p className="m-0">
          Choose your favorite recipe and cook it yourself! It is easy and fun!
        </p>
        <p className="mt-4">
          <Link
            href="/meals/share"
            className="inline-block py-2 px-4 rounded-lg bg-[#daa520] text-white font-bold no-underline hover:bg-[#b8860b]"
          >
            Share Your Favorite Recipe
          </Link>
        </p>
      </header> */}
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
    </>
  );
}
