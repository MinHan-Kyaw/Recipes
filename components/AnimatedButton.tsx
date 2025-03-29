import { Button } from "./ui/button";
import { AnimatePresence, motion } from "framer-motion";

export const AnimatedButton: React.FC<{
  onClick: () => void;
  className?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  isPrimary?: boolean;
  variant?:
    | "default"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "destructive";
}> = ({
  onClick,
  className = "",
  icon,
  children,
  isPrimary = false,
  variant = "outline",
}) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
        >
          <Button
            onClick={onClick}
            className={`gap-2 ${className}`}
            variant={isPrimary ? "default" : variant}
          >
            {icon}
            {children}
          </Button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
