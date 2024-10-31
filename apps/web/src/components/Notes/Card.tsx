import { debounce } from "lodash";
import { Clock, Palette, Trash2 } from "lucide-react";
import React, { useCallback } from "react";
import type { Note } from "@/types";
import UserList from "../UserList";
import { renderBlocks } from "@/utils/block-renderer";

interface NoteCardProps {
  note: Note;
  onDelete: (id: string) => void;
  onUpdate: (id: string, changes: Partial<Note>, version: number) => void;
  onNoteClick: () => void;
}

const colors = [
  "bg-white",
  "bg-blue-50",
  "bg-purple-50",
  "bg-pink-50",
  "bg-yellow-50",
  "bg-green-50",
];

export default function NoteCard({
  note,
  onDelete,
  onUpdate,
  onNoteClick,
}: NoteCardProps) {
  const [localNote, setLocalNote] = React.useState(note);
  const [showColors, setShowColors] = React.useState(false);

  const handleClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    // Don't open modal when clicking buttons or color picker
    if (!target.closest("button")) {
      onNoteClick();
    }
  };

  // Debounced update function to limit the number of HTTP requests
  const debouncedUpdate = useCallback(
    (changes: Partial<Note>) => {
      debounce(() => {
        // Update parent state
        onUpdate(note.id, changes, note.version);
      }, 1000)();
    },
    [note.id, note.version, onUpdate]
  );

  // Handle local changes
  const handleChange = (field: keyof Note, value: string) => {
    const changes = {
      [field]: value,
      version: note.version + 1,
      lastEdited: new Date(),
    };
    setLocalNote((prev) => ({ ...prev, ...changes }));
    debouncedUpdate(changes);
  };

  return (
    <div
      onClick={handleClick}
      className={`${localNote.color} group cursor-pointer rounded-lg border border-gray-200 p-4 shadow-sm transition-all hover:shadow-md`}
    >
      <div className="mb-3 flex items-center justify-between">
        {note.activeUsers && <UserList users={note.activeUsers} />}
        <span className="flex items-center gap-1 text-xs text-gray-500">
          <Clock className="h-3 w-3" />
          {new Date(note.lastEdited).toLocaleTimeString()}
        </span>
      </div>

      <div className="space-y-2">
        <input
          type="text"
          value={localNote.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="Title"
          className="w-full bg-transparent text-lg font-medium outline-none placeholder:text-gray-400"
          onClick={(e) => e.stopPropagation()}
        />
        <div className="line-clamp-3">
          {note.blocks.length === 0 && (
            <span className="text-gray-400">Take a note...</span>
          )}

          {note.blocks.length > 0 && (
            <div
              dangerouslySetInnerHTML={{ __html: renderBlocks(note.blocks) }}
            />
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between opacity-0 transition-opacity group-hover:opacity-100">
        <div className="flex gap-2">
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowColors(!showColors);
              }}
              className="rounded-full p-2 hover:bg-black/5"
            >
              <Palette className="h-4 w-4 text-gray-600" />
            </button>

            {showColors && (
              <div className="absolute bottom-full left-0 mb-2 flex gap-1 rounded-lg border bg-white p-2 shadow-lg">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleChange("color", color);
                      setShowColors(false);
                    }}
                    className={`h-6 w-6 rounded-full ${color} border hover:shadow-md`}
                  />
                ))}
              </div>
            )}
          </div>
          {/* To be implemented */}
          {/* <button
            onClick={(e) => e.stopPropagation()}
            className="rounded-full p-2 hover:bg-black/5"
          >
            <Tag className="h-4 w-4 text-gray-600" />
          </button> */}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(note.id);
          }}
          className="rounded-full p-2 hover:bg-black/5"
        >
          <Trash2 className="h-4 w-4 text-gray-600" />
        </button>
      </div>
    </div>
  );
}
