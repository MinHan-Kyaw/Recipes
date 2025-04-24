import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Clock, Edit, Plus, Trash2, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Recipe } from "@/lib/types/recipe";
import { ScrollArea } from "@/components/ui/scroll-area";

interface RecipeDetailsDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  mode: "view" | "add" | "edit" | "delete";
  selectedRecipe: Recipe | null;
  handleSubmit: () => Promise<void>;
  confirmDeleteRecipe: () => Promise<void>;
  handleEditRecipe: (recipe: Recipe) => void;
  formData: {
    title: string;
    description: string;
    ingredients: string[];
    directions: string[];
    servings: string;
    yield: string;
    prepTime: number;
    cookTime: number;
    notes: string;
    videoUrl: string;
    tags: string[];
    category: string;
    cuisine: string;
    difficulty: "easy" | "medium" | "hard";
    isPublic: boolean;
  };
  setFormData: React.Dispatch<
    React.SetStateAction<{
      title: string;
      description: string;
      ingredients: string[];
      directions: string[];
      servings: string;
      yield: string;
      prepTime: number;
      cookTime: number;
      notes: string;
      videoUrl: string;
      tags: string[];
      category: string;
      cuisine: string;
      difficulty: "easy" | "medium" | "hard";
      isPublic: boolean;
    }>
  >;
  errors: {
    title: string;
    description: string;
    ingredients: string;
    directions: string;
    servings: string;
    prepTime: string;
  };
}

