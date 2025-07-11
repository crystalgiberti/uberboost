import React, { createContext, useContext, useState, useEffect } from "react";
import apiService from "../services/apiService";
import { atomicRegister, atomicLogin } from "../services/atomicApi";
import { debugFetch, testMinimalAuth } from "../services/debugFetch";

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
    // Check if user is already logged in
    const initAuth = async () => {
      if (apiService.isAuthenticated()) {
        try {
          const userData = await apiService.getMe();
          setUser(userData.user);
        } catch (error) {
          console.error("Failed to verify authentication:", error);
          apiService.clearToken();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log("⚛️ Using ATOMIC login API...");

      // Run debug tests first
      console.log("Running debug fetch tests...");
      await debugFetch();

      const response = await atomicLogin(email, password);

      // Set token in localStorage and API service
      if (response.token) {
        localStorage.setItem("auth_token", response.token);
        apiService.setToken(response.token);
        console.log("Token saved to localStorage");
      }

      if (response.user) {
        setUser(response.user);
        console.log("User set in context");
      }

      console.log("✅ Login completed in context");
    } catch (error) {
      console.error("❌ Login failed in context:", error);

      // Try minimal auth as fallback
      console.log("Trying minimal auth fallback...");
      try {
        const fallbackResult = await testMinimalAuth();
        console.log("Minimal auth result:", fallbackResult);
      } catch (fallbackError) {
        console.error("Fallback also failed:", fallbackError);
      }

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
      console.log("⚛️ Using ATOMIC register API...");
      console.log("Attempting registration with:", {
        ...userData,
        password: "[HIDDEN]",
      });

      // Run debug tests first
      console.log("Running debug fetch tests...");
      await debugFetch();

      const response = await atomicRegister(userData);

      // Set token in localStorage and API service
      if (response.token) {
        localStorage.setItem("auth_token", response.token);
        apiService.setToken(response.token);
        console.log("Token saved to localStorage");
      }

      if (response.user) {
        setUser(response.user);
        console.log("User set in context");
      }

      console.log("✅ Registration completed in context");
    } catch (error) {
      console.error("❌ Registration failed in context:", error);

      // Try minimal auth as fallback
      console.log("Trying minimal auth fallback...");
      try {
        const fallbackResult = await testMinimalAuth();
        console.log("Minimal auth result:", fallbackResult);
      } catch (fallbackError) {
        console.error("Fallback also failed:", fallbackError);
      }

      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
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
