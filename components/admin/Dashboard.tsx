"use client";

import { use, useEffect, useState } from "react";
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
import { useAuth } from "@/components/AuthProvider";
import { fetchUsersCount } from "@/lib/api/admin/users";
import { fetchShopsCount } from "@/lib/api/admin/shops";
import { fetchRecipeCounts } from "@/lib/api/admin/recipes";
import { useRouter } from "next/navigation";
import Sidebar from "./SideBar";
import Cookies from "js-cookie";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingApprovals: 0,
    totalShops: 0,
    pendingShops: 0,
    totalRecipes: 0,
    newRecipesToday: 0,
  });
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
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
    const getUserCount = async () => {
      try {
        const response = await fetchUsersCount();
        const data = response.data;
        setStats((prevStats) => ({
          ...prevStats,
          totalUsers: data.totalCount,
          pendingApprovals: data.unverifiedCount,
        }));
      } catch (error) {
        console.error("Error fetching user count:", error);
      }
    };
    const getShopCount = async () => {
      try {
        const response = await fetchShopsCount();
        const data = response.data;
        setStats((prevStats) => ({
          ...prevStats,
          totalShops: data.totalCount,
          pendingShops: data.notApprovedCount,
        }));
      } catch (error) {
        console.error("Error fetching shop count:", error);
      }
    };
    const getRecipeCount = async () => {
      try {
        const response = await fetchRecipeCounts();
        const data = response.data;
        setStats((prevStats) => ({
          ...prevStats,
          totalRecipes: data.totalCount,
          newRecipesToday: data.todayCreatedCount,
        }));
      } catch (error) {
        console.error("Error fetching recipe count:", error);
      }
    };
    getRecipeCount();
    getShopCount();
    getUserCount();
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
            {/* <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={user?.avatar || ""}
                    alt={user?.name || ""}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-primary text-primary-foreground font-medium">
                    {getInitial(user?.name || "")}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block w-28 truncate">
                  <p className="text-sm font-medium text-nowrap overflow-hidden text-ellipsis">
                    {user?.name || ""}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={logout}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div> */}
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
                      <ActivityItem
                        avatar="/avatars/user1.png"
                        fallback="JD"
                        title="John Doe registered"
                        description="New user registration"
                        time="10 minutes ago"
                        status="pending"
                      />
                      <ActivityItem
                        avatar="/avatars/user2.png"
                        fallback="AS"
                        title="Alice Smith updated profile"
                        description="Changed contact information"
                        time="1 hour ago"
                        status="completed"
                      />
                      <ActivityItem
                        avatar="/avatars/user3.png"
                        fallback="RJ"
                        title="Robert Johnson"
                        description="Account verification requested"
                        time="3 hours ago"
                        status="pending"
                      />
                      <ActivityItem
                        avatar="/avatars/user4.png"
                        fallback="ML"
                        title="Maria Lopez"
                        description="Changed password"
                        time="5 hours ago"
                        status="completed"
                      />
                    </TabsContent>

                    <TabsContent value="shops" className="space-y-4 mt-4">
                      <ActivityItem
                        avatar="/shops/shop1.png"
                        fallback="TS"
                        title="The Spice Market requested approval"
                        description="New shop registration"
                        time="2 hours ago"
                        status="pending"
                      />
                      <ActivityItem
                        avatar="/shops/shop2.png"
                        fallback="BK"
                        title="Bakery Kings updated information"
                        description="Changed business hours"
                        time="4 hours ago"
                        status="completed"
                      />
                    </TabsContent>

                    <TabsContent value="recipes" className="space-y-4 mt-4">
                      <ActivityItem
                        avatar="/recipes/recipe1.png"
                        fallback="PC"
                        title="Pasta Carbonara"
                        description="New recipe published by John Doe"
                        time="30 minutes ago"
                        status="completed"
                      />
                      <ActivityItem
                        avatar="/recipes/recipe2.png"
                        fallback="VE"
                        title="Vegetable Enchiladas"
                        description="Recipe updated by Maria Lopez"
                        time="2 hours ago"
                        status="completed"
                      />
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
