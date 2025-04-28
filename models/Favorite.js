import mongoose from "mongoose";

const FavoriteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User ID is required"],
  },
  recipe: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Recipe",
    required: [true, "Recipe ID is required"],
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
  notes: {
    type: String,
    default: "",
  },
});

FavoriteSchema.index({ user: 1, recipe: 1 }, { unique: true });

export default mongoose.models.Favorite ||
  mongoose.model("Favorite", FavoriteSchema);
