import React, { createContext, useContext, useState, useEffect } from "react";
import apiService from "../services/apiService";
import { xhrAuthAPI } from "../services/xhrApi";

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  city?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    city?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Force exit loading state quickly
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    // Check if user is already logged in
    const initAuth = async () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        try {
          apiService.setToken(token);
          const userData = await xhrAuthAPI.getProfile();
          setUser(userData);
        } catch (error) {
          console.error("Failed to verify authentication:", error);
          localStorage.removeItem("authToken");
          apiService.clearToken();
        }
      }
      setIsLoading(false);
      clearTimeout(timer);
    };

    initAuth();

    return () => clearTimeout(timer);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log("🔧 Using XHR login API...");

      const response = await xhrAuthAPI.login({ email, password });

      // Set token in localStorage and API service
      if (response.token) {
        localStorage.setItem("authToken", response.token);
        apiService.setToken(response.token);
        console.log("Token saved to localStorage");
      }

      if (response.user) {
        setUser(response.user);
        console.log("User set in context");
      }

      console.log("✅ XHR Login completed successfully");
    } catch (error) {
      console.error("❌ XHR Login failed:", error);
      throw error;
    }
  };

  const register = async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    city?: string;
  }) => {
    try {
      console.log("🔧 Using XHR register API...");
      console.log("Attempting registration with:", {
        ...userData,
        password: "[HIDDEN]",
      });

      const response = await xhrAuthAPI.register(userData);

      // Set token in localStorage and API service
      if (response.token) {
        localStorage.setItem("authToken", response.token);
        apiService.setToken(response.token);
        console.log("Token saved to localStorage");
      }

      if (response.user) {
        setUser(response.user);
        console.log("User set in context");
      }

      console.log("✅ XHR Registration completed successfully");
    } catch (error) {
      console.error("❌ XHR Registration failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await xhrAuthAPI.logout();
    } catch (error) {
      console.error("XHR Logout failed:", error);
    } finally {
      localStorage.removeItem("authToken");
      apiService.clearToken();
      setUser(null);
    }
  };

  const updateUser = (userData: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...userData } : null));
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
