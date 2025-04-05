"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { Shop } from "@/lib/types/shop";
import { deleteShop, fetchUserShops } from "@/lib/api/shops";
import ItemList from "@/components/ItemList";
import { Loader2, Store } from "lucide-react";

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

  const renderShopImage = (shop: Shop) => {
    return shop.logo && shop.logo.url ? (
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
    );
  };

  const renderShopContent = (shop: Shop) => (
    <>
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
    </>
  );

  const getShopDetails = (shop: Shop) => ({
    id: shop._id as string,
    viewPath: `/shop/${shop._id}`,
    editPath: `/my-shops/edit/${shop._id}`,
  });

  return (
    <ItemList
      title="My Shops"
      items={filteredShops}
      loading={loading}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      createPath="/register-shop"
      createButtonText="Create New Shop"
      emptyStateButtonText="Create Your First Shop"
      noItemsFoundText="No Shops Found"
      noMatchingItemsText="No Shops Found Matching Your Search"
      handleDelete={handleDeleteClick}
      isDeleting={isDeleting}
      deleteDialogOpen={deleteDialogOpen}
      setDeleteDialogOpen={setDeleteDialogOpen}
      confirmDelete={confirmDelete}
      deleteDialogDescription="This action cannot be undone. This will permanently delete your shop and all associated data."
      renderItemImage={renderShopImage}
      renderItemContent={renderShopContent}
      getItemDetails={getShopDetails}
    />
  );
}
