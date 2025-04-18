import { Suspense } from "react";
import RecipesGrid from "@/components/meals/RecipesGrid";
import { getAllRecipes } from "@/lib/api/recipes";

async function Recipes() {
  const recipes = await getAllRecipes();
  console.log("Recipes:", recipes);
  return <RecipesGrid meals={recipes} />;
}

export default function RecipesPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-center mb-6">All Recipes</h1>
      <Suspense
        fallback={
          <div className="text-center">
            <RecipesGrid loading={true} meals={[]} />
          </div>
        }
      >
        <Recipes />
      </Suspense>
    </main>
  );
}
