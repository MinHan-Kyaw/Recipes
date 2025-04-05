export interface User {
  _id?: string;
  name: string;
  email: string;
  password?: string; // Only used during signup/login, not typically stored in state
  avatar?: string; // URL to the user's profile image
  type: "admin" | "user";
  status: "unverified" | "verified";
  shops?: string[]; // Array of Shop IDs
  createdAt?: Date;
}

// For signup form state
export interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// For profile update data
export interface ProfileUpdateData {
  name?: string;
  email?: string;
  avatar?: string;
}
