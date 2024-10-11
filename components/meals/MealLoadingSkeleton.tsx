"use client";

import { motion } from "framer-motion";
import classes from "./MealLoadingSkeleton.module.css";

const MealLoadingSkeleton = () => {
  return (
    <motion.article
      className={classes.meal}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <header>
        <div className={`${classes.image} ${classes.skeleton}`} />
        <div className={classes.headerText}>
          <div className={`${classes.titleSkeleton} ${classes.skeleton}`} />
          <div className={`${classes.creatorSkeleton} ${classes.skeleton}`} />
        </div>
      </header>
      <div className={classes.content}>
        <div className={`${classes.summarySkeleton} ${classes.skeleton}`} />
        <div className={classes.actions}>
          <div className={`${classes.timeSkeleton} ${classes.skeleton}`} />
        </div>
      </div>
    </motion.article>
  );
};

export default MealLoadingSkeleton;
