import { create } from "zustand";
import { Note, Block } from "@/types";

interface NotesState {
  isNewNoteModalOpen: boolean;
  notes: Note[];
  selectedNote: Note | null;
  openNewNoteModal: () => void;
  closeNewNoteModal: () => void;
  addNote: (note: Omit<Note, "id" | "createdAt">) => void;
  setNotes: (notes: Note[]) => void;
  deleteNote: (id: string) => void;
  changeNoteColor: (id: string, color: string) => void;
  updateNoteContent: (
    id: string,
    field: "title" | "content" | "blocks",
    value: string | Block[]
  ) => void;
  handleNoteUpdate: (
    noteId: string,
    changes: Partial<Note>,
    version: number
  ) => void;
  setSelectedNote: (note: Note | null) => void;
  reorderNotes: (oldIndex: number, newIndex: number) => void;
}

const useNotesStore = create<NotesState>((set) => ({
  isNewNoteModalOpen: false,
  notes: [],
  selectedNote: null,

  openNewNoteModal: () => set({ isNewNoteModalOpen: true }),
  closeNewNoteModal: () => set({ isNewNoteModalOpen: false }),

  setNotes: (notes) => set({ notes }),

  addNote: (noteData) =>
    set((state) => ({
      notes: [
        {
          id: crypto.randomUUID(),
          createdAt: new Date(),
          ...noteData,
        },
        ...state.notes,
      ],
      isNewNoteModalOpen: false,
    })),

  deleteNote: (id) =>
    set((state) => ({
      notes: state.notes.filter((note) => note.id !== id),
      selectedNote: state.selectedNote?.id === id ? null : state.selectedNote,
    })),

  changeNoteColor: (id, color) =>
    set((state) => ({
      notes: state.notes.map((note) =>
        note.id === id ? { ...note, color, lastEdited: new Date() } : note
      ),
    })),

  updateNoteContent: (id, field, value) =>
    set((state) => ({
      notes: state.notes.map((note) =>
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
      ),
    })),

  handleNoteUpdate: (noteId, changes, version) =>
    set((state) => ({
      notes: state.notes.map((note) =>
        note.id === noteId ? { ...note, ...changes, version } : note
      ),
    })),

  setSelectedNote: (note) => set({ selectedNote: note }),

  reorderNotes: (oldIndex, newIndex) =>
    set((state) => {
      const newNotes = [...state.notes];
      const [movedNote] = newNotes.splice(oldIndex, 1);
      newNotes.splice(newIndex, 0, movedNote);
      return { notes: newNotes };
    }),
}));

export default useNotesStore;
