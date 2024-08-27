import fs from "fs";

import sql from "better-sqlite3";
import slugify from "slugify";
import xss from "xss";

const db = sql("meals.db");

// Define the Meal type
export interface Meal {
  title: string;
  summary: string;
  instructions: string;
  image: string;
  creator: string;
  creator_email: string;
  slug?: string; // Optional, since it is generated
}

export async function getMeals(): Promise<Meal[]> {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  //   throw new Error("Loading meals failed");
  return db.prepare("SELECT * FROM meals").all()as Meal[];
}

export function getMeal(slug: string): Meal | undefined { 
  return db.prepare("SELECT * FROM meals WHERE slug = ?").get(slug) as Meal | undefined;
}

export async function saveMeal(meal: any) {
  meal.slug = slugify(meal.title, { lower: true });
  meal.instructions = xss(meal.instructions);

  const extension = meal.image.name.split(".").pop();
  const fileName = `${meal.slug}.${extension}`;

  const stream = fs.createWriteStream(`public/images/${fileName}`);
  const bufferedImage = await meal.image.arrayBuffer();

  stream.write(Buffer.from(bufferedImage), (error) => {
    if (error) {
      throw new Error("Saving iamge failed");
    }
  });

  meal.image = `/images/${fileName}`;
  db.prepare(
    `
      INSERT INTO meals
      (title, summary, instructions, creator, creator_email, image, slug)
      VALUES (
        @title,
        @summary,
        @instructions,
        @creator,
        @creator_email,
        @image,
        @slug
      )
    `
  ).run(meal);
}
