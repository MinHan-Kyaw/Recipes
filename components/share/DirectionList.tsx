import React from "react";
import styles from "./DirectionList.module.css";

interface DirectionListProps {
  directions: string[];
  setDirections: (directions: string[]) => void;
}

const DirectionList: React.FC<DirectionListProps> = ({
  directions,
  setDirections,
}) => {
  const addDirection = () => {
    setDirections([...directions, ""]);
  };

  const removeDirection = (index: number) => {
    const newDirections = directions.filter((_, i) => i !== index);
    setDirections(newDirections);
  };

  const updateDirection = (index: number, value: string) => {
    const newDirections = [...directions];
    newDirections[index] = value;
    setDirections(newDirections);
  };

  return (
    <div className={styles.directionList}>
      {directions.map((direction, index) => (
        <div key={index} className={styles.directionItem}>
          <textarea
            value={direction}
            onChange={(e) => updateDirection(index, e.target.value)}
            placeholder="e.g. Preheat oven to 350 degrees F..."
          />
          <button
            onClick={() => removeDirection(index)}
            className={styles.removeButton}
          >
            Remove
          </button>
        </div>
      ))}
      <button onClick={addDirection} className={styles.addButton}>
        Add Step
      </button>
    </div>
  );
};

export default DirectionList;
