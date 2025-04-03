import mongoose from "mongoose";

const RecipeImageSchema = new mongoose.Schema({
  url: {
    type: String,
    default: "",
  },
  filename: {
    type: String,
    default: "",
  },
  caption: {
    type: String,
    default: "",
  },
  isPrimary: {
    type: Boolean,
    default: false,
  },
  order: {
    type: Number,
    default: 0,
  },
});

const RecipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide a recipe title"],
    maxlength: [100, "Recipe title cannot be more than 100 characters"],
  },
  description: {
    type: String,
    required: [true, "Please provide a recipe description"],
  },
  ingredients: {
    type: [String],
    required: [true, "Please provide recipe ingredients"],
  },
  directions: {
    type: [String],
    required: [true, "Please provide recipe directions"],
  },
  servings: {
    type: String,
    required: [true, "Please provide the number of servings"],
  },
  yield: {
    type: String,
  },
  prepTime: {
    type: Number,
    required: [true, "Please provide preparation time in minutes"],
  },
  cookTime: {
    type: Number,
  },
  notes: {
    type: String,
    default: "",
  },

  // Image and video fields
  images: {
    type: [RecipeImageSchema],
    default: [],
  },
  videoUrl: {
    type: String,
    default: "",
  },

  // Optional metadata fields
  author: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  tags: {
    type: [String],
    default: [],
  },
  category: {
    type: String,
  },
  cuisine: {
    type: String,
  },
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
  },
  isPublic: {
    type: Boolean,
    default: true,
  },
});

// Add a pre-save hook to update the updatedAt field
RecipeSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.models.Recipe || mongoose.model("Recipe", RecipeSchema);
