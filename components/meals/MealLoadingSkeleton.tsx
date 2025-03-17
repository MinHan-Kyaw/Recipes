"use client";

import { motion } from "framer-motion";

const MealLoadingSkeleton = () => {
  return (
    <motion.article
      className="flex flex-col rounded-lg overflow-hidden bg-white shadow-sm animate-pulse"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <header>
        <div className="relative w-full h-[200px] bg-gray-200 animate-shimmer" />
        <div className="p-4">
          <div className="h-6 w-4/5 mb-2 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 bg-[length:200%_100%] animate-shimmer" />
          <div className="h-4 w-2/5 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 bg-[length:200%_100%] animate-shimmer" />
        </div>
      </header>
      <div className="p-4">
        <div className="h-4 w-full mb-4 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 bg-[length:200%_100%] animate-shimmer" />
        <div className="h-4 w-20 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 bg-[length:200%_100%] animate-shimmer" />
      </div>
    </motion.article>
  );
};

export default MealLoadingSkeleton;
