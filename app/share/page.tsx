'use client'

import React, { useState } from 'react';
import styles from './page.module.css';
import IngredientList from '../../components/share/IngredientList';
import DirectionList from '../../components/share/DirectionList';

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

const CreateRecipe: React.FC = () => {
  const [recipe, setRecipe] = useState<Recipe>({
    title: '',
    description: '',
    ingredients: [],
    directions: [],
    servings: '',
    yield: '',
    prepTime: 0,
    cookTime: 0,
    notes: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setRecipe(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log(recipe);
  };

  return (
    <div className={styles.container}>
      <h1>Add a Recipe</h1>
      <form onSubmit={handleSubmit}>
        <div className={styles.section}>
          <label htmlFor="title">Recipe Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={recipe.title}
            onChange={handleInputChange}
            placeholder="Give your recipe a title"
          />
        </div>

        <div className={styles.section}>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={recipe.description}
            onChange={handleInputChange}
            placeholder="Share the story behind your recipe and what makes it special."
          />
        </div>

        <div className={styles.section}>
          <label>Ingredients</label>
          <IngredientList
            ingredients={recipe.ingredients}
            setIngredients={(ingredients) => setRecipe(prev => ({ ...prev, ingredients }))}
          />
        </div>

        <div className={styles.section}>
          <label>Directions</label>
          <DirectionList
            directions={recipe.directions}
            setDirections={(directions) => setRecipe(prev => ({ ...prev, directions }))}
          />
        </div>

        <div className={styles.section}>
          <label htmlFor="servings">Servings</label>
          <input
            type="text"
            id="servings"
            name="servings"
            value={recipe.servings}
            onChange={handleInputChange}
            placeholder="e.g. 8"
          />
        </div>

        <div className={styles.section}>
          <label htmlFor="yield">Yield (Optional)</label>
          <input
            type="text"
            id="yield"
            name="yield"
            value={recipe.yield}
            onChange={handleInputChange}
            placeholder="e.g. 1 9-inch cake"
          />
        </div>

        <div className={styles.section}>
          <label htmlFor="prepTime">Prep Time</label>
          <input
            type="number"
            id="prepTime"
            name="prepTime"
            value={recipe.prepTime}
            onChange={handleInputChange}
          />
          <span>mins</span>
        </div>

        <div className={styles.section}>
          <label htmlFor="cookTime">Cook Time (optional)</label>
          <input
            type="number"
            id="cookTime"
            name="cookTime"
            value={recipe.cookTime}
            onChange={handleInputChange}
          />
          <span>mins</span>
        </div>

        <div className={styles.section}>
          <label htmlFor="notes">Notes (Optional)</label>
          <textarea
            id="notes"
            name="notes"
            value={recipe.notes}
            onChange={handleInputChange}
            placeholder="Add any helpful tips about ingredient substitutions, serving, or storage here."
          />
        </div>

        <div className={styles.submitSection}>
          <button type="button" className={styles.cancelButton}>Cancel</button>
          <button type="submit" className={styles.submitButton}>Submit Recipe</button>
        </div>
      </form>
    </div>
  );
};

export default CreateRecipe;
