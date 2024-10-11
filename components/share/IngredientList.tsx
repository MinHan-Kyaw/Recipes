import React, { useState } from 'react';
import styles from './IngredientList.module.css';
import { X, GripVertical, Check } from 'lucide-react';

interface IngredientListProps {
  ingredients: string[];
  setIngredients: (ingredients: string[]) => void;
}

const IngredientList: React.FC<IngredientListProps> = ({ ingredients, setIngredients }) => {
  const [isReorderMode, setIsReorderMode] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [bulkIngredients, setBulkIngredients] = useState('');

  const addIngredient = () => {
    setIngredients([...ingredients, '']);
  };

  const removeIngredient = (index: number) => {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(newIngredients);
  };

  const updateIngredient = (index: number, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    setDraggedIndex(index);
    e.currentTarget.classList.add(styles.dragging);
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    setDraggedIndex(null);
    e.currentTarget.classList.remove(styles.dragging);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    if (draggedIndex === null) return;

    if (draggedIndex !== index) {
      const newIngredients = [...ingredients];
      const [removed] = newIngredients.splice(draggedIndex, 1);
      newIngredients.splice(index, 0, removed);
      setIngredients(newIngredients);
      setDraggedIndex(index);
    }
  };

  const toggleReorderMode = () => {
    setIsReorderMode(!isReorderMode);
  };

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setBulkIngredients('');
  };

  const handleBulkAdd = () => {
    const newIngredients = bulkIngredients.split('\n').filter(ingredient => ingredient.trim() !== '');
    setIngredients([...ingredients, ...newIngredients]);
    closeDialog();
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span>Enter ingredients below or <button className={styles.textButton} onClick={openDialog}>Add several at once</button></span>
        <button 
          className={`${styles.reorderButton} ${isReorderMode ? styles.doneButton : ''}`}
          onClick={toggleReorderMode}
        >
          {isReorderMode ? (
            <>
              <Check size={16} />
              DONE
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none">
                <path d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
              REORDER
            </>
          )}
        </button>
      </div>

      <div className={styles.ingredientList}>
        {ingredients.map((ingredient, index) => (
          <div
            key={index}
            className={`${styles.ingredientItem} ${isReorderMode ? styles.reorderMode : ''}`}
            draggable={isReorderMode}
            onDragStart={(e) => handleDragStart(e, index)}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => handleDragOver(e, index)}
          >
            {isReorderMode ? (
              <>
                <GripVertical className={styles.dragHandle} size={20} />
                <span className={styles.ingredientText}>{ingredient}</span>
              </>
            ) : (
              <input
                type="text"
                value={ingredient}
                onChange={(e) => updateIngredient(index, e.target.value)}
                placeholder="e.g. 2 cups flour, sifted"
              />
            )}
            <button 
              onClick={() => removeIngredient(index)}
              className={styles.removeButton}
              aria-label="Remove ingredient"
            >
              <X size={20} />
            </button>
          </div>
        ))}
      </div>

      {!isReorderMode && (
        <button onClick={addIngredient} className={styles.addButton}>
          <span>+</span> ADD INGREDIENT
        </button>
      )}

      {isDialogOpen && (
        <div className={styles.dialogOverlay}>
          <div className={styles.dialog}>
            <div className={styles.dialogHeader}>
              <h2>Add multiple ingredients</h2>
              <button onClick={closeDialog} className={styles.closeButton}>
                <X size={20} />
              </button>
            </div>
            <p className={styles.dialogInstructions}>
              Paste your ingredient list here. Add one ingredient per line. Include the quantity (i.e. cups, tablespoons) and any special preparation (i.e. sifted, softened, chopped).
            </p>
            <textarea
              className={styles.bulkInput}
              value={bulkIngredients}
              onChange={(e) => setBulkIngredients(e.target.value)}
              placeholder={`Example:\n2 cups of flour, sifted\n1 cup sugar\n2 tablespoons butter, softened`}
              rows={10}
            />
            <div className={styles.dialogButtons}>
              <button onClick={closeDialog} className={styles.cancelButton}>Cancel</button>
              <button onClick={handleBulkAdd} className={styles.submitButton}>Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IngredientList;
