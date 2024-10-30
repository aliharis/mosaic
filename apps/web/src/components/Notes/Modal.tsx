// components/NoteModal.tsx
import React, { useRef, useEffect, useCallback } from "react";
import { X, Palette, Trash2, Clock } from "lucide-react";
import { debounce } from "lodash";
// import { useWebSocket } from "../hooks/useWebSocket";
import UserList from "../UserList";
import BlockEditor from "../BlockEditor";

import { Note, UpdatePayload } from "@/types";
import { useAuth } from "@/context/auth";

interface NoteModalProps {
  note: Note;
  onClose: () => void;
  onDelete: (id: string) => void;
  onUpdate: (noteId: string, changes: Partial<Note>, version: number) => void;
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
  onUpdate,
}: NoteModalProps) {
  const [localNote, setLocalNote] = React.useState(note);
  const [isSaving, setIsSaving] = React.useState(false);
  const [showColors, setShowColors] = React.useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  // // Initialize WebSocket connection
  // const ws = useWebSocket(note.id, handleWebSocketMessage);

  // Handle incoming WebSocket messages
  // const handleWebSocketMessage = useCallback(
  //   (data: any) => {
  //     if (data.type === "update" && data.payload.noteId === note.id) {
  //       const { changes, version, userId } = data.payload;

  //       // Only apply changes from other users
  //       if (userId !== currentUser.id) {
  //         setLocalNote((prev) => ({
  //           ...prev,
  //           ...changes,
  //           version,
  //         }));
  //       }
  //     }
  //   },
  //   [note.id, currentUser.id]
  // );

  // Debounced update function
  const debouncedUpdate = useCallback(
    debounce((changes: Partial<Note>) => {
      setIsSaving(true);
      // const updatePayload: UpdatePayload = {
      //   noteId: note.id,
      //   changes,
      //   version: localNote.version + 1,
      //   userId: currentUser.id,
      // };

      // Send update through WebSocket
      // if (ws) {
      //   ws.send(
      //     JSON.stringify({
      //       type: "update",
      //       payload: updatePayload,
      //     })
      //   );
      // }

      // Update parent state
      onUpdate(note.id, changes, localNote.version + 1);
      setIsSaving(false);
    }, 1000),
    [note.id, localNote.version, user.id, onUpdate]
  );

  // Handle local changes
  const handleChange = (field: keyof Note, value: any) => {
    console.log("handleChange", field, value);

    const changes = { [field]: value, lastEdited: new Date() };
    setLocalNote((prev) => ({ ...prev, ...changes }));
    debouncedUpdate(changes);
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) =>
        modalRef.current &&
        !modalRef.current.contains(e.target as Node) &&
        onClose()
      }
    >
      <div
        ref={modalRef}
        className={`${localNote.color} w-full max-w-3xl max-h-[80vh] rounded-lg border border-gray-200 shadow-xl flex flex-col`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b p-4">
          <div className="flex items-center gap-4">
            {localNote.activeUsers && (
              <UserList users={localNote.activeUsers} />
            )}

            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-sm text-gray-500">
                <Clock className="h-4 w-4" />
                {new Date(localNote.lastEdited).toLocaleTimeString()}
              </span>
              {isSaving && (
                <span className="text-sm text-gray-500">Saving...</span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-black/5"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="space-y-4 p-6 overflow-y-auto">
          <input
            ref={titleRef}
            type="text"
            value={localNote.title}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="Title"
            className="w-full bg-transparent text-2xl font-medium outline-none placeholder:text-gray-400"
          />
          <BlockEditor
            blocks={localNote.blocks}
            onChange={(blocks) => handleChange("blocks", blocks)}
          />
        </div>

        <div className="flex items-center justify-between border-t p-4">
          {/* Color picker and delete buttons remain the same */}
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
