"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Edit,
  Trash2,
  Plus,
  Loader2,
  AlertTriangle,
  Search,
  Store,
} from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};

const buttonVariants = {
  hover: {
    scale: 1.05,
    transition: { type: "spring", stiffness: 400 },
  },
  tap: { scale: 0.95 },
};

export interface ItemListProps<T> {
  title: string;
  items: T[];
  loading: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  createPath: string;
  createButtonText: string;
  emptyStateButtonText: string;
  noItemsFoundText: string;
  noMatchingItemsText: string;
  handleDelete: (id: string) => void;
  isDeleting: boolean;
  deleteDialogOpen: boolean;
  setDeleteDialogOpen: (isOpen: boolean) => void;
  confirmDelete: () => void;
  deleteDialogDescription: string;
  renderItemImage: (item: T) => React.ReactNode;
  renderItemContent: (item: T) => React.ReactNode;
  getItemDetails: (item: T) => {
    id: string;
    viewPath: string;
    editPath: string;
  };
}

export default function ItemList<T>({
  title,
  items,
  loading,
  searchTerm,
  setSearchTerm,
  createPath,
  createButtonText,
  emptyStateButtonText,
  noItemsFoundText,
  noMatchingItemsText,
  handleDelete,
  isDeleting,
  deleteDialogOpen,
  setDeleteDialogOpen,
  confirmDelete,
  deleteDialogDescription,
  renderItemImage,
  renderItemContent,
  getItemDetails,
}: ItemListProps<T>) {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-8"
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4"
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          {title}
        </h1>
        <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
          <Button
            onClick={() => router.push(createPath)}
            className="gap-2 shadow-md rounded-full px-6"
          >
            <Plus size={18} />
            {createButtonText}
          </Button>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <Input
            placeholder={`Search...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 rounded-full bg-gray-50 border-gray-200 focus:ring-primary focus:border-primary"
          />
        </div>
      </motion.div>

      {loading ? (
        <div className="flex justify-center items-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : items.length === 0 ? (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center py-16 border rounded-lg bg-gray-50"
        >
          <AlertTriangle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">
            {searchTerm ? noMatchingItemsText : noItemsFoundText}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchTerm
              ? "Try a different search term or clear your search"
              : `You haven't created any ${title.toLowerCase()} yet.`}
          </p>
          {!searchTerm && (
            <motion.div
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Button
                onClick={() => router.push(createPath)}
                variant="outline"
                className="gap-2 rounded-full px-6"
              >
                <Plus size={18} />
                {emptyStateButtonText}
              </Button>
            </motion.div>
          )}
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {items.map((item) => {
              const { id, viewPath, editPath } = getItemDetails(item);
              return (
                <motion.div
                  key={id}
                  variants={itemVariants}
                  layoutId={id}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <Card className="overflow-hidden flex flex-col h-full hover:shadow-lg hover:border-primary/20 transition-all duration-300">
                    <div
                      className="relative h-56 bg-gray-100 overflow-hidden"
                      onClick={() => router.push(viewPath)}
                      style={{ cursor: "pointer" }}
                    >
                      {renderItemImage(item)}
                    </div>
                    <CardContent className="pt-4 pb-2 flex-1">
                      {renderItemContent(item)}
                    </CardContent>
                    <CardFooter className="flex justify-between pt-2">
                      <motion.div
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(viewPath)}
                          className="rounded-full"
                        >
                          View {title.slice(0, -1)}
                        </Button>
                      </motion.div>
                      <div className="flex gap-2">
                        <motion.div
                          variants={buttonVariants}
                          whileHover="hover"
                          whileTap="tap"
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(editPath)}
                            className="rounded-full"
                          >
                            <Edit size={16} />
                          </Button>
                        </motion.div>
                        <motion.div
                          variants={buttonVariants}
                          whileHover="hover"
                          whileTap="tap"
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(id)}
                            className="rounded-full text-red-500 hover:bg-red-50 hover:border-red-200 hover:text-red-600"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </motion.div>
                      </div>
                    </CardFooter>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteDialogDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={isDeleting}>
              {isDeleting ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}
