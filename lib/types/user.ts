export interface User {
  id?: string;
  name: string;
  email: string;
  password?: string; // Only used during signup/login, not typically stored in state
  createdAt?: Date;
  updatedAt?: Date;
  isAdmin?: boolean;
  isVerified?: boolean;
  profileImage?: string;
}

// For signup form state
export interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}
