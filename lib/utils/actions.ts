"use server";

import { redirect } from "next/navigation";

import { saveMeal } from "./meals";
import { revalidatePath } from "next/cache";

function isInvalidText(text: string | null): boolean {
  return !text || text.trim() === "";
}

export async function shareMeal(formData: FormData) {
  const meal: {
    title: string | null;
    summary: string | null;
    instructions: string | null;
    image: File | null;
    creator: string | null;
    creator_email: string | null;
  } = {
    title: formData.get("title") as string | null,
    summary: formData.get("summary") as string | null,
    instructions: formData.get("instructions") as string | null,
    image: formData.get("image") as File | null,
    creator: formData.get("name") as string | null,
    creator_email: formData.get("email") as string | null,
  };

  if (
    isInvalidText(meal.title) ||
    isInvalidText(meal.summary) ||
    isInvalidText(meal.instructions) ||
    isInvalidText(meal.creator) ||
    isInvalidText(meal.creator_email) ||
    (meal.creator_email && !meal.creator_email.includes("@")) ||
    !meal.image ||
    (meal.image && meal.image.size === 0)
  ) {
    return {
      message: "Invalid input.",
    };
  }

  await saveMeal(meal);
  revalidatePath("/meals");
  redirect("/meals");
}
