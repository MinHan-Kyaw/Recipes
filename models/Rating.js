import mongoose from "mongoose";

const RatingSchema = new mongoose.Schema({
  recipe: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Recipe",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

RatingSchema.index({ recipe: 1, user: 1 }, { unique: true });

const Rating = mongoose.models.Rating || mongoose.model("Rating", RatingSchema);
export default Rating;
