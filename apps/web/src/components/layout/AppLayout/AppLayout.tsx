import React, { useEffect, useRef } from "react";
import { Plus, Search, Settings, LogOut } from "lucide-react";
import type { AppLayoutProps } from "./AppLayout.types";
import { useAuth } from "@/context/auth";
import useNotesStore from "@/store/useNotesStore";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  searchQuery,
  onSearchChange,
  onAddNote,
}) => {
  const { user, logout } = useAuth();
  const openNewNoteModal = useNotesStore((state) => state.openNewNoteModal);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();

    // Redirect to the login page
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-20 border-b bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold text-gray-900">mosaic</h1>
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
                placeholder="Search your notes"
                className="flex-1 bg-transparent outline-none placeholder:text-gray-500"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
            <div className="hidden items-center gap-4 sm:flex">
              <button
                onClick={openNewNoteModal}
                className="flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
                New Note
              </button>
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2"
                >
                  <div className="flex -space-x-2">
                    <div
                      className="relative inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-sm font-medium text-white"
                      style={{ backgroundColor: user?.color }}
                      title={`${user?.name} (You)`}
                    >
                      {user?.name.charAt(0).toUpperCase()}
                    </div>
                  </div>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                    <button
                      disabled
                      className="flex w-full text-gray-300 cursor-not-allowed items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => {}}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </button>
                    <button
                      className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl p-4">{children}</main>
    </div>
  );
};
