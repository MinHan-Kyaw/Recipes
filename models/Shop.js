import mongoose from "mongoose";

const ShopLogo = new mongoose.Schema({
  url: {
    type: String,
    default: "",
  },
  filename: {
    type: String,
    default: "",
  },
});

const ShopSchema = new mongoose.Schema({
  shopName: {
    type: String,
    required: [true, "Please provide a shop name"],
    maxlength: [60, "Shop name cannot be more than 60 characters"],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Shop must have an owner"],
  },
  ownerName: {
    type: String,
    required: [true, "Please provide the owner name"],
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
  },
  phone: {
    type: String,
    required: [true, "Please provide a phone number"],
  },
  description: {
    type: String,
  },
  address: {
    type: String,
    required: [true, "Please provide an address"],
  },
  city: {
    type: String,
    required: [true, "Please provide a city"],
  },
  state: {
    type: String,
    required: [true, "Please provide a state"],
  },
  zipCode: {
    type: String,
    required: [true, "Please provide a ZIP code"],
  },
  country: {
    type: String,
    required: [true, "Please provide a country"],
  },
  businessHours: {
    type: String,
  },
  categories: {
    type: [String],
  },
  logo: {
    type: ShopLogo,
    default: {},
  },
  location: {
    type: {
      lat: {
        type: Number,
        required: [true, "Latitude is required"],
      },
      lng: {
        type: Number,
        required: [true, "Longitude is required"],
      },
    },
    default: { lat: 0, lng: 0 },
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Shop || mongoose.model("Shop", ShopSchema);
