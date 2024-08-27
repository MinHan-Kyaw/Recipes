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
        <p
          className={classes.instructions}
          dangerouslySetInnerHTML={{ __html: meal.instructions }}
        ></p>
      </main>
    </>
  );
}
