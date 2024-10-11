import Image from "next/image";
import { notFound } from "next/navigation";
import { getMeal } from "@/lib/utils/meals"; // Ensure this path is correct
import classes from "./page.module.css";

interface MealParams {
  mealSlug: string;
}

interface GenerateMetadataParams {
  params: MealParams;
}
const ingredients = [
  "1 (8-ounce) package cream cheese, softened",
  "1 teaspoon onion powder",
  "1/4 cup sour cream, divided",
  "2 tablespoons canola oil",
  "1 pound 80/20 ground beef",
  "1 teaspoon kosher salt, plus more to taste",
  "1 (15-ounce) can chili with beans or 2 cups homemade chili with beans",
  "4 ounces pre-shredded Mexican-style 4-cheese blend (about 1 cup)",
  "1 green onion, sliced",
  "1 plum tomato, chopped (about 1/2 cup)",
  "1/4 cup crispy fried onions (such as French’s)",
  "Corn chip scoops (such as Fritos Scoops), for serving",
];
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

interface MealDetailsPageProps {
  params: MealParams;
}

export default function MealDetailsPage({ params }: MealDetailsPageProps) {
  const meal = getMeal(params.mealSlug);
  if (!meal) {
    return <div>Meal not found</div>;
  }

  meal.instructions = meal.instructions.replace(/\n/g, "<br>");

  return (
    <>
      <header className={classes.header}>
        <div className={classes.image}>
          <Image
            src={meal.image}
            alt={meal.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Adjust sizes as needed
          />
        </div>
        <div className={classes.headerText}>
          <h1>{meal.title}</h1>
          <p className={classes.creator}>
            by <a href={`mailto:${meal.creator_email}`}>{meal.creator}</a>
          </p>
          <p className={classes.summary}>{meal.summary}</p>
        </div>
      </header>
      <main>
        <div className={classes.recipeCard}>
          <h2 className={classes.recipeTitle}>Recipe</h2>
          <div className={classes.recipeInfo}>
            <div className={classes.timeInfo}>
              <div>
                <h3>PREP TIME</h3>
                <p>10 mins</p>
              </div>
              <div>
                <h3>COOK TIME</h3>
                <p>35 mins</p>
              </div>
              <div>
                <h3>TOTAL TIME</h3>
                <p>45 mins</p>
              </div>
            </div>
          </div>
          <div className={classes.ingredients}>
            <h3>Ingredients</h3>
            <ul className={classes.ingredientsList}>
              {ingredients.map((ingredient, index) => (
                <li key={index} className={classes.ingredientItem}>
                  <span className={classes.bullet}>•</span>
                  {ingredient}
                </li>
              ))}
            </ul>
          </div>
          {/* <div className={classes.instructions}>
            <h3>Instructions</h3>
            <p dangerouslySetInnerHTML={{ __html: meal.instructions }}></p>
          </div> */}
        </div>
      </main>
    </>
  );
}
