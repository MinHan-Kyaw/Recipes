"use client";

import { useState, useEffect } from "react";
import {
  Store,
  Edit,
  Trash2,
  CheckCircle,
  Map,
  ThumbsUp,
  ThumbsDown,
  FileText,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Shop } from "@/lib/types/shop";
import {
  approveShop,
  deleteShop,
  fetchShops,
  updateShop,
} from "@/lib/api/admin/shops";
import { fetchRecipeCountsWithShop } from "@/lib/api/admin/recipes";
import StatsCard from "@/components/admin/StatsCard";
import ShopSearchFilters from "@/components/admin/shops/ShopSearchFilters";
import ShopDetailView from "@/components/admin/shops/ShopDetailView";
import ShopTable from "@/components/admin/shops/ShopTable";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import Sidebar from "@/components/admin/SideBar";

export default function ShopsPage() {
  const { toast } = useToast();
  const [shops, setShops] = useState<Shop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterApproval, setFilterApproval] = useState("all");
  const [filterHasRecipes, setFilterHasRecipes] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState("shopName");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState("view"); // view, edit, delete
  const [currentTab, setCurrentTab] = useState("all-shops");
  const [userId, setUserId] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      setIsCheckingAuth(true);
      try {
        const token = Cookies.get("token");
        if (!token || token === "undefined") {
          router.push("/auth/login");
          return;
        }

        const response = await fetch("/api/auth/me");
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            if (data.data.type === "admin") {
              setIsAuthorized(true);
            } else {
              router.push("/");
            }
          } else {
            router.push("/auth/login");
          }
        } else {
          if (response.status === 401) {
            Cookies.remove("token");
            router.push("/auth/login");
          }
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        router.push("/auth/login");
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAdminStatus();
  }, [router]);

  useEffect(() => {
    if (!isAuthorized || isCheckingAuth) return;
    const filter = searchParams.get("filter");
    if (filter === "pending") {
      setCurrentTab("pending");
      setFilterApproval("pending");
      // Remove the parameter from the URL
      const newUrl = window.location.pathname;
      router.replace(newUrl);
    }
  }, [searchParams, router, isAuthorized, isCheckingAuth]);

  interface FormData {
    shopName: string;
    email: string;
    phone: string;
    description: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    businessHours: string;
    categories: string[];
    isApproved: boolean;
  }

  // Form state for editing
  const [formData, setFormData] = useState<FormData>({
    shopName: "",
    email: "",
    phone: "",
    description: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    businessHours: "",
    categories: [],
    isApproved: false,
  });

  // Form errors state
  const [errors, setErrors] = useState({
    shopName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  const itemsPerPage = 5;

  // Fetch shops on component mount
  useEffect(() => {
    if (!isAuthorized || isCheckingAuth) return;
    const loadShops = async () => {
      try {
        setIsLoading(true);
        const data = await fetchShops();
        setShops(data.data);

        // After shops are loaded, fetch recipe counts for each shop
        if (data.data && data.data.length > 0) {
          const shopIds = data.data.map((shop: Shop) => shop._id);
          const countData = await fetchRecipeCountsWithShop(shopIds);

          // Add recipe counts to shop objects
          setShops((prevShops) =>
            prevShops.map((shop) => ({
              ...shop,
              recipesCount: shop._id ? countData.data[shop._id] || 0 : 0,
            }))
          );
        }
        const token = Cookies.get("token");
        const userId = token
          ? JSON.parse(atob(token.split(".")[1])).userId
          : null;
        setUserId(userId);
      } catch (error) {
        console.error("Failed to fetch shops:", error);
        toast({
          title: "Error",
          description: "Failed to load shops. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadShops();
  }, [toast, shops.length, isAuthorized, isCheckingAuth]);

  // Update form data when editing a shop
  useEffect(() => {
    if (selectedShop && dialogMode === "edit") {
      setFormData({
        shopName: selectedShop.shopName || "",
        email: selectedShop.email || "",
        phone: selectedShop.phone || "",
        description: selectedShop.description || "",
        address: selectedShop.address || "",
        city: selectedShop.city || "",
        state: selectedShop.state || "",
        zipCode: selectedShop.zipCode || "",
        country: selectedShop.country || "",
        businessHours: selectedShop.businessHours || "",
        categories: selectedShop.categories || [],
        isApproved: selectedShop.isApproved || false,
      });
    }
  }, [selectedShop, dialogMode]);

  // Update current tab based on filter changes
  useEffect(() => {
    if (!isAuthorized || isCheckingAuth) return;
    if (filterApproval === "approved") {
      setCurrentTab("approved");
    } else if (filterApproval === "pending") {
      setCurrentTab("pending");
    } else if (filterHasRecipes) {
      setCurrentTab("with-recipes");
    } else {
      setCurrentTab("all-shops");
    }
  }, [filterApproval, filterHasRecipes, isAuthorized, isCheckingAuth]);

  // Function to approve shop
  const handleShopApproval = async (shopId: string, userId: string) => {
    try {
      const result = await approveShop(shopId, userId);
      if (result.success) {
        setShops((prev) =>
          prev.map((shop) =>
            shop._id === shopId ? { ...shop, isApproved: true } : shop
          )
        );
        toast({
          title: "Success",
          description: "Shop approved successfully",
        });
      }
    } catch (error) {
      console.error("Failed to approve shop:", error);
      toast({
        title: "Error",
        description: "Failed to approve shop. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));

    // Clear errors as user types
    if (id in errors && id in formData && errors[id as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [id]: "",
      }));
    }
  };

  // Handle checkbox change
  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      isApproved: checked,
    }));
  };

  // Handle category input
  const handleCategoryInput = (value: string) => {
    const categories = value
      .split(",")
      .map((cat) => cat.trim())
      .filter((cat) => cat.length > 0);
    setFormData((prev) => ({
      ...prev,
      categories,
    }));
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {
      shopName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    };
    let isValid = true;

    if (!formData.shopName.trim()) {
      newErrors.shopName = "Shop name is required";
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Please provide a valid email";
      isValid = false;
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
      isValid = false;
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
      isValid = false;
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
      isValid = false;
    }

    if (!formData.state.trim()) {
      newErrors.state = "State is required";
      isValid = false;
    }

    if (!formData.zipCode.trim()) {
      newErrors.zipCode = "ZIP code is required";
      isValid = false;
    }

    if (!formData.country.trim()) {
      newErrors.country = "Country is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      if (dialogMode === "edit" && selectedShop) {
        const updatedShop = {
          ...selectedShop,
          ...formData,
        };
        if (!selectedShop._id || !userId) return;

        await updateShop(selectedShop._id, updatedShop, userId);
        setShops((prev) =>
          prev.map((shop) =>
            shop._id === selectedShop._id ? { ...shop, ...formData } : shop
          )
        );
        toast({
          title: "Success",
          description: "Shop updated successfully",
        });
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to save shop:", error);
      toast({
        title: "Error",
        description: "Failed to save shop. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle approve shop
  const handleApproveShop = async (shopId: string, userId: string) => {
    try {
      await approveShop(shopId, userId);
      setShops((prev) =>
        prev.map((shop) =>
          shop._id === shopId ? { ...shop, isApproved: true } : shop
        )
      );
      toast({
        title: "Success",
        description: "Shop approved successfully",
      });
    } catch (error) {
      console.error("Failed to approve shop:", error);
      toast({
        title: "Error",
        description: "Failed to approve shop. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle delete shop
  const confirmDeleteShop = async () => {
    if (!selectedShop || !selectedShop._id) return;

    try {
      await deleteShop(selectedShop._id);
      setShops((prev) => prev.filter((shop) => shop._id !== selectedShop._id));
      toast({
        title: "Success",
        description: "Shop deleted successfully",
      });
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to delete shop:", error);
      toast({
        title: "Error",
        description: "Failed to delete shop. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Get filtered and sorted shops
  const filteredShops = shops.filter((shop) => {
    const matchesSearch =
      shop.shopName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shop.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shop.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      filterCategory === "all" ||
      (shop.categories &&
        shop.categories.some(
          (category) => category.toLowerCase() === filterCategory.toLowerCase()
        ));

    const matchesApproval =
      filterApproval === "all" ||
      (filterApproval === "approved" && shop.isApproved) ||
      (filterApproval === "pending" && !shop.isApproved);

    const matchesHasRecipes = !filterHasRecipes || (shop.recipesCount ?? 0) > 0;

    return (
      matchesSearch && matchesCategory && matchesApproval && matchesHasRecipes
    );
  });

  type SortableField = keyof Pick<
    Shop,
    "shopName" | "ownerName" | "createdAt" | "recipesCount"
  >;
  //   type SortableField = keyof Pick<Shop, "shopName" | "ownerName" | "createdAt">;

  const sortedShops = [...filteredShops].sort((a, b) => {
    let fieldA: string | number;
    let fieldB: string | number;

    // Handle nested fields and type-safe field access
    if (sortField === "recipesCount") {
      fieldA = a.recipesCount || 0;
      fieldB = b.recipesCount || 0;
    } else if (sortField === "ownerName") {
      fieldA = a.ownerName;
      fieldB = b.ownerName;
    } else if (sortField === "createdAt") {
      fieldA = new Date(a.createdAt).getTime();
      fieldB = new Date(b.createdAt).getTime();
    } else {
      fieldA = a[sortField as SortableField] as string;
      fieldB = b[sortField as SortableField] as string;
    }

    if (sortDirection === "asc") {
      if (fieldA < fieldB) return -1;
      if (fieldA > fieldB) return 1;
      return 0;
    } else {
      if (fieldA > fieldB) return -1;
      if (fieldA < fieldB) return 1;
      return 0;
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedShops.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentShops = sortedShops.slice(indexOfFirstItem, indexOfLastItem);

  // Pagination array for rendering
  const getPaginationArray = () => {
    const pages = [];

    // Always show first page
    pages.push(1);

    // Calculate range around current page
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    // Add ellipsis after first page if needed
    if (startPage > 2) {
      pages.push("ellipsis1");
    }

    // Add pages around current page
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Add ellipsis before last page if needed
    if (endPage < totalPages - 1) {
      pages.push("ellipsis2");
    }

    // Add last page if there is more than one page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  // Handle sorting
  const handleSort = (field: string) => {
    if (!["shopName", "ownerName", "createdAt", "recipesCount"].includes(field))
      return;
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Handle shop actions
  const handleViewShop = (shop: Shop) => {
    setSelectedShop(shop);
    setDialogMode("view");
    setIsDialogOpen(true);
  };

  const handleEditShop = (shop: Shop) => {
    setSelectedShop(shop);
    setDialogMode("edit");
    setIsDialogOpen(true);
  };

  const handleDeleteShop = (shop: Shop) => {
    setSelectedShop(shop);
    setDialogMode("delete");
    setIsDialogOpen(true);
  };

  // Extract unique categories for filter dropdown
  const uniqueCategories = Array.from(
    new Set(shops.flatMap((shop) => (shop.categories ? shop.categories : [])))
  );

  // Format date for display
  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Calculate stats
  const totalShopCount = shops.length;
  const pendingApprovalCount = shops.filter((shop) => !shop.isApproved).length;
  const approvedShopCount = shops.filter((shop) => shop.isApproved).length;
  const shopsWithRecipesCount = shops.filter(
    (shop) => (shop.recipesCount ?? 0) > 0
  ).length;

  // Show loading state while checking authorization
  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Checking authorization...</p>
        </div>
      </div>
    );
  }

  // Only render the main content if user is authorized
  if (!isAuthorized) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-6 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Shop Management
              </h1>
              <p className="text-gray-500">
                Manage and monitor shops on the platform
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatsCard
              title="Total Shops"
              value={totalShopCount}
              icon={Store}
              delay={0.1}
            />
            <StatsCard
              title="Pending Approval"
              value={pendingApprovalCount}
              icon={ThumbsDown}
              iconColor="text-amber-500"
              delay={0.2}
            />
            <StatsCard
              title="Approved Shops"
              value={approvedShopCount}
              icon={ThumbsUp}
              iconColor="text-green-500"
              delay={0.3}
            />
            <StatsCard
              title="Shops with Recipes"
              value={shopsWithRecipesCount}
              icon={FileText}
              iconColor="text-purple-500"
              delay={0.4}
            />
          </div>
          {/* Tabs for different shop views */}
          <Tabs
            defaultValue="all-shops"
            value={currentTab}
            onValueChange={setCurrentTab}
            className="mb-6"
          >
            <TabsList className="mb-4">
              <TabsTrigger
                value="all-shops"
                className="flex items-center gap-2"
                onClick={() => {
                  setFilterApproval("all");
                  setFilterHasRecipes(false);
                }}
              >
                <Store className="h-4 w-4" />
                <span>All Shops</span>
              </TabsTrigger>
              <TabsTrigger value="pending" className="flex items-center gap-2">
                <ThumbsDown className="h-4 w-4" />
                <span>Pending Approval</span>
              </TabsTrigger>
              <TabsTrigger value="approved" className="flex items-center gap-2">
                <ThumbsUp className="h-4 w-4" />
                <span>Approved</span>
              </TabsTrigger>
              <TabsTrigger
                value="with-recipes"
                className="flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                <span>With Recipes</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all-shops" className="space-y-4">
              {/* Search and Filters */}
              <ShopSearchFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                filterCategory={filterCategory}
                onCategoryChange={setFilterCategory}
                filterApproval={filterApproval}
                onApprovalChange={setFilterApproval}
                uniqueCategories={uniqueCategories}
              />

              {/* Shops Table */}
              <Card>
                <CardContent className="p-0">
                  <ShopTable
                    shops={currentShops}
                    isLoading={isLoading}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    itemsPerPage={itemsPerPage}
                    sortField={sortField}
                    sortDirection={sortDirection}
                    onSort={handleSort}
                    onViewShop={handleViewShop}
                    onEditShop={handleEditShop}
                    onDeleteShop={handleDeleteShop}
                    onApproveShop={handleShopApproval}
                    formatDate={formatDate}
                    showRecipes={true}
                    showCreated={true}
                    userId={userId || ""}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pending" className="space-y-4">
              {/* Similar structure as all-shops but with filtered data */}
              <Card>
                <CardContent className="p-0">
                  <ShopTable
                    shops={shops.filter((shop) => !shop.isApproved)}
                    isLoading={isLoading}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    itemsPerPage={itemsPerPage}
                    sortField={sortField}
                    sortDirection={sortDirection}
                    onSort={handleSort}
                    onViewShop={handleViewShop}
                    onEditShop={handleEditShop}
                    onDeleteShop={handleDeleteShop}
                    onApproveShop={handleApproveShop}
                    formatDate={formatDate}
                    showRecipes={false}
                    showCreated={true}
                    emptyMessage="No pending shops to approve."
                    userId={userId || ""}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="approved" className="space-y-4">
              {/* Similar structure for approved shops */}
              <Card>
                <CardContent className="p-0">
                  <ShopTable
                    shops={shops.filter((shop) => shop.isApproved)}
                    isLoading={isLoading}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    itemsPerPage={itemsPerPage}
                    sortField={sortField}
                    sortDirection={sortDirection}
                    onSort={handleSort}
                    onViewShop={handleViewShop}
                    onEditShop={handleEditShop}
                    onDeleteShop={handleDeleteShop}
                    onApproveShop={handleApproveShop}
                    formatDate={formatDate}
                    showRecipes={true}
                    showCreated={false}
                    emptyMessage="No approved shops found."
                    userId={userId || ""}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="with-recipes" className="space-y-4">
              {/* Similar structure for shops with recipes */}
              <Card>
                <CardContent className="p-0">
                  <ShopTable
                    shops={shops.filter((shop) => (shop.recipesCount ?? 0) > 0)}
                    isLoading={isLoading}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    itemsPerPage={itemsPerPage}
                    sortField={sortField}
                    sortDirection={sortDirection}
                    onSort={handleSort}
                    onViewShop={handleViewShop}
                    onEditShop={handleEditShop}
                    onDeleteShop={handleDeleteShop}
                    onApproveShop={handleApproveShop}
                    formatDate={formatDate}
                    showRecipes={true}
                    showCreated={false}
                    emptyMessage="No shops with recipes found."
                    userId={userId || ""}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* View Shop Dialog */}
          <Dialog
            open={isDialogOpen && dialogMode === "view"}
            onOpenChange={setIsDialogOpen}
          >
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Shop Details</DialogTitle>
              </DialogHeader>
              {selectedShop && (
                <ShopDetailView shop={selectedShop} formatDate={formatDate} />
              )}
              <DialogFooter className="flex justify-between gap-2">
                <div>
                  {selectedShop && !selectedShop.isApproved && userId && (
                    <Button
                      onClick={() =>
                        selectedShop._id &&
                        handleShopApproval(selectedShop._id, userId)
                      }
                      className="mr-2"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve Shop
                    </Button>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Close
                  </Button>
                  <Button
                    onClick={() => {
                      setIsDialogOpen(false);
                      setDialogMode("edit");
                      setIsDialogOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Edit Shop Dialog */}
          <Dialog
            open={isDialogOpen && dialogMode === "edit"}
            onOpenChange={setIsDialogOpen}
          >
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Shop</DialogTitle>
                <DialogDescription>
                  Make changes to the shop information below.
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="shopName">Shop Name</Label>
                    <Input
                      id="shopName"
                      value={formData.shopName}
                      onChange={handleInputChange}
                    />
                    {errors.shopName && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.shopName}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                    {errors.phone && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      rows={3}
                      value={formData.description}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <Label htmlFor="businessHours">Business Hours</Label>
                    <Input
                      id="businessHours"
                      value={formData.businessHours}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <Label htmlFor="categories">Categories</Label>
                    <Input
                      id="categories"
                      value={formData.categories.join(", ")}
                      onChange={(e) => handleCategoryInput(e.target.value)}
                      placeholder="Separate categories with commas"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isApproved"
                      checked={formData.isApproved}
                      onCheckedChange={handleCheckboxChange}
                    />
                    <Label htmlFor="isApproved">Approved Shop</Label>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={handleInputChange}
                    />
                    {errors.address && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.address}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={handleInputChange}
                    />
                    {errors.city && (
                      <p className="text-sm text-red-500 mt-1">{errors.city}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={handleInputChange}
                    />
                    {errors.state && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.state}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                    />
                    {errors.zipCode && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.zipCode}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={formData.country}
                      onChange={handleInputChange}
                    />
                    {errors.country && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.country}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <h4 className="text-sm font-semibold mb-2">
                      Shop Location
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Location coordinates can be updated through the map
                      interface.
                    </p>
                    {/* Map placeholder - in a real app, you'd have a map interface for selecting coordinates */}
                    <div className="bg-gray-100 h-32 rounded-md flex items-center justify-center">
                      <Map className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-gray-500">
                        Map location selector
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleSubmit}>Save Changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Delete Shop Confirmation Dialog */}
          <Dialog
            open={isDialogOpen && dialogMode === "delete"}
            onOpenChange={setIsDialogOpen}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete{" "}
                  <span className="font-semibold">
                    {selectedShop?.shopName}
                  </span>
                  ? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <p className="text-gray-500 text-sm">
                This will permanently remove the shop and all associated data
                from the system.
              </p>
              <DialogFooter className="gap-2 sm:justify-between sm:space-x-0">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button variant="destructive" onClick={confirmDeleteShop}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Shop
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
