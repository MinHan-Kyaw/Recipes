import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { X, Plus } from "lucide-react";
import { AnimatedButton } from "../AnimatedButton";
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
          <Textarea
            value={direction}
            onChange={(e) => updateDirection(index, e.target.value)}
            placeholder="e.g. Preheat oven to 350 degrees F..."
            className="flex-1 min-h-[80px] resize-y"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => removeDirection(index)}
            className="absolute right-2 top-2 h-6 w-6 text-slate-400 hover:text-red-500 hover:bg-transparent"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <AnimatedButton
        onClick={addDirection}
        className="text-sm bg-white hover:bg-primary/5 text-primary border-primary hover:text-primary"
        icon={<Plus size={16} />}
      >
        Add Step
      </AnimatedButton>
    </div>
  );
};

export default DirectionList;
