import {
  DndContext,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { useQuery } from "graphql-hooks";
import { Plus } from "lucide-react";
import { Fragment, useCallback, useEffect } from "react";
import NoteModal from "./Modal";
import SortableNote from "../SortableNote";
import useNotesStore from "@/store/useNotesStore";
import { Block, Note } from "@/types";
import { useUser } from '@clerk/clerk-react'
import { useAuth } from "@/context/auth";

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
  const {
    notes,
    selectedNote,
    isNewNoteModalOpen,
    setNotes,
    addNote,
    deleteNote,
    handleNoteUpdate,
    setSelectedNote,
    reorderNotes,
  } = useNotesStore();

  const { user } = useUser()
  const { isLoading: authLoading } = useAuth();
  const { data, loading, error } = useQuery(GET_NOTES, {
    skip: authLoading
  });

  useEffect(() => {
    if (data) {
      setNotes(data.notes);
    }
  }, [data, setNotes]);

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

  const addNewNote = useCallback(() => {
    const newNote = {
      id: crypto.randomUUID(),
      title: "",
      content: "",
      blocks: [{ id: "1", type: "paragraph", content: "" } as Block],
      color: "bg-white",
      version: 0,
      created: new Date(),
      createdBy: user?.id,
      lastEdited: new Date(),
      lastEditedBy: user?.id,
    };
    addNote(newNote);
    setSelectedNote(newNote as Note);
  }, [addNote, setSelectedNote, user]);

  useEffect(() => {
    if (isNewNoteModalOpen) {
      addNewNote();
    }
  }, [isNewNoteModalOpen, addNewNote]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = notes.findIndex((item) => item.id === active.id);
      const newIndex = notes.findIndex((item) => item.id === over.id);
      reorderNotes(oldIndex, newIndex);
    }
  };

  const showEmptyState =
    notes.length === 0 || (notes.length === 1 && selectedNote);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error?.message}</div>;

  return (
    <Fragment>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={notes} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {notes
              .filter((note) => note.id != selectedNote?.id)
              .map((note) => (
                <SortableNote
                  key={note.id}
                  note={note}
                  onDelete={deleteNote}
                  onUpdate={handleNoteUpdate}
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
