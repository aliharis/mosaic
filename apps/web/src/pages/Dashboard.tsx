import { AppLayout } from "@/components/layout/AppLayout";
import Notes from "@/components/Notes";
import { useAuth } from "@/context/auth";
import { useState } from "react";

const MOCK_USERS = [
  { id: "2", name: "Bob", color: "#B5DEFF", lastActive: new Date() },
  { id: "3", name: "Charlie", color: "#B5FFB8", lastActive: new Date() },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <AppLayout
      currentUser={user!}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      onAddNote={() => {}}
      mockUsers={MOCK_USERS}
    >
      <Notes />
    </AppLayout>
  );
}
