import { useAuth } from "@/context/auth";
import useNotesStore from "@/store/useNotesStore";
import { UserButton } from "@clerk/clerk-react";
import { Plus, Search } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { AppLayoutProps } from "./AppLayout.types";

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  searchQuery,
  onSearchChange,
  onAddNote,
}) => {
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
                    <UserButton />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl p-4">{children}</main>
    </div>
  );
};
