// lib/types/recipe.ts
export interface RecipeImage {
  url: string;
  filename?: string;
  caption: string;
  isPrimary: boolean;
  order: number;
  isLocal?: boolean; // Flag to identify local images that need uploading
}

export interface Recipe {
  _id?: string;
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
  author?: {
    id: string;
    name: string;
  }
  createdAt?: Date;
  updatedAt?: Date;
  tags?: string[];
  category?: string;
  cuisine?: string;
  difficulty?: "easy" | "medium" | "hard";
  isPublic?: boolean;
  authorDetails?: {
    name: string;
  };
  shop?: string | null;
}
