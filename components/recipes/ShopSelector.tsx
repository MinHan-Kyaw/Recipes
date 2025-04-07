"use client";

import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { fetchUserShops } from "@/lib/api/shops";
import { Shop } from "@/lib/types/shop";
import { Loader2, Store } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

interface ShopSelectorProps {
  selectedShopId: string | null;
  setSelectedShopId: (shopId: string | null) => void;
}

export function ShopSelector({
  selectedShopId,
  setSelectedShopId,
}: ShopSelectorProps) {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    async function loadShops() {
      if (!user?._id) return;

      try {
        setLoading(true);
        const userShops = await fetchUserShops(user._id);
        // Only show approved shops
        const approvedShops = userShops.filter((shop: Shop) => shop.isApproved);
        setShops(approvedShops);
      } catch (error) {
        console.error("Failed to load shops:", error);
      } finally {
        setLoading(false);
      }
    }

    loadShops();
  }, [user]);

  return (
    <div className="mb-6 space-y-2">
      <Label htmlFor="shop" className="text-sm font-medium">
        Available at Shop (Optional)
      </Label>
      {loading ? (
        <div className="flex items-center gap-2 text-gray-500">
          <Loader2 size={16} className="animate-spin" />
          <span>Loading shops...</span>
        </div>
      ) : shops.length === 0 ? (
        <div className="flex items-center gap-2 text-gray-500">
          <Store size={16} />
          <span>No approved shops available</span>
        </div>
      ) : (
        <Select
        value={selectedShopId || "none"}
          onValueChange={(value) =>
            setSelectedShopId(value === "none" ? null : value)
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a shop (optional)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            {shops.map((shop) => (
              <SelectItem key={shop._id} value={shop._id as string}>
                {shop.shopName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
