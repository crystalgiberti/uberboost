import React, { createContext, useContext, useState, useEffect } from "react";
import {
  simpleRegister,
  simpleLogin,
  testApiConnection,
} from "../services/simpleApiService";

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  city?: string;
}

interface SafeAuthContextType {
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
  testConnection: () => Promise<boolean>;
}

const SafeAuthContext = createContext<SafeAuthContextType | undefined>(
  undefined,
);

export function SafeAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("=== SAFE AUTH PROVIDER INITIALIZING ===");
    // Check if we have a token and validate it
    const token = localStorage.getItem("auth_token");
    console.log("Found token:", !!token);

    // For now, just set loading to false
    // TODO: Validate token with backend
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    console.log("=== SAFE AUTH LOGIN ===");
    try {
      const response = await simpleLogin(email, password);

      if (response.token) {
        localStorage.setItem("auth_token", response.token);
        console.log("Token saved to localStorage");
      }

      if (response.user) {
        setUser(response.user);
        console.log("User set in state:", response.user.email);
      }

      console.log("✅ Safe login completed successfully");
    } catch (error) {
      console.error("❌ Safe login failed:", error);
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
    console.log("=== SAFE AUTH REGISTER ===");
    try {
      const response = await simpleRegister(userData);

      if (response.token) {
        localStorage.setItem("auth_token", response.token);
        console.log("Token saved to localStorage");
      }

      if (response.user) {
        setUser(response.user);
        console.log("User set in state:", response.user.email);
      }

      console.log("✅ Safe registration completed successfully");
    } catch (error) {
      console.error("❌ Safe registration failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    console.log("=== SAFE AUTH LOGOUT ===");
    try {
      localStorage.removeItem("auth_token");
      setUser(null);
      console.log("✅ Safe logout completed");
    } catch (error) {
      console.error("❌ Safe logout failed:", error);
      throw error;
    }
  };

  const value: SafeAuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    testConnection,
  };

  return (
    <SafeAuthContext.Provider value={value}>
      {children}
    </SafeAuthContext.Provider>
  );
}

export function useSafeAuth() {
  const context = useContext(SafeAuthContext);
  if (context === undefined) {
    throw new Error("useSafeAuth must be used within a SafeAuthProvider");
  }
  return context;
}
