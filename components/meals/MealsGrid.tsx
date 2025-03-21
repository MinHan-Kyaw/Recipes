import MealItem from "./MealItem";
import MealLoadingSkeleton from "./MealLoadingSkeleton";
import { Meal } from "@/lib/utils/meals";

interface MealsGridProps {
  meals: Meal[];
  loading?: boolean;
}

export default function MealsGrid({ meals, loading = false }: MealsGridProps) {
  const gridClasses =
    "w-[90%] max-w-[90rem] grid grid-cols-[repeat(auto-fill,minmax(15rem,1fr))] gap-8 mx-auto my-8 list-none p-0";
  if (loading) {
    return (
      <ul className={gridClasses}>
        {[...Array(8)].map((_, index) => (
          <li key={index}>
            <MealLoadingSkeleton />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul className={gridClasses}>
      {meals.map((meal) => (
        <li key={meal.id}>
          <MealItem {...meal} />
        </li>
      ))}
    </ul>
  );
}
