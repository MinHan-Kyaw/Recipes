"use client";

import React, { useState, useRef } from "react";
import {
  X,
  ChefHat,
  Pencil,
  Clock,
  Users,
  Book,
} from "lucide-react";
import { motion } from "framer-motion";
import { IngredientList } from "../../components/share/IngredientList";
import DirectionList from "../../components/share/DirectionList";
import { useRouter } from "next/navigation";

interface Recipe {
  title: string;
  description: string;
  ingredients: string[];
  directions: string[];
  servings: string;
  yield: string;
  prepTime: number;
  cookTime: number;
  notes: string;
}

// Animated button component with hover and tap effects
const AnimatedButton: React.FC<{
  onClick: () => void;
  className?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  isPrimary?: boolean;
  type?: "button" | "submit" | "reset";
}> = ({
  onClick,
  className = "",
  icon,
  children,
  isPrimary = false,
  type = "button",
}) => {
  return (
    <motion.button
      onClick={onClick}
      type={type}
      className={`inline-flex items-center gap-2 py-3 px-4 rounded-lg font-medium cursor-pointer ${
        isPrimary
          ? "bg-red-600 text-white hover:bg-red-700 shadow-sm"
          : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
      } ${className}`}
      whileHover={{ scale: 1.02, boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      {icon}
      {children}
    </motion.button>
  );
};

// Animated input field component
const AnimatedInput: React.FC<{
  id: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  label: string;
  icon?: React.ReactNode;
  type?: string;
  suffix?: string;
}> = ({
  id,
  name,
  value,
  onChange,
  placeholder,
  label,
  icon,
  type = "text",
  suffix,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.div
      className="mb-6"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      <div className="relative">
        <motion.div
          className={`absolute inset-0 rounded-lg border-2 ${
            isFocused ? "border-red-500" : "border-transparent"
          }`}
          animate={{
            boxShadow: isFocused
              ? "0 0 0 3px rgba(239, 68, 68, 0.2)"
              : "0 0 0 0px rgba(239, 68, 68, 0)",
          }}
          transition={{ duration: 0.2 }}
        />
        <div className="relative flex items-center">
          {icon && <div className="absolute left-3 text-gray-400">{icon}</div>}
          <input
            id={id}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`w-full ${icon ? "pl-10" : "pl-3"} pr-${
              suffix ? "12" : "3"
            } py-3 rounded-lg border border-gray-200 text-gray-800 focus:outline-none focus:border-red-500 transition-colors`}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          {suffix && (
            <div className="absolute right-3 text-gray-500">{suffix}</div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Animated textarea component
const AnimatedTextarea: React.FC<{
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  label: string;
  rows?: number;
}> = ({ id, name, value, onChange, placeholder, label, rows = 4 }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.div
      className="mb-6"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      <div className="relative">
        <motion.div
          className={`absolute inset-0 rounded-lg border-2 pointer-events-none ${
            isFocused ? "border-red-500" : "border-transparent"
          }`}
          animate={{
            boxShadow: isFocused
              ? "0 0 0 3px rgba(239, 68, 68, 0.2)"
              : "0 0 0 0px rgba(239, 68, 68, 0)",
          }}
          transition={{ duration: 0.2 }}
        />
        <textarea
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows}
          className="w-full px-3 py-3 rounded-lg border border-gray-200 text-gray-800 focus:outline-none focus:border-red-500 transition-colors resize-vertical relative z-10"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </div>
    </motion.div>
  );
};

// Main component
const CreateRecipe: React.FC = () => {
  const [recipe, setRecipe] = useState<Recipe>({
    title: "",
    description: "",
    ingredients: [],
    directions: [],
    servings: "",
    yield: "",
    prepTime: 0,
    cookTime: 0,
    notes: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setRecipe((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log(recipe);
  };

  const router = useRouter();

  const handleCancelClick = () => {
    router.push(`/meals`);
  };

  return (
    <motion.div
      className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1
        className="text-2xl font-bold text-gray-800 mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        Add a Recipe
      </motion.h1>

      <form onSubmit={handleSubmit}>
        {/* Recipe Title */}
        <AnimatedInput
          id="title"
          name="title"
          value={recipe.title}
          onChange={handleInputChange}
          placeholder="Give your recipe a title"
          label="Recipe Title"
          icon={<ChefHat size={20} />}
        />

        {/* Description */}
        <AnimatedTextarea
          id="description"
          name="description"
          value={recipe.description}
          onChange={handleInputChange}
          placeholder="Share the story behind your recipe and what makes it special."
          label="Description"
          rows={4}
        />

        {/* Ingredients Section */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Ingredients
          </h2>
          <IngredientList
            ingredients={recipe.ingredients}
            setIngredients={(ingredients: string[]) =>
              setRecipe((prev) => ({ ...prev, ingredients }))
            }
          />
        </motion.div>

        {/* Directions Section */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Directions
          </h2>
          <DirectionList
            directions={recipe.directions}
            setDirections={(directions) =>
              setRecipe((prev) => ({ ...prev, directions }))
            }
          />
        </motion.div>

        {/* Recipe Details Section */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <AnimatedInput
            id="servings"
            name="servings"
            value={recipe.servings}
            onChange={handleInputChange}
            placeholder="e.g. 8"
            label="Servings"
            icon={<Users size={20} />}
          />

          <AnimatedInput
            id="yield"
            name="yield"
            value={recipe.yield}
            onChange={handleInputChange}
            placeholder="e.g. 1 9-inch cake"
            label="Yield (Optional)"
            icon={<Book size={20} />}
          />

          <AnimatedInput
            id="prepTime"
            name="prepTime"
            value={recipe.prepTime}
            onChange={handleInputChange}
            type="number"
            label="Prep Time"
            icon={<Clock size={20} />}
            suffix="mins "
          />

          <AnimatedInput
            id="cookTime"
            name="cookTime"
            value={recipe.cookTime}
            onChange={handleInputChange}
            type="number"
            label="Cook Time (optional)"
            icon={<Clock size={20} />}
            suffix="mins "
          />
        </motion.div>

        {/* Notes */}
        <AnimatedTextarea
          id="notes"
          name="notes"
          value={recipe.notes}
          onChange={handleInputChange}
          placeholder="Add any helpful tips about ingredient substitutions, serving, or storage here."
          label="Notes (Optional)"
          rows={3}
        />

        {/* Submit Section */}
        <motion.div
          className="mt-8 flex justify-end gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <AnimatedButton onClick={handleCancelClick} icon={<X size={18} />}>
            Cancel
          </AnimatedButton>
          <AnimatedButton
            onClick={() => {}}
            isPrimary
            icon={<Pencil size={18} />}
            type="submit"
          >
            Submit Recipe
          </AnimatedButton>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default CreateRecipe;
