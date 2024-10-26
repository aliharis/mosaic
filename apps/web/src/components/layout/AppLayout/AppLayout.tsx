import React from "react";
import { Plus, Search } from "lucide-react";
import type { AppLayoutProps } from "./AppLayout.types";

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  currentUser,
  searchQuery,
  onSearchChange,
  onAddNote,
  mockUsers,
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-20 border-b bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold text-gray-900">Mosaic</h1>
              <button
                onClick={onAddNote}
                className="flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 sm:hidden"
              >
                <Plus className="h-4 w-4" />
                New
              </button>
            </div>
            <div className="flex flex-1 items-center gap-2 rounded-full bg-gray-100 px-4 py-2">
              <Search className="h-5 w-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search live notes"
                className="flex-1 bg-transparent outline-none placeholder:text-gray-500"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
            <div className="hidden items-center gap-4 sm:flex">
              <button
                onClick={onAddNote}
                className="flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
                New Note
              </button>
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  <div
                    className="relative inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-sm font-medium text-white"
                    style={{ backgroundColor: currentUser.color }}
                    title={`${currentUser.name} (You)`}
                  >
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  {mockUsers.map((user) => (
                    <div
                      key={user.id}
                      className="relative inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-sm font-medium text-white"
                      style={{ backgroundColor: user.color }}
                      title={user.name}
                    >
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl p-4">{children}</main>
    </div>
  );
};
