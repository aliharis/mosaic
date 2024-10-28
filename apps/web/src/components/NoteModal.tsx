import React, { useRef, useEffect } from "react";
import { X, Palette, Tag, Trash2, Clock } from "lucide-react";
import type { LiveNote, Block } from "../types";
import UserList from "./UserList";
import BlockEditor from "./BlockEditor";

interface NoteModalProps {
  note: LiveNote;
  onClose: () => void;
  onDelete: (id: string) => void;
  onColorChange: (id: string, color: string) => void;
  onContentChange: (
    id: string,
    field: "title" | "content" | "blocks",
    value: string | Block[]
  ) => void;
}

const colors = [
  "bg-white",
  "bg-blue-50",
  "bg-purple-50",
  "bg-pink-50",
  "bg-yellow-50",
  "bg-green-50",
];

export default function NoteModal({
  note,
  onClose,
  onDelete,
  onColorChange,
  onContentChange,
}: NoteModalProps) {
  const [showColors, setShowColors] = React.useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className={`${note.color} w-full max-w-3xl rounded-lg border border-gray-200 shadow-xl`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b p-4">
          <div className="flex items-center gap-4">
            <UserList users={note.activeUsers} />
            <span className="flex items-center gap-1 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              {new Date(note.lastEdited).toLocaleTimeString()}
            </span>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-black/5"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="space-y-4 p-6">
          <input
            ref={titleRef}
            type="text"
            value={note.title}
            onChange={(e) => onContentChange(note.id, "title", e.target.value)}
            placeholder="Title"
            className="w-full bg-transparent text-2xl font-medium outline-none placeholder:text-gray-400"
          />
          <BlockEditor
            blocks={
              note.blocks || [
                { id: "1", type: "paragraph", content: note.content },
              ]
            }
            onChange={(blocks) => onContentChange(note.id, "blocks", blocks)}
          />
        </div>

        <div className="flex items-center justify-between border-t p-4">
          <div className="flex gap-2">
            <div className="relative">
              <button
                onClick={() => setShowColors(!showColors)}
                className="rounded-full p-2 hover:bg-black/5"
              >
                <Palette className="h-4 w-4 text-gray-600" />
              </button>

              {showColors && (
                <div className="absolute bottom-full left-0 mb-2 flex gap-1 rounded-lg border bg-white p-2 shadow-lg">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => {
                        onColorChange(note.id, color);
                        setShowColors(false);
                      }}
                      className={`h-6 w-6 rounded-full ${color} border hover:shadow-md`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* <button className="rounded-full p-2 hover:bg-black/5">
              <Tag className="h-4 w-4 text-gray-600" />
            </button> */}
          </div>

          <button
            onClick={() => {
              onDelete(note.id);
              onClose();
            }}
            className="rounded-full p-2 hover:bg-black/5"
          >
            <Trash2 className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
}
