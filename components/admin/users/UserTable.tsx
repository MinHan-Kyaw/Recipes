import { MoreHorizontal, CheckCircle, XCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "@/lib/types/user";
import { DataTable } from "../DataTable";

interface UserTableProps {
  users: User[];
  isLoading: boolean;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  handleSort: (field: keyof User) => void;
  handleViewUser: (user: User) => void;
  handleEditUser: (user: User) => void;
  handleDeleteUser: (user: User) => void;
  handleVerifyUser: (userId: string) => void;
  itemsPerPage: number;
  indexOfFirstItem: number;
}

export function UserTable({
  users,
  isLoading,
  currentPage,
  setCurrentPage,
  handleSort,
  handleViewUser,
  handleEditUser,
  handleDeleteUser,
  handleVerifyUser,
  itemsPerPage,
}: UserTableProps) {
  // Format date for display
  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get initials for avatar
  const getInitials = (name: string) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const columns = [
    {
      key: "index",
      header: "#",
      className: "w-12",
      render: (_: User, index: number) => <span>{index + 1}</span>,
    },
    {
      key: "name",
      header: "User",
      sortable: true,
      render: (user: User) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={user.avatar}
              alt={user.name}
              className="object-cover"
            />
            <AvatarFallback className="bg-primary/10 text-primary">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{user.name}</p>
            <p className="text-xs text-gray-500 md:hidden">{user.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "email",
      header: "Email",
      sortable: true,
      hidden: "md",
    },
    {
      key: "type",
      header: "Type",
      sortable: true,
      hidden: "md",
      render: (user: User) => (
        <Badge
          variant="outline"
          className={
            user.type === "admin"
              ? "bg-purple-50 text-purple-700 border-purple-200"
              : "bg-blue-50 text-blue-700 border-blue-200"
          }
        >
          {user.type}
        </Badge>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (user: User) => (
        <Badge
          variant="outline"
          className={
            user.status === "verified"
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-amber-50 text-amber-700 border-amber-200"
          }
        >
          {user.status === "verified" ? (
            <div className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              <span>Verified</span>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <XCircle className="h-3 w-3" />
              <span>Unverified</span>
            </div>
          )}
        </Badge>
      ),
    },
    {
      key: "shops",
      header: "Shops",
      sortable: true,
      hidden: "md",
      render: (user: User) => (
        <span>{(user.shops?.length ?? 0) > 0 ? user.shops?.length : "-"}</span>
      ),
    },
    {
      key: "createdAt",
      header: "Joined",
      sortable: true,
      hidden: "md",
      render: (user: User) => (
        <span>{user.createdAt ? formatDate(user.createdAt) : "-"}</span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      render: (user: User) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => handleViewUser(user)}>
              View details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleEditUser(user)}>
              Edit user
            </DropdownMenuItem>
            {user.status === "unverified" && (
              <DropdownMenuItem
                onClick={() => user._id && handleVerifyUser(user._id)}
              >
                Verify user
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600"
              onClick={() => handleDeleteUser(user)}
            >
              Delete user
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <DataTable
      data={users}
      columns={columns}
      keyField="_id"
      isLoading={isLoading}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      itemsPerPage={itemsPerPage}
      onSort={(field: string) => handleSort(field as keyof User)}
      emptyMessage="No users found"
      loadingMessage="Loading users..."
    />
  );
}
