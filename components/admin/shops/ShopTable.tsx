import React from "react";
import { Shop } from "@/lib/types/shop";
import { DataTable } from "@/components/admin/DataTable";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Edit, Trash2 } from "lucide-react";

interface ShopTableProps {
  shops: Shop[];
  isLoading: boolean;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  itemsPerPage: number;
  sortField: string;
  sortDirection: "asc" | "desc";
  onSort: (field: string) => void;
  onViewShop: (shop: Shop) => void;
  onEditShop: (shop: Shop) => void;
  onDeleteShop: (shop: Shop) => void;
  onApproveShop: (shopId: string, userId: string) => void;
  formatDate: (date: string | Date) => string;
  showRecipes?: boolean;
  showCreated?: boolean;
  emptyMessage?: string;
  userId?: string;
}

export default function ShopTable({
  shops,
  isLoading,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  sortField,
  sortDirection,
  onSort,
  onViewShop,
  onEditShop,
  onDeleteShop,
  onApproveShop,
  formatDate,
  showRecipes = true,
  showCreated = true,
  emptyMessage = "No shops found matching your filters.",
  userId,
}: ShopTableProps): JSX.Element {
  const getShopInitials = (name: string) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const columns = [
    {
      key: "shop",
      header: "Shop",
      render: (shop: Shop) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={shop.logo?.url || ""} alt={shop.shopName} />
            <AvatarFallback>{getShopInitials(shop.shopName)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{shop.shopName}</p>
            <p className="text-sm text-gray-500">{shop.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "ownerName",
      header: "Owner",
      hidden: "md",
      sortable: true,
    },
    {
      key: "location",
      header: "Location",
      hidden: "md",
      render: (shop: Shop) => (
        <>
          {shop.city}, {shop.state}
        </>
      ),
    },
    ...(showRecipes
      ? [
          {
            key: "recipesCount",
            header: "Recipes",
            hidden: showCreated ? "lg" : false,
            sortable: true,
            render: (shop: Shop) => <Badge>{shop.recipesCount || 0}</Badge>,
          },
        ]
      : []),
    ...(showCreated
      ? [
          {
            key: "createdAt",
            header: "Created",
            hidden: "lg",
            sortable: true,
            render: (shop: Shop) => formatDate(shop.createdAt),
          },
        ]
      : []),
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      render: (shop: Shop) => (
        <div className="flex justify-end gap-2">
          <Button size="sm" variant="outline" onClick={() => onViewShop(shop)}>
            View
          </Button>
          {!shop.isApproved && (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onEditShop(shop)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                onClick={() =>
                  shop._id && userId && onApproveShop(shop._id, userId)
                }
              >
                <CheckCircle className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onDeleteShop(shop)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <DataTable
      data={shops}
      columns={columns}
      keyField={(shop) => shop._id || shop.shopName}
      isLoading={isLoading}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      itemsPerPage={itemsPerPage}
      sortField={sortField}
      sortDirection={sortDirection}
      onSort={onSort}
      emptyMessage={emptyMessage}
    />
  );
}
