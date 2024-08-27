import MealItem from "./MealItem";
import classes from "./meals-grid.module.css";

export default function MealsGrid({ meals }: { meals: any[] }) {
console.log(meals);
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
