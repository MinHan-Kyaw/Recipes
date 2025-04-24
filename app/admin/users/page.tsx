"use client";

import { useState, useEffect } from "react";
import {
  Users,
  Plus,
  Store,
  UserX,
  ShieldCheck,
  ChevronLeft,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  createUser,
  deleteUser,
  fetchUsers,
  updateUser,
} from "@/lib/api/admin/users";
import { User } from "@/lib/types/user";
import Link from "next/link";
import { UserStatsCards } from "@/components/admin/users/UserStatsCards";
import { UserFilters } from "@/components/admin/users/UserFilters";
import { UserTable } from "@/components/admin/users/UserTable";
import {
  AdminsTabContent,
  ShopOwnersTabContent,
  UnverifiedUsersTabContent,
} from "@/components/admin/users/UserTabContent";
import { UserDetailsDialog } from "@/components/admin/users/UserDetailsDialog";

export default function UsersPage() {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterShopOwners, setFilterShopOwners] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof User>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<
    "view" | "add" | "edit" | "delete"
  >("view");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    type: "user",
    status: "unverified",
  });

  // Form errors state
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
  });

  const itemsPerPage = 5;

  // Fetch users on component mount
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setIsLoading(true);
        const data = await fetchUsers();
        setUsers(data.data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
        toast({
          title: "Error",
          description: "Failed to load users. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
  }, [toast]);

  // Update form data when editing a user
  useEffect(() => {
    if (selectedUser && dialogMode === "edit") {
      setFormData({
        name: selectedUser.name || "",
        email: selectedUser.email || "",
        password: "", // Don't populate password for security
        type: selectedUser.type || "user",
        status: selectedUser.status || "unverified",
      });
    } else if (dialogMode === "add") {
      // Reset form for adding new user
      setFormData({
        name: "",
        email: "",
        password: "",
        type: "user" as "user" | "admin",
        status: "unverified" as "verified" | "unverified",
      });
    }
  }, [selectedUser, dialogMode]);

  // Define error type
  type FormErrors = {
    name: string;
    email: string;
    password: string;
  };

  // Validate form
  const validateForm = () => {
    const newErrors: FormErrors = {
      name: "",
      email: "",
      password: "",
    };
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Please provide a valid email";
      isValid = false;
    }

    // Only validate password for new users
    if (
      dialogMode === "add" &&
      (!formData.password || formData.password.length < 6)
    ) {
      newErrors.password = "Password should be at least 6 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      if (dialogMode === "add") {
        const newUser: User = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          type: formData.type as "user" | "admin",
          status: formData.status as "verified" | "unverified",
          shops: [],
          createdAt: new Date(),
        };
        await createUser(newUser);
        setUsers((prev) => [...prev, newUser]);

        toast({
          title: "Success",
          description: "User created successfully",
        });
      } else if (dialogMode === "edit" && selectedUser) {
        const updatedUser: User = {
          ...selectedUser,
          name: formData.name,
          email: formData.email,
          ...(formData.password ? { password: formData.password } : {}),
          type: formData.type as "user" | "admin",
          status: formData.status as "verified" | "unverified",
        };
        if (!selectedUser._id) {
          throw new Error("User ID is required");
        }
        await updateUser(selectedUser._id, updatedUser);
        setUsers((prev) =>
          prev.map((user) =>
            user._id === selectedUser._id
              ? {
                  ...user,
                  name: formData.name,
                  email: formData.email,
                  type: formData.type as "user" | "admin",
                  status: formData.status as "verified" | "unverified",
                  ...(formData.password ? { password: formData.password } : {}),
                }
              : user
          )
        );
        toast({
          title: "Success",
          description: "User updated successfully",
        });
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to save user:", error);
      toast({
        title: "Error",
        description: "Failed to save user. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle delete user
  const confirmDeleteUser = async () => {
    if (!selectedUser || !selectedUser._id) return;

    try {
      // In a real app, this would be an API call to delete a user
      await deleteUser(selectedUser._id);
      setUsers((prev) => prev.filter((user) => user._id !== selectedUser._id));
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to delete user:", error);
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle verify user
  const handleVerifyUser = async (userId: string) => {
    try {
      // In a real app, this would be an API call
      setUsers((prev) =>
        prev.map((user) =>
          user._id === userId ? { ...user, status: "verified" } : user
        )
      );
      toast({
        title: "Success",
        description: "User verified successfully",
      });
    } catch (error) {
      console.error("Failed to verify user:", error);
      toast({
        title: "Error",
        description: "Failed to verify user. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Get filtered and sorted users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === "all" || user.type === filterType;

    const matchesStatus =
      filterStatus === "all" || user.status === filterStatus;

    const matchesShopOwner =
      !filterShopOwners || (user.shops && user.shops.length > 0);

    return matchesSearch && matchesType && matchesStatus && matchesShopOwner;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let fieldA: string | number = "";
    let fieldB: string | number = "";

    if (sortField in a) {
      const value = a[sortField];
      fieldA =
        value instanceof Date
          ? value.getTime()
          : Array.isArray(value)
          ? value.length
          : value ?? "";
    }

    if (sortField in b) {
      const value = b[sortField];
      fieldB =
        value instanceof Date
          ? value.getTime()
          : Array.isArray(value)
          ? value.length
          : value ?? "";
    }

    if (sortField === "createdAt") {
      fieldA = new Date(fieldA as string).getTime();
      fieldB = new Date(fieldB).getTime();
    }

    if (sortField === "shops") {
      fieldA = a.shops?.length || 0;
      fieldB = b.shops?.length || 0;
    }

    const sortOrder = sortDirection === "asc" ? 1 : -1;

    if (fieldA < fieldB) return -1 * sortOrder;
    if (fieldA > fieldB) return 1 * sortOrder;
    return 0;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = sortedUsers.slice(indexOfFirstItem, indexOfLastItem);

  // Handle sorting
  const handleSort = (field: keyof User) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Handle user actions
  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setDialogMode("view");
    setIsDialogOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setDialogMode("edit");
    setIsDialogOpen(true);
  };

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setDialogMode("delete");
    setIsDialogOpen(true);
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setDialogMode("add");
    setIsDialogOpen(true);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <Link href={`/admin`}>
          <Button variant="ghost" className="pl-0 mb-2 sm:mb-0">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
          <p className="text-gray-500">Manage and monitor user accounts</p>
        </div>
        <Button
          onClick={handleAddUser}
          className="mt-4 md:mt-0 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add User
        </Button>
      </div>

      {/* Stats Cards */}
      <UserStatsCards users={users} />

      {/* Tabs for different user views */}
      <Tabs defaultValue="all-users" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="all-users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>All Users</span>
          </TabsTrigger>
          <TabsTrigger value="unverified" className="flex items-center gap-2">
            <UserX className="h-4 w-4" />
            <span>Unverified</span>
          </TabsTrigger>
          <TabsTrigger value="shop-owners" className="flex items-center gap-2">
            <Store className="h-4 w-4" />
            <span>Shop Owners</span>
          </TabsTrigger>
          <TabsTrigger value="admins" className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" />
            <span>Admins</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all-users">
          {/* Search and Filters */}
          <UserFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterType={filterType}
            setFilterType={setFilterType}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            filterShopOwners={filterShopOwners}
            setFilterShopOwners={setFilterShopOwners}
          />

          {/* Users Table */}
          <Card className="mb-6">
            <CardContent className="p-0">
              <UserTable
                users={currentUsers}
                isLoading={isLoading}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                handleSort={handleSort}
                handleViewUser={handleViewUser}
                handleEditUser={handleEditUser}
                handleDeleteUser={handleDeleteUser}
                handleVerifyUser={handleVerifyUser}
                itemsPerPage={itemsPerPage}
                indexOfFirstItem={indexOfFirstItem}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="unverified">
          <UnverifiedUsersTabContent
            users={users.filter((u) => u.status === "unverified")}
            isLoading={isLoading}
            handleVerifyUser={handleVerifyUser}
            handleViewUser={handleViewUser}
          />
        </TabsContent>

        <TabsContent value="shop-owners">
          <ShopOwnersTabContent
            users={users.filter((u) => u.shops && u.shops.length > 0)}
            isLoading={isLoading}
            handleVerifyUser={handleVerifyUser}
          />
        </TabsContent>

        <TabsContent value="admins">
          <AdminsTabContent
            users={users.filter((u) => u.type === "admin")}
            isLoading={isLoading}
            handleViewUser={handleViewUser}
          />
        </TabsContent>
      </Tabs>

      {/* User Details Dialog */}
      <UserDetailsDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        mode={dialogMode}
        selectedUser={selectedUser}
        handleSubmit={handleSubmit}
        confirmDeleteUser={confirmDeleteUser}
        handleEditUser={handleEditUser}
        formData={formData}
        setFormData={setFormData}
        errors={errors}
      />
    </div>
  );
}
