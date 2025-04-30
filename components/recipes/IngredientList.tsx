import React, { useState, useRef } from "react";
import { X, GripVertical, Check, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { AnimatedButton } from "../AnimatedButton";

// Modern button component with animation using shadcn Button
// const AnimatedButton: React.FC<{
//   onClick: () => void;
//   className?: string;
//   icon?: React.ReactNode;
//   children: React.ReactNode;
//   isPrimary?: boolean;
//   variant?:
//     | "default"
//     | "outline"
//     | "secondary"
//     | "ghost"
//     | "link"
//     | "destructive";
// }> = ({
//   onClick,
//   className = "",
//   icon,
//   children,
//   isPrimary = false,
//   variant = "outline",
// }) => {
//   return (
//     <motion.div
//       whileHover={{ scale: 1.02 }}
//       whileTap={{ scale: 0.98 }}
//       transition={{ duration: 0.2 }}
//     >
//       <Button
//         onClick={onClick}
//         className={`gap-2 ${className}`}
//         variant={isPrimary ? "default" : variant}
//       >
//         {icon}
//         {children}
//       </Button>
//     </motion.div>
//   );
// };

// Extract dialog component with animations using shadcn Dialog
const BulkAddDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (ingredients: string[], e: React.MouseEvent) => void;
}> = ({ isOpen, onClose, onSubmit }) => {
  const [bulkIngredients, setBulkIngredients] = useState("");

  const handleSubmit = (e: React.MouseEvent) => {
    const newIngredients = bulkIngredients
      .split("\n")
      .map((ingredient) => ingredient.trim())
      .filter((ingredient) => ingredient !== "");
    onSubmit(newIngredients, e);
    setBulkIngredients("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-800">
            Add multiple ingredients
          </DialogTitle>
        </DialogHeader>

        <motion.p
          className="text-sm text-gray-600 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Paste your ingredient list here. Add one ingredient per line. Include
          the quantity (i.e. cups, tablespoons) and any special preparation
          (i.e. sifted, softened, chopped).
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Textarea
            className="min-h-[150px] resize-y mb-4 focus:border-primary focus:ring-1 focus:ring-primary"
            value={bulkIngredients}
            onChange={(e) => setBulkIngredients(e.target.value)}
            placeholder={`Example:\n2 cups of flour, sifted\n1 cup sugar\n2 tablespoons butter, softened`}
            rows={10}
          />
        </motion.div>

        <DialogFooter className="gap-3">
          <AnimatedButton onClick={onClose}>Cancel</AnimatedButton>
          <AnimatedButton onClick={handleSubmit} isPrimary variant="default">
            Submit
          </AnimatedButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Ingredient item component with animations
const IngredientItem: React.FC<{
  ingredient: string;
  index: number;
  isReorderMode: boolean;
  onUpdate: (index: number, value: string, e: React.MouseEvent) => void;
  onRemove: (index: number, e: React.MouseEvent) => void;
  dragHandleProps: any;
}> = ({
  ingredient,
  index,
  isReorderMode,
  onUpdate,
  onRemove,
  dragHandleProps,
}) => {
  return (
    <motion.div
      className={`flex items-center gap-2 p-3 rounded-lg ${
        isReorderMode
          ? "cursor-move bg-gray-50 border border-gray-200 shadow-sm"
          : "bg-white border border-gray-100"
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      exit={{ opacity: 0, x: -10 }}
      layout
      {...(isReorderMode ? dragHandleProps : {})}
      data-index={index}
      whileHover={{
        backgroundColor: isReorderMode
          ? "rgb(243, 244, 246)"
          : "rgb(249, 250, 251)",
        borderColor: "rgb(209, 213, 219)",
      }}
    >
      {isReorderMode ? (
        <>
          <GripVertical className="text-gray-400 cursor-move" size={20} />
          <span className="flex-1 text-sm text-gray-800">{ingredient}</span>
        </>
      ) : (
        <Input
          type="text"
          value={ingredient}
          onChange={(e) =>
            onUpdate(index, e.target.value, e as unknown as React.MouseEvent)
          }
          placeholder="e.g. 2 cups flour, sifted"
          className="flex-1 border-none bg-transparent text-sm p-0 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-0"
        />
      )}
      <motion.button
        type="button"
        onClick={(e) => onRemove(index, e as React.MouseEvent)}
        className="flex items-center justify-center bg-transparent border-none p-1 text-gray-400 cursor-pointer rounded-full hover:text-primary hover:bg-primary/10"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Remove ingredient"
      >
        <X size={18} />
      </motion.button>
    </motion.div>
  );
};

interface IngredientListProps {
  ingredients: string[];
  setIngredients: (ingredients: string[]) => void;
}

export const IngredientList: React.FC<IngredientListProps> = ({
  ingredients,
  setIngredients,
}) => {
  const [isReorderMode, setIsReorderMode] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const handleAddIngredient = (e: React.MouseEvent) => {
    e.preventDefault();
    setIngredients([...ingredients, ""]);
  };
  const handleRemoveIngredient = (index: number, e: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation(); // Stop event bubbling
    }
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(newIngredients);
  };

  const handleUpdateIngredient = (
    index: number,
    value: string,
    e: React.MouseEvent
  ) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation(); // Stop event bubbling
    }
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  const handleBulkAdd = (newIngredients: string[], e: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation(); // Stop event bubbling
    }
    setIngredients([...ingredients, ...newIngredients]);
    setIsDialogOpen(false);
  };

  // Improved drag and drop handlers
  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    index: number
  ) => {
    dragItem.current = index;
    e.currentTarget.classList.add("opacity-50");

    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = "move";
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const target = e.target as HTMLElement;
    const item = target.closest("[data-index]") as HTMLElement;

    if (item) {
      const index = Number(item.getAttribute("data-index"));
      dragOverItem.current = index;
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    if (
      dragItem.current !== null &&
      dragOverItem.current !== null &&
      dragItem.current !== dragOverItem.current
    ) {
      const newIngredients = [...ingredients];
      const draggedItemContent = newIngredients[dragItem.current];

      newIngredients.splice(dragItem.current, 1);
      newIngredients.splice(dragOverItem.current, 0, draggedItemContent);

      setIngredients(newIngredients);
    }

    dragItem.current = null;
    dragOverItem.current = null;

    if (listRef.current) {
      const items = listRef.current.querySelectorAll(".opacity-50");
      items.forEach((item) => item.classList.remove("opacity-50"));
    }
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove("opacity-50");

    dragItem.current = null;
    dragOverItem.current = null;
  };

  const toggleReorderMode = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsReorderMode(!isReorderMode);
  };
  return (
    <motion.div
      className="w-full flex flex-col gap-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header section */}
      <motion.div
        className="flex justify-between items-center text-gray-600 text-sm"
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <span>
          Enter ingredients below or{" "}
          <motion.button
            className="bg-transparent border-none p-0 text-primary underline cursor-pointer text-inherit"
            onClick={(e) => {
              e.preventDefault();
              setIsDialogOpen(true);
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Add several at once
          </motion.button>
        </span>
        <motion.button
          className={`flex items-center gap-2 py-2 px-4 border rounded-md bg-white text-xs font-semibold cursor-pointer ${
            isReorderMode
              ? "border-secondary text-secondary"
              : "border-primary text-primary hover:bg-primary/5"
          }`}
          onClick={toggleReorderMode}
          whileHover={{
            scale: 1.05,
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
          whileTap={{ scale: 0.95 }}
          initial={false}
          animate={
            isReorderMode
              ? {
                  backgroundColor: "rgba(76, 175, 80, 0.05)",
                }
              : {
                  backgroundColor: "white",
                }
          }
          transition={{ duration: 0.2 }}
        >
          {isReorderMode ? (
            <>
              <Check size={16} />
              DONE
            </>
          ) : (
            <>
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              >
                <path d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
              REORDER
            </>
          )}
        </motion.button>
      </motion.div>

      {/* Ingredients list */}
      <AnimatePresence>
        <motion.div
          className="flex flex-col gap-2"
          ref={listRef}
          onDragOver={isReorderMode ? handleDragOver : undefined}
          onDrop={isReorderMode ? handleDrop : undefined}
          layout
        >
          <AnimatePresence>
            {ingredients.map((ingredient, index) => (
              <IngredientItem
                key={index}
                ingredient={ingredient}
                index={index}
                isReorderMode={isReorderMode}
                onUpdate={handleUpdateIngredient}
                onRemove={handleRemoveIngredient}
                dragHandleProps={
                  isReorderMode
                    ? {
                        draggable: true,
                        onDragStart: (e: React.DragEvent<HTMLDivElement>) =>
                          handleDragStart(e, index),
                        onDragEnd: handleDragEnd,
                      }
                    : {}
                }
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      {/* Add ingredient button (visible only when not in reorder mode) */}
      {!isReorderMode && (
        <AnimatedButton
          onClick={(e) => {
            e.preventDefault();
            handleAddIngredient(e);
          }}
          className="text-sm bg-white hover:bg-primary/5 text-primary border-primary hover:text-primary"
          icon={<Plus size={16} />}
        >
          ADD INGREDIENT
        </AnimatedButton>
      )}
      {/* Bulk add dialog */}
      <BulkAddDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleBulkAdd}
      />
    </motion.div>
  );
};
