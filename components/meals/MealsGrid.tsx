import classes from "./MealsGrid.module.css";
import MealItem from "./MealItem";
import MealLoadingSkeleton from "./MealLoadingSkeleton";
import { Meal } from "@/lib/utils/meals";

interface MealsGridProps {
  meals: Meal[];
  loading?: boolean;
}

export default function MealsGrid({ meals, loading = false }: MealsGridProps) {
  if (loading) {
    return (
      <ul className={classes.meals}>
        {[...Array(6)].map((_, index) => (
          <li key={index}>
            <MealLoadingSkeleton />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul className={classes.meals}>
      {meals.map((meal) => (
        <li key={meal.id}>
          <MealItem {...meal} />
        </li>
      ))}
    </ul>
  );
}
