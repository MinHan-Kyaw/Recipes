import { Recipe } from "@/lib/types/recipe";
import RecipeItem from "./RecipeItem";
import RecipeLoadingSkeleton from "./RecipeLoadingSkeleton";

interface RecipesGridProps {
  meals: Recipe[];
  loading?: boolean;
}

export default function RecipesGrid({
  meals,
  loading = false,
}: RecipesGridProps) {
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
