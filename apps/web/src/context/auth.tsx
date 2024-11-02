import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "@/types";
import { LOGIN_MUTATION } from "@/graphql/mutations/user";
import { client } from "@/utils/graphql-client";
import { LoginResponse } from "@/graphql/types/graphql";

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
      const savedToken = localStorage.getItem("token");
      setTimeout(() => {
        if (savedProfile) {
          setUser(JSON.parse(savedProfile));
        }

        // Update the GraphQL client headers with the saved token
        if (savedToken) {
          client.setHeader("Authorization", `Bearer ${savedToken}`);
        }
        setIsLoading(false);
      }, 1000); // 1 second delay to show splash screen
    };

    loadUser();
  }, []);

  const login = async (profile: Omit<User, "id" | "lastActive">) => {
    const newUser: User = {
      id: crypto.randomUUID(),
      name: profile.name,
      color: profile.color,
      lastActive: new Date(),
    };

    // Save the user to the database
    const { data, error } = await client.request<{ login: LoginResponse }>({
      query: LOGIN_MUTATION,
      variables: { input: newUser },
    });

    if (error) {
      console.error("Error logging in:", error);
      return;
    }

    const { token } = data?.login ?? {};

    setUser(newUser);
    localStorage.setItem("userProfile", JSON.stringify(newUser));
    localStorage.setItem("token", token as string);

    // Set the token in the GraphQL client headers
    client.setHeader("Authorization", `Bearer ${token}`);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("userProfile");
    localStorage.removeItem("token");

    // Clear the Authorization header
    client.setHeader("Authorization", "");
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
