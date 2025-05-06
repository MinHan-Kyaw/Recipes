import mongoose from "mongoose";

const ActivityLogSchema = new mongoose.Schema({
  // Who performed the action
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User ID is required"],
  },

  // User's name for easier display without needing to populate
  userName: {
    type: String,
    required: [true, "User name is required"],
  },

  // Type of action performed
  actionType: {
    type: String,
    enum: [
      "create",
      "update",
      "delete",
      "approve",
      "pending",
      "login",
      "register",
    ],
    required: [true, "Action type is required"],
  },

  // The entity type the action was performed on
  entityType: {
    type: String,
    enum: ["user", "shop", "recipe"],
    required: [true, "Entity type is required"],
  },

  // ID of the affected entity
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Entity ID is required"],
  },

  // Name/title of the entity for display purposes
  entityName: {
    type: String,
    required: [true, "Entity name is required"],
  },

  detail: {
    type: String,
    required: [true, "Detail is required"],
  },

  // Timestamp of when the action occurred
  timestamp: {
    type: Date,
    default: Date.now,
  }
});

// Add indexes for common queries
ActivityLogSchema.index({ timestamp: -1 }); // Sort by most recent
ActivityLogSchema.index({ entityType: 1, timestamp: -1 }); // Filter by entity type
ActivityLogSchema.index({ user: 1, timestamp: -1 }); // Filter by user

export default mongoose.models.ActivityLog ||
  mongoose.model("ActivityLog", ActivityLogSchema);
