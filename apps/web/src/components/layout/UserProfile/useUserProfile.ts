import { useState, useEffect } from "react";
import type { User } from "@/types";

export const useUserProfile = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleProfileSubmit = ({
    name,
    color,
  }: Omit<User, "id" | "lastActive">) => {
    const newUser: User = {
      id: "1",
      name,
      color,
      lastActive: new Date(),
    };
    setCurrentUser(newUser);
    localStorage.setItem("userProfile", JSON.stringify(newUser));
  };

  useEffect(() => {
    const savedProfile = localStorage.getItem("userProfile");
    if (savedProfile) {
      setCurrentUser(JSON.parse(savedProfile));
    }
  }, []);

  return {
    currentUser,
    handleProfileSubmit,
  };
};
