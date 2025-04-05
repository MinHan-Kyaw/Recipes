"use client";
import { User } from "@/lib/types/user";
import Cookies from "js-cookie";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

// Create context with a non-null default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  setUser: () => {},
  logout: async () => {},
  refreshUser: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const token = Cookies.get("token");
      if (token && token !== "undefined") {
        const response = await fetch("/api/auth/me");
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setUser(data.data);
            return;
          }
        } else {
          // Clear invalid token
          if (response.status === 401) {
            Cookies.remove("token");
            setUser(null);
          }
        }
      } else {
        // Make sure user is null if no token exists
        setUser(null);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Use useCallback to prevent unnecessary re-renders
  const refreshUser = useCallback(fetchUser, []);

  useEffect(() => {
    fetchUser();

    // Set up event listener for auth state changes
    window.addEventListener("storage", (event) => {
      if (event.key === "token") {
        fetchUser();
      }
    });

    return () => {
      window.removeEventListener("storage", () => {});
    };
  }, []);

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      Cookies.remove("token");
      setUser(null);
      window.location.href = "/";
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const value = { user, loading, setUser, logout, refreshUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Export the hook with a more direct approach
export function useAuth() {
  return useContext(AuthContext);
}
