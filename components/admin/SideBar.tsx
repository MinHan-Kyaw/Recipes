// components/admin/Sidebar.jsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Store,
  UtensilsCrossed,
  Home,
  Menu,
  X,
  LogOut,
  Settings,
  LineChart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/AuthProvider";
import { usePathname } from "next/navigation";
import { fetchShopsCount } from "@/lib/api/admin/shops";
import { fetchUsersCount } from "@/lib/api/admin/users";

export default function Sidebar() {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();
  const [userCounts, setUserCounts] = useState(0);
  const [shopCounts, setShopCounts] = useState(0);

  // Fetch user counts
  useEffect(() => {
    const fetchUsersCountFun = async () => {
      try {
        const response = await fetchUsersCount();
        if (response.status) {
          const data = response.data;
          setUserCounts(data.unverifiedCount);
        }
      } catch (error) {
        console.error("Error fetching user counts:", error);
      }
    };

    fetchUsersCountFun();

    // Optional: Set up polling interval to keep counts updated
    // const intervalId = setInterval(fetchUsersCountFun, 60000); // Update every minute

    // return () => clearInterval(intervalId);
  }, []);

  // Fetch shop counts
  useEffect(() => {
    const fetchShopsCountFun = async () => {
      try {
        const response = await fetchShopsCount();
        if (response.success) {
          const data = response.data;
          setShopCounts(data.notApprovedCount);
        }
      } catch (error) {
        console.error("Error fetching shop counts:", error);
      }
    };

    fetchShopsCountFun();

    // Optional: Set up polling interval to keep counts updated
    // const intervalId = setInterval(fetchShopsCountFun, 60000); // Update every minute

    // return () => clearInterval(intervalId);
  }, []);

  // Get first letter of user's name for the avatar
  const getInitial = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : "";
  };

  return (
    <motion.div
      className={`bg-white shadow-md ${
        isSidebarCollapsed ? "w-16" : "w-64"
      } transition-all duration-300 ease-in-out h-screen`}
      animate={{ width: isSidebarCollapsed ? 64 : 256 }}
    >
      <div className="flex items-center justify-between p-4 border-b">
        {!isSidebarCollapsed && (
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-lg font-bold text-primary"
          >
            Recipe Admin
          </motion.h1>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
        >
          {isSidebarCollapsed ? (
            <Menu className="h-5 w-5" />
          ) : (
            <X className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Sidebar Navigation */}
      <div className="p-2 flex flex-col h-[calc(100%-64px)] justify-between">
        <nav className="space-y-1">
          {/* Main Navigation */}
          <SidebarItem
            icon={<Home className="h-5 w-5" />}
            label="Dashboard"
            active={pathname === "/admin" || pathname === "/admin/dashboard"}
            collapsed={isSidebarCollapsed}
            href="/admin/dashboard"
          />

          {/* Management Section */}
          {!isSidebarCollapsed && (
            <div className="mt-4 mb-2 px-3">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                Management
              </p>
            </div>
          )}

          <SidebarItem
            icon={<Users className="h-5 w-5" />}
            label="Users"
            collapsed={isSidebarCollapsed}
            href="/admin/users"
            active={pathname === "/admin/users"}
            badge={userCounts > 0 ? userCounts : null}
          />
          <SidebarItem
            icon={<Store className="h-5 w-5" />}
            label="Shops"
            collapsed={isSidebarCollapsed}
            href="/admin/shops"
            active={pathname === "/admin/shops"}
            badge={shopCounts > 0 ? shopCounts : null}
          />
          <SidebarItem
            icon={<UtensilsCrossed className="h-5 w-5" />}
            label="Recipes"
            collapsed={isSidebarCollapsed}
            href="/admin/recipes"
            active={pathname === "/admin/recipes"}
          />

          {/* Admin Section */}
          {/* {!isSidebarCollapsed && (
            <div className="mt-4 mb-2 px-3">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                Admin
              </p>
            </div>
          )}

          <SidebarItem
            icon={<LineChart className="h-5 w-5" />}
            label="Analytics"
            collapsed={isSidebarCollapsed}
            href="/admin/analytics"
            active={pathname === "/admin/analytics"}
          />
          <SidebarItem
            icon={<Settings className="h-5 w-5" />}
            label="Settings"
            collapsed={isSidebarCollapsed}
            href="/admin/settings"
            active={pathname === "/admin/settings"}
          /> */}
        </nav>

        {/* User Profile Section */}
        <div
          className={`mt-auto pt-4 ${
            isSidebarCollapsed ? "" : "border-t border-gray-200"
          }`}
        >
          {isSidebarCollapsed ? (
            <Button
              variant="ghost"
              size="icon"
              className="w-full flex justify-center"
              onClick={logout}
            >
              <LogOut className="h-5 w-5 text-gray-500 hover:text-primary" />
            </Button>
          ) : (
            <div className="flex items-center px-2 py-2">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage src={user?.avatar || ""} alt={user?.name || ""} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {getInitial(user?.name || "")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 truncate">
                <p className="text-sm font-medium truncate">
                  {user?.name || ""}
                </p>
                <Button
                  variant="link"
                  className="p-0 h-auto text-xs text-gray-500 hover:text-primary flex items-center gap-1"
                  onClick={logout}
                >
                  <LogOut size={14} />
                  Sign out
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// Sidebar Item Component
function SidebarItem({
  icon,
  label,
  active = false,
  collapsed = false,
  href = "#",
  badge = null,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  collapsed?: boolean;
  href?: string;
  badge?: number | null;
}) {
  return (
    <a
      href={href}
      className={`flex items-center justify-between px-3 py-2.5 rounded-md transition-all duration-200 ${
        active
          ? "bg-primary/10 text-primary font-medium border-l-4 border-primary"
          : "text-gray-700 hover:bg-gray-100 hover:text-primary"
      } ${collapsed ? "justify-center" : ""}`}
    >
      <div className="flex items-center">
        <div className={`${collapsed ? "" : "mr-3"} text-lg`}>{icon}</div>
        {!collapsed && <span>{label}</span>}
      </div>

      {!collapsed && badge && (
        <Badge
          variant="secondary"
          className="bg-primary/10 text-primary text-xs"
        >
          {badge}
        </Badge>
      )}

      {collapsed && badge && (
        <Badge
          variant="secondary"
          className="absolute right-1.5 top-1 bg-primary text-white text-xs h-4 w-4 flex items-center justify-center p-0 rounded-full"
        >
          {badge}
        </Badge>
      )}
    </a>
  );
}
