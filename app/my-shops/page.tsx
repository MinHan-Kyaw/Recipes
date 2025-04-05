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
import { useAuth } from "@/components/AuthProvider";
import { Shop } from "@/lib/types/shop";
import { deleteShop, fetchUserShops } from "@/lib/api/shops";

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

export default function MyShops() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [shops, setShops] = useState<Shop[]>([]);
  const [filteredShops, setFilteredShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [shopToDelete, setShopToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function loadShops() {
      if (!user) return;

      try {
        setLoading(true);
        if (!user._id) return;
        const userShops = await fetchUserShops(user._id);
        setShops(userShops);
        setFilteredShops(userShops);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load your shops. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    if (!authLoading) {
      loadShops();
    }
  }, [user, authLoading, toast]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredShops(shops);
    } else {
      const filtered = shops.filter(
        (shop) =>
          shop.shopName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          shop.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredShops(filtered);
    }
  }, [searchTerm, shops]);

  const handleDeleteClick = (shopId: string) => {
    setShopToDelete(shopId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!shopToDelete || !user || !user._id) return;

    try {
      setIsDeleting(true);
      await deleteShop(shopToDelete, user._id);

      // Update shops list
      const updatedShops = shops.filter((shop) => shop._id !== shopToDelete);
      setShops(updatedShops);
      setFilteredShops(updatedShops);

      toast({
        title: "Shop Deleted",
        description: "Your shop has been successfully deleted.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete shop. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setShopToDelete(null);
    }
  };

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    router.push("/auth/login");
    return null;
  }

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
          My Shops
        </h1>
        <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
          <Button
            onClick={() => router.push("/shops/create")}
            className="gap-2 shadow-md rounded-full px-6"
          >
            <Plus size={18} />
            Create New Shop
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
            placeholder="Search your shops..."
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
      ) : filteredShops.length === 0 ? (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center py-16 border rounded-lg bg-gray-50"
        >
          <AlertTriangle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">
            {searchTerm
              ? "No Shops Found Matching Your Search"
              : "No Shops Found"}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchTerm
              ? "Try a different search term or clear your search"
              : "You haven't created any shops yet."}
          </p>
          {!searchTerm && (
            <motion.div
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Button
                onClick={() => router.push("/shops/create")}
                variant="outline"
                className="gap-2 rounded-full px-6"
              >
                <Plus size={18} />
                Create Your First Shop
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
            {filteredShops.map((shop) => (
              <motion.div
                key={shop._id}
                variants={itemVariants}
                layoutId={shop._id}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <Card className="overflow-hidden flex flex-col h-full hover:shadow-lg hover:border-primary/20 transition-all duration-300">
                  <div
                    className="relative h-48 bg-gray-100 overflow-hidden"
                    onClick={() => router.push(`/shop/${shop._id}`)}
                    style={{ cursor: "pointer" }}
                  >
                    {shop.logo && shop.logo.url ? (
                      <Image
                        src={shop.logo.url}
                        alt={shop.shopName}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 hover:scale-105"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Store className="h-16 w-16 text-gray-300" />
                      </div>
                    )}
                  </div>
                  <CardContent className="pt-4 pb-2 flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-semibold">{shop.shopName}</h3>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          shop.isApproved
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {shop.isApproved ? "Approved" : "Pending"}
                      </span>
                    </div>
                    <p className="text-gray-500 line-clamp-2 mb-3">
                      {shop.description || "No description provided"}
                    </p>
                    <div className="flex flex-col gap-1 text-sm text-gray-500">
                      <span className="inline-flex items-center">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        {shop.city}, {shop.state}
                      </span>
                      <span className="inline-flex items-center">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        {shop.email}
                      </span>
                    </div>
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
                        onClick={() => router.push(`/shops/${shop._id}`)}
                        className="rounded-full"
                      >
                        View Shop
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
                          onClick={() =>
                            router.push(`/my-shops/edit/${shop._id}`)
                          }
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
                          onClick={() => handleDeleteClick(shop._id as string)}
                          className="rounded-full text-red-500 hover:bg-red-50 hover:border-red-200 hover:text-red-600"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </motion.div>
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              shop and all associated data.
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
