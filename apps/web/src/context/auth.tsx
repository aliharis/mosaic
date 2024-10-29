import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "@/types";

interface AuthContextType {
  user: User | null;
  login: (profile: Omit<User, "id" | "lastActive">) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = () => {
      const savedProfile = localStorage.getItem("userProfile");
      setTimeout(() => {
        if (savedProfile) {
          setUser(JSON.parse(savedProfile));
        }
        setIsLoading(false);
      }, 1000); // 1 second delay to show splash screen
    };

    loadUser();
  }, []);

  const login = (profile: Omit<User, "id" | "lastActive">) => {
    const newUser: User = {
      id: `user-${Date.now()}`, // Generate a unique ID
      name: profile.name,
      color: profile.color,
      lastActive: new Date(),
    };
    setUser(newUser);
    localStorage.setItem("userProfile", JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("userProfile");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
