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
import { useQuery } from "graphql-hooks";
import { Plus } from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import NoteModal from "./Modal";
import SortableNote from "../SortableNote";
import type { Block, Note } from "../../types";

const GET_NOTES = `
  query GetNotes {
    notes {
      id
      title
      content
      color
      version
      lastEdited
      blocks {
        id
        type
        content
      }
      activeUsers {
        id
        name
        color
      }
    }
  }
`;

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  const { data, loading, error } = useQuery(GET_NOTES);

  useEffect(() => {
    if (data) {
      setNotes(data.notes);
    }
  }, [data]);

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

  const addNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: "",
      content: "",
      color: "bg-white",
      activeUsers: [],
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

  // Filter notes based on search query and exclude selected note
  //   const filteredNotes = notes.filter(
  //     (note) =>
  //       note.id !== selectedNote?.id && // Exclude selected note
  //       (note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //         note.content.toLowerCase().includes(searchQuery.toLowerCase()))
  //   );

  const filteredNotes = notes;

  const showEmptyState =
    notes.length === 0 || (notes.length === 1 && selectedNote);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <Fragment>
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
          onClose={() => setSelectedNote(null)}
          onDelete={deleteNote}
          onUpdate={handleNoteUpdate}
        />
      )}
    </Fragment>
  );
}
