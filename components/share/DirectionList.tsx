import React from "react";

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
    <div className="flex flex-col gap-4 w-full">
      {directions.map((direction, index) => (
        <div key={index} className="flex gap-2 items-start relative">
          <textarea
            value={direction}
            onChange={(e) => updateDirection(index, e.target.value)}
            placeholder="e.g. Preheat oven to 350 degrees F..."
            className="flex-1 min-h-[80px] p-3 border border-slate-200 rounded-md text-sm leading-6 resize-y focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder:text-slate-400"
          />
          <button
            onClick={() => removeDirection(index)}
            className="bg-transparent border-none p-1 text-slate-400 cursor-pointer absolute right-2 top-2 hover:text-red-500"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        onClick={addDirection}
        className="inline-flex items-center py-2 px-4 bg-white border border-slate-200 rounded-md text-slate-500 text-sm font-medium cursor-pointer w-fit hover:bg-slate-50 before:content-['+'] before:mr-2 before:text-base"
      >
        Add Step
      </button>
    </div>
  );
};

export default DirectionList;