export const RecipeDetailsDialog: React.FC<RecipeDetailsDialogProps> = ({
  isOpen,
  setIsOpen,
  mode,
  selectedRecipe,
  handleSubmit,
  confirmDeleteRecipe,
  handleEditRecipe,
  formData,
  setFormData,
  errors,
}) => {
  // State for ingredient and direction inputs
  const [newIngredient, setNewIngredient] = useState("");
  const [newDirection, setNewDirection] = useState("");
  const [newTag, setNewTag] = useState("");
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  // Common categories and cuisines
  const categories = [
    "Breakfast",
    "Lunch",
    "Dinner",
    "Appetizer",
    "Dessert",
    "Snack",
    "Soup",
    "Salad",
    "Bread",
    "Drink",
    "Other",
  ];

  const cuisines = [
    "American",
    "Italian",
    "Mexican",
    "Chinese",
    "Indian",
    "Thai",
    "Mediterranean",
    "French",
    "Japanese",
    "Spanish",
    "Greek",
    "Korean",
    "Vietnamese",
    "Middle Eastern",
    "Other",
  ];

  // Add ingredient handler
  const handleAddIngredient = () => {
    if (newIngredient.trim()) {
      setFormData({
        ...formData,
        ingredients: [...formData.ingredients, newIngredient.trim()],
      });
      setNewIngredient("");
    }
  };

  // Remove ingredient handler
  const handleRemoveIngredient = (index: number) => {
    const updatedIngredients = [...formData.ingredients];
    updatedIngredients.splice(index, 1);
    setFormData({
      ...formData,
      ingredients: updatedIngredients,
    });
  };

  // Add direction handler
  const handleAddDirection = () => {
    if (newDirection.trim()) {
      setFormData({
        ...formData,
        directions: [...formData.directions, newDirection.trim()],
      });
      setNewDirection("");
    }
  };

  // Remove direction handler
  const handleRemoveDirection = (index: number) => {
    const updatedDirections = [...formData.directions];
    updatedDirections.splice(index, 1);
    setFormData({
      ...formData,
      directions: updatedDirections,
    });
  };

  // Add tag handler
  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()],
      });
      setNewTag("");
    }
  };

  // Remove tag handler
  const handleRemoveTag = (index: number) => {
    const updatedTags = [...formData.tags];
    updatedTags.splice(index, 1);
    setFormData({
      ...formData,
      tags: updatedTags,
    });
  };

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle number input changes
  const handleNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    const value = parseInt(e.target.value) || 0;
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  // Handle select changes
  const handleSelectChange = (value: string, field: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  // Handle toggle changes
  const handleToggleChange = (field: string) => {
    setFormData({
      ...formData,
      [field]: !formData[field as keyof typeof formData],
    });
  };

  // Format time for display
  const formatTime = (minutes: number) => {
    if (!minutes) return "N/A";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours > 0) {
      return `${hours}h ${mins > 0 ? `${mins}m` : ""}`;
    }
    return `${mins}m`;
  };

  // Handle delete confirmation
  const handleDelete = () => {
    setIsDeleteConfirmOpen(true);
  };

  const totalTime = (formData.prepTime || 0) + (formData.cookTime || 0);

  // If mode is view, render view dialog
  if (mode === "view" && selectedRecipe) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {selectedRecipe.title}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh] pr-4">
            <div className="space-y-6">
              {/* Description */}
              <div>
                <p className="text-gray-700">{selectedRecipe.description}</p>
              </div>

              {/* Meta Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">
                    Servings
                  </h4>
                  <p>{selectedRecipe.servings || "N/A"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">
                    Prep Time
                  </h4>
                  <p>{formatTime(selectedRecipe.prepTime)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">
                    Cook Time
                  </h4>
                  <p>{formatTime(selectedRecipe.cookTime)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">
                    Total Time
                  </h4>
                  <p>
                    {formatTime(
                      (selectedRecipe.prepTime || 0) +
                        (selectedRecipe.cookTime || 0)
                    )}
                  </p>
                </div>
              </div>

              {/* Category & Cuisine */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">
                    Category
                  </h4>
                  <p className="capitalize">
                    {selectedRecipe.category || "N/A"}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Cuisine</h4>
                  <p className="capitalize">
                    {selectedRecipe.cuisine || "N/A"}
                  </p>
                </div>
              </div>

              {/* Tags */}
              {selectedRecipe.tags && selectedRecipe.tags.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Tags</h4>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedRecipe.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Ingredients */}
              <div>
                <h3 className="text-lg font-medium mb-2">Ingredients</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {selectedRecipe.ingredients &&
                    selectedRecipe.ingredients.map((ingredient, index) => (
                      <li key={index}>{ingredient}</li>
                    ))}
                </ul>
              </div>

              {/* Directions */}
              <div>
                <h3 className="text-lg font-medium mb-2">Directions</h3>
                <ol className="list-decimal pl-5 space-y-2">
                  {selectedRecipe.directions &&
                    selectedRecipe.directions.map((direction, index) => (
                      <li key={index} className="pl-1">
                        {direction}
                      </li>
                    ))}
                </ol>
              </div>

              {/* Notes */}
              {selectedRecipe.notes && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Notes</h3>
                  <p className="text-gray-700">{selectedRecipe.notes}</p>
                </div>
              )}

              {/* Video URL */}
              {selectedRecipe.videoUrl && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Video</h3>
                  <a
                    href={selectedRecipe.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline break-all"
                  >
                    {selectedRecipe.videoUrl}
                  </a>
                </div>
              )}
            </div>
          </ScrollArea>
          <DialogFooter className="sm:justify-between">
            <div className="flex items-center gap-2">
              <Badge variant={selectedRecipe.isPublic ? "default" : "outline"}>
                {selectedRecipe.isPublic ? "Public" : "Private"}
              </Badge>
              <Badge
                variant="secondary"
                className={
                  selectedRecipe.difficulty === "easy"
                    ? "bg-green-100 text-green-800"
                    : selectedRecipe.difficulty === "medium"
                    ? "bg-orange-100 text-orange-800"
                    : "bg-red-100 text-red-800"
                }
              >
                {selectedRecipe.difficulty || "Easy"}
              </Badge>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Close
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  if (selectedRecipe) handleEditRecipe(selectedRecipe);
                }}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // If mode is delete, render delete confirmation dialog
  if (mode === "delete") {
    return (
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Recipe</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &ldquo;{selectedRecipe?.title}
              &rdquo;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteRecipe}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  // If mode is add or edit, render form dialog
  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {mode === "add" ? "Add New Recipe" : "Edit Recipe"}
            </DialogTitle>
            <DialogDescription>
              {mode === "add"
                ? "Create a new recipe with details, ingredients, and directions"
                : "Update your recipe with new information"}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh] pr-4">
            <div className="space-y-6 py-4">
              {/* Basic Information */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">
                    Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Recipe Title"
                    className={errors.title ? "border-red-500" : ""}
                  />
                  {errors.title && (
                    <p className="text-sm text-red-500 mt-1">{errors.title}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="description">
                    Description <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Brief description of the recipe"
                    className={errors.description ? "border-red-500" : ""}
                    rows={3}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Servings and Times */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="servings">
                    Servings <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="servings"
                    name="servings"
                    value={formData.servings}
                    onChange={handleInputChange}
                    placeholder="e.g., 4 servings"
                    className={errors.servings ? "border-red-500" : ""}
                  />
                  {errors.servings && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.servings}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="yield">Yield</Label>
                  <Input
                    id="yield"
                    name="yield"
                    value={formData.yield}
                    onChange={handleInputChange}
                    placeholder="e.g., 12 cookies"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="prepTime">
                    Prep Time (minutes) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="prepTime"
                    type="number"
                    min="0"
                    value={formData.prepTime}
                    onChange={(e) => handleNumberChange(e, "prepTime")}
                    placeholder="30"
                    className={errors.prepTime ? "border-red-500" : ""}
                  />
                  {errors.prepTime && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.prepTime}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="cookTime">Cook Time (minutes)</Label>
                  <Input
                    id="cookTime"
                    type="number"
                    min="0"
                    value={formData.cookTime}
                    onChange={(e) => handleNumberChange(e, "cookTime")}
                    placeholder="45"
                  />
                </div>
              </div>

              {/* Total Time Calculation */}
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-gray-500">
                  Total Time: {formatTime(totalTime)}
                </span>
              </div>

              {/* Category and Cuisine */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      handleSelectChange(value, "category")
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem
                          key={category}
                          value={category.toLowerCase()}
                        >
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="cuisine">Cuisine</Label>
                  <Select
                    value={formData.cuisine}
                    onValueChange={(value) =>
                      handleSelectChange(value, "cuisine")
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select cuisine" />
                    </SelectTrigger>
                    <SelectContent>
                      {cuisines.map((cuisine) => (
                        <SelectItem key={cuisine} value={cuisine.toLowerCase()}>
                          {cuisine}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Difficulty */}
              <div>
                <Label htmlFor="difficulty">Difficulty</Label>
                <Select
                  value={formData.difficulty}
                  onValueChange={(value) =>
                    handleSelectChange(
                      value as "easy" | "medium" | "hard",
                      "difficulty"
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Ingredients Section */}
              <div>
                <Label>
                  Ingredients <span className="text-red-500">*</span>
                </Label>
                <div className="flex items-center gap-2 mt-2">
                  <Input
                    placeholder="Add an ingredient"
                    value={newIngredient}
                    onChange={(e) => setNewIngredient(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddIngredient();
                      }
                    }}
                    className={errors.ingredients ? "border-red-500" : ""}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddIngredient}
                    className="shrink-0"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {errors.ingredients && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.ingredients}
                  </p>
                )}
                <ul className="mt-3 space-y-2">
                  {formData.ingredients.map((ingredient, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between gap-2 py-2 px-3 bg-gray-50 rounded-md"
                    >
                      <span className="flex-grow">{ingredient}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveIngredient(index)}
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Directions Section */}
              <div>
                <Label>
                  Directions <span className="text-red-500">*</span>
                </Label>
                <div className="flex items-center gap-2 mt-2">
                  <Textarea
                    placeholder="Add a direction step"
                    value={newDirection}
                    onChange={(e) => setNewDirection(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && e.ctrlKey) {
                        e.preventDefault();
                        handleAddDirection();
                      }
                    }}
                    className={errors.directions ? "border-red-500" : ""}
                    rows={2}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddDirection}
                    className="shrink-0 self-start mt-1"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {errors.directions && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.directions}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Press Ctrl+Enter to add a new step
                </p>
                <ol className="mt-3 space-y-2 list-decimal list-inside">
                  {formData.directions.map((direction, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 py-2 px-3 bg-gray-50 rounded-md"
                    >
                      <span className="flex-grow pl-1">{direction}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveDirection(index)}
                        className="h-8 w-8 p-0 shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Tags Section */}
              <div>
                <Label htmlFor="tags">Tags</Label>
                <div className="flex items-center gap-2 mt-2">
                  <Input
                    id="tags"
                    placeholder="Add a tag"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddTag}
                    className="shrink-0"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {tag}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveTag(index)}
                        className="h-4 w-4 p-0 ml-1"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Additional Details */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Additional notes or tips about the recipe"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="videoUrl">Video URL</Label>
                  <Input
                    id="videoUrl"
                    name="videoUrl"
                    value={formData.videoUrl}
                    onChange={handleInputChange}
                    placeholder="Link to a video of this recipe"
                  />
                </div>
              </div>

              {/* Visibility */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={formData.isPublic}
                  onChange={() => handleToggleChange("isPublic")}
                  className="h-4 w-4"
                />
                <Label htmlFor="isPublic" className="cursor-pointer text-sm">
                  Make this recipe public
                </Label>
              </div>
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            {mode === "edit" && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                className="mr-auto"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            )}
            <Button type="button" onClick={handleSubmit}>
              {mode === "add" ? "Create Recipe" : "Update Recipe"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Recipe</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &ldquo;{selectedRecipe?.title}
              &rdquo;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                confirmDeleteRecipe();
                setIsDeleteConfirmOpen(false);
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
