import type { User } from "@/types";

export interface AppLayoutProps {
  children: React.ReactNode;
  currentUser: User;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddNote: () => void;
  mockUsers: User[];
}
