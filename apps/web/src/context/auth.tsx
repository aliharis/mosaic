import { client } from "@/utils/graphql-client";
import { useAuth as useClerkAuth } from "@clerk/clerk-react";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isSignedIn, getToken, isLoaded } = useClerkAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAuthToken = async () => {
      if (!isLoaded) return; // Wait for Clerk to load

      if (isSignedIn) {
        const token = await getToken();
        if (token) {
          client.setHeader("Authorization", `Bearer ${token}`);
        }
      } else {
        client.setHeader("Authorization", "");
      }

      setIsLoading(false);
    };

    fetchAuthToken();
  }, [isSignedIn, getToken, isLoaded]);

  return <AuthContext.Provider value={{ isLoading }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
