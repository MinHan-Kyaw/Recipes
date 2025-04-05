import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"],
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
    match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: [6, "Password should be at least 6 characters"],
  },
  avatar: {
    type: String,
    default: "", // Empty string as default (no avatar)
  },
  type: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  status: {
    type: String,
    enum: ["unverified", "verified"],
    default: "unverified",
  },
  shops: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to check password
UserSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export default mongoose.models.User || mongoose.model("User", UserSchema);
