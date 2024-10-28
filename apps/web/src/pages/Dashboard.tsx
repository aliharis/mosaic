import { AppLayout } from "@/components/layout/AppLayout";
import {
  DndContext,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import NoteModal from "../components/NoteModal";
import ProfileModal from "../components/ProfileModal";
import SortableNote from "../components/SortableNote";
import type { Block, LiveNote, User } from "../types";

const MOCK_USERS: User[] = [
  { id: "2", name: "Bob", color: "#B5DEFF", lastActive: new Date() },
  { id: "3", name: "Charlie", color: "#B5FFB8", lastActive: new Date() },
];

export default function Dashboard() {
  const [notes, setNotes] = useState<LiveNote[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedNote, setSelectedNote] = useState<LiveNote | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 8,
      },
    })
  );

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

  const addNote = () => {
    if (!currentUser) return;

    const newNote: LiveNote = {
      id: Date.now().toString(),
      title: "",
      content: "",
      color: "bg-white",
      pinned: false,
      activeUsers: [currentUser, ...MOCK_USERS.slice(0, 1)],
      lastEdited: new Date(),
      blocks: [{ id: "1", type: "paragraph", content: "" }],
    };
    setNotes([newNote, ...notes]);
    setSelectedNote(newNote);
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter((note) => note.id !== id));
    if (selectedNote?.id === id) {
      setSelectedNote(null);
    }
  };

  const changeNoteColor = (id: string, color: string) => {
    setNotes(
      notes.map((note) =>
        note.id === id ? { ...note, color, lastEdited: new Date() } : note
      )
    );
  };

  const updateNoteContent = (
    id: string,
    field: "title" | "content" | "blocks",
    value: string | Block[]
  ) => {
    setNotes(
      notes.map((note) =>
        note.id === id
          ? {
              ...note,
              [field]: value,
              content:
                field === "blocks"
                  ? (value as Block[]).map((b) => b.content).join("\n")
                  : note.content,
              lastEdited: new Date(),
            }
          : note
      )
    );
  };

  // Handle note updates
  const handleNoteUpdate = (
    noteId: string,
    changes: Partial<Note>,
    version: number
  ) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === noteId ? { ...note, ...changes, version } : note
      )
    );
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setNotes((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  if (!currentUser) {
    return <ProfileModal onSubmit={handleProfileSubmit} />;
  }

  // Filter notes based on search query and exclude selected note
  const filteredNotes = notes.filter(
    (note) =>
      note.id !== selectedNote?.id && // Exclude selected note
      (note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const showEmptyState =
    notes.length === 0 || (notes.length === 1 && selectedNote);

  return (
    <AppLayout
      currentUser={currentUser}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      onAddNote={addNote}
      mockUsers={MOCK_USERS}
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={filteredNotes} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredNotes.map((note) => (
              <SortableNote
                key={note.id}
                note={note}
                onDelete={deleteNote}
                onColorChange={changeNoteColor}
                onContentChange={updateNoteContent}
                onNoteClick={() => setSelectedNote(note)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {showEmptyState && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-gray-100 p-4">
            <Plus className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            No notes yet
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Create a note to start collaborating
          </p>
        </div>
      )}

      {selectedNote && (
        <NoteModal
          note={selectedNote}
          currentUser={currentUser}
          onClose={() => setSelectedNote(null)}
          onDelete={deleteNote}
          onUpdate={handleNoteUpdate}
        />
      )}
    </AppLayout>
  );
}
