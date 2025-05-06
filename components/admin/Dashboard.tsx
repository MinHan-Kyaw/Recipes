"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Store,
  UtensilsCrossed,
  Search,
  UserCheck,
  MapPinCheck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchUsersCount } from "@/lib/api/admin/users";
import { fetchShopsCount } from "@/lib/api/admin/shops";
import { fetchRecipeCounts } from "@/lib/api/admin/recipes";
import { useRouter } from "next/navigation";
import Sidebar from "./SideBar";
import Cookies from "js-cookie";
import { ActivityLog } from "@/lib/types/activitylog";
import fetchActivityLogs from "@/lib/api/admin/activitylog";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingApprovals: 0,
    totalShops: 0,
    pendingShops: 0,
    totalRecipes: 0,
    newRecipesToday: 0,
  });

  const [activityLogs, setActivityLogs] = useState<{
    users: ActivityLog[];
    shops: ActivityLog[];
    recipes: ActivityLog[];
  }>({
    users: [],
    shops: [],
    recipes: [],
  });
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

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

    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch stats data
        const [userCountResponse, shopCountResponse, recipeCountResponse] =
          await Promise.all([
            fetchUsersCount(),
            fetchShopsCount(),
            fetchRecipeCounts(),
          ]);

        setStats({
          totalUsers: userCountResponse.data.totalCount,
          pendingApprovals: userCountResponse.data.unverifiedCount,
          totalShops: shopCountResponse.data.totalCount,
          pendingShops: shopCountResponse.data.notApprovedCount,
          totalRecipes: recipeCountResponse.data.totalCount,
          newRecipesToday: recipeCountResponse.data.todayCreatedCount,
        });

        // Fetch activity logs
        const [userLogsResponse, shopLogsResponse, recipeLogsResponse] =
          await Promise.all([
            fetchActivityLogs("user", 5),
            fetchActivityLogs("shop", 5),
            fetchActivityLogs("recipe", 5),
          ]);

        setActivityLogs({
          users: userLogsResponse.data,
          shops: shopLogsResponse.data,
          recipes: recipeLogsResponse.data,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isAuthorized, isCheckingAuth]);

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
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-4 w-full">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input placeholder="Search..." className="pl-8" />
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Dashboard Overview
            </h1>
            <p className="text-gray-500">Welcome back, admin!</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <motion.div
              className="col-span-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    Total Users
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold">{stats.totalUsers}</p>
                      <div className="flex items-center mt-1">
                        <Badge
                          variant="outline"
                          className="bg-amber-50 text-amber-700 border-amber-200"
                        >
                          {stats.pendingApprovals} pending approvals
                        </Badge>
                      </div>
                    </div>
                    <Users className="h-8 w-8 text-primary opacity-80" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              className="col-span-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    Total Shops
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold">{stats.totalShops}</p>
                      <div className="flex items-center mt-1">
                        <Badge
                          variant="outline"
                          className="bg-amber-50 text-amber-700 border-amber-200"
                        >
                          {stats.pendingShops} pending approvals
                        </Badge>
                      </div>
                    </div>
                    <Store className="h-8 w-8 text-primary opacity-80" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              className="col-span-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    Total Recipes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold">{stats.totalRecipes}</p>
                      <div className="flex items-center mt-1">
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700 border-green-200"
                        >
                          +{stats.newRecipesToday} today
                        </Badge>
                      </div>
                    </div>
                    <UtensilsCrossed className="h-8 w-8 text-primary opacity-80" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Recent Activity and Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="users">
                    <TabsList>
                      <TabsTrigger value="users">Users</TabsTrigger>
                      <TabsTrigger value="shops">Shops</TabsTrigger>
                      <TabsTrigger value="recipes">Recipes</TabsTrigger>
                    </TabsList>

                    <TabsContent value="users" className="space-y-4 mt-4">
                      {isLoading ? (
                        <p className="text-sm text-gray-500">
                          Loading activity logs...
                        </p>
                      ) : activityLogs.users.length === 0 ? (
                        <p className="text-sm text-gray-500">
                          No recent user activity
                        </p>
                      ) : (
                        activityLogs.users.map((log) => (
                          <ActivityItem
                            key={log._id}
                            avatar={`/api/placeholder/40/40`}
                            fallback={getInitials(log.userName)}
                            title={log.entityName}
                            description={log.detail}
                            time={formatTimestamp(log.timestamp || new Date())}
                            status={getStatusFromAction(log.actionType)}
                          />
                        ))
                      )}
                    </TabsContent>

                    <TabsContent value="shops" className="space-y-4 mt-4">
                      {isLoading ? (
                        <p className="text-sm text-gray-500">
                          Loading activity logs...
                        </p>
                      ) : activityLogs.shops.length === 0 ? (
                        <p className="text-sm text-gray-500">
                          No recent shop activity
                        </p>
                      ) : (
                        activityLogs.shops.map((log) => (
                          <ActivityItem
                            key={log._id}
                            avatar={`/api/placeholder/40/40`}
                            fallback={getInitials(log.entityName)}
                            title={log.entityName}
                            description={log.detail}
                            time={formatTimestamp(log.timestamp || new Date())}
                            status={getStatusFromAction(log.actionType)}
                          />
                        ))
                      )}
                    </TabsContent>

                    <TabsContent value="recipes" className="space-y-4 mt-4">
                      {isLoading ? (
                        <p className="text-sm text-gray-500">
                          Loading activity logs...
                        </p>
                      ) : activityLogs.recipes.length === 0 ? (
                        <p className="text-sm text-gray-500">
                          No recent recipe activity
                        </p>
                      ) : (
                        activityLogs.recipes.map((log) => (
                          <ActivityItem
                            key={log._id}
                            avatar={`/api/placeholder/40/40`}
                            fallback={getInitials(log.entityName)}
                            title={log.entityName}
                            description={log.detail}
                            time={formatTimestamp(log.timestamp || new Date())}
                            status={getStatusFromAction(log.actionType)}
                          />
                        ))
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              className="lg:col-span-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    className="w-full flex items-center justify-start gap-2"
                    onClick={() =>
                      router.push("/admin/users?filter=unverified")
                    }
                  >
                    <UserCheck className="h-4 w-4" />
                    Approve Pending Users
                  </Button>
                  <Button
                    className="w-full flex items-center justify-start gap-2"
                    onClick={() => router.push("/admin/shops?filter=pending")}
                  >
                    <MapPinCheck className="h-4 w-4" />
                    Approve Shop Requests
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}

// Helper functions
function getInitials(name: string) {
  if (!name) return "??";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatTimestamp(timestamp: Date | string) {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 60)
    return `${diffMins} minute${diffMins !== 1 ? "s" : ""} ago`;
  if (diffHours < 24)
    return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
  if (diffDays < 30) return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;

  return date.toLocaleDateString();
}

function getStatusFromAction(actionType: string): "pending" | "completed" {
  switch (actionType) {
    case "pending":
      return "pending";
    case "approve":
      return "completed";
    case "create":
    case "update":
    case "delete":
      return "completed";
    case "register":
    case "login":
      return "completed";
    default:
      return "completed";
  }
}

interface ActivityItemProps {
  avatar: string;
  fallback: string;
  title: string;
  description: string;
  time: string;
  status: "pending" | "completed";
}

function ActivityItem({
  avatar,
  fallback,
  title,
  description,
  time,
  status,
}: ActivityItemProps) {
  return (
    <div className="flex items-start space-x-4 p-3 rounded-md border border-gray-100 hover:bg-gray-50 transition-colors">
      <Avatar className="h-10 w-10">
        <AvatarImage src={avatar} alt={title} />
        <AvatarFallback className="bg-primary/10 text-primary">
          {fallback}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{title}</p>
        <p className="text-sm text-gray-500 truncate">{description}</p>
        <p className="text-xs text-gray-400">{time}</p>
      </div>
      <Badge
        variant="outline"
        className={`${
          status === "pending"
            ? "bg-amber-50 text-amber-700 border-amber-200"
            : "bg-green-50 text-green-700 border-green-200"
        }`}
      >
        {status === "pending" ? "Pending" : "Completed"}
      </Badge>
    </div>
  );
}
