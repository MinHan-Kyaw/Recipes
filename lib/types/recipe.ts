// /lib/types/recipe.ts
export interface RecipeImage {
  id?: string;
  url: string;
  caption: string;
  isPrimary: boolean;
  order: number;
}

export interface Recipe {
  id?: string;
  title: string;
  description: string;
  ingredients: string[];
  directions: string[];
  servings: string;
  yield: string;
  prepTime: number;
  cookTime: number;
  notes: string;
  images: RecipeImage[];
  videoUrl: string;
  author?: string;
  createdAt?: Date;
  updatedAt?: Date;
  tags?: string[];
  category?: string;
  cuisine?: string;
  difficulty?: "easy" | "medium" | "hard";
  isPublic?: boolean;
}
