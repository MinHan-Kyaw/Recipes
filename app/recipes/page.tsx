import { Suspense } from "react";
import { Recipe } from "@/lib/types/recipe";
import RecipeItem from "@/components/meals/RecipeItem";
import RecipeLoadingSkeleton from "@/components/meals/RecipeLoadingSkeleton";
import { getAllRecipes } from "@/lib/api/recipes";

// RecipesGrid functionality directly in the page
function RecipesGrid({
  meals,
  loading = false,
}: {
  meals: Recipe[];
  loading?: boolean;
}) {
  const gridClasses =
    "w-[90%] max-w-[90rem] grid grid-cols-[repeat(auto-fill,minmax(15rem,1fr))] gap-8 mx-auto my-8 list-none p-0";

  if (loading) {
    return (
      <ul className={gridClasses}>
        {[...Array(8)].map((_, index) => (
          <li key={index}>
            <RecipeLoadingSkeleton />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul className={gridClasses}>
      {meals && meals.length > 0 ? (
        meals.map((meal) => (
          <li key={meal._id}>
            <RecipeItem meal={meal} />
          </li>
        ))
      ) : (
        <li className="col-span-full text-center py-8">
          No recipes found. Be the first to add one!
        </li>
      )}
    </ul>
  );
}

// Async component to fetch recipes
async function Recipes() {
  const recipes = await getAllRecipes();
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

export const dynamic = "force-dynamic";
