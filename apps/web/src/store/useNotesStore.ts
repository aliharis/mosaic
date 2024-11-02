import { create } from "zustand";
import { Note, Block } from "@/types";
import { client } from "@/utils/graphql-client";
import {
  CREATE_NOTE_MUTATION,
  DELETE_NOTE_MUTATION,
  UPDATE_NOTE_MUTATION,
} from "@/graphql/mutations/note";
import { BlockInput, CreateNoteInput } from "@/graphql/types/graphql";
interface NotesState {
  isNewNoteModalOpen: boolean;
  notes: Note[];
  selectedNote: Note | null;
  openNewNoteModal: () => void;
  closeNewNoteModal: () => void;
  addNote: (note: Note) => void;
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
    set((state) => {
      const newNote: CreateNoteInput = {
        id: noteData.id,
        title: noteData.title,
        content: noteData.content,
        blocks: noteData.blocks as BlockInput[],
        color: noteData.color,
        version: noteData.version,
        created: noteData.created,
        createdBy: noteData.createdBy,
        lastEdited: noteData.lastEdited,
        lastEditedBy: noteData.lastEditedBy,
      };

      // Update local state optimistically
      const newState = {
        notes: [newNote, ...state.notes],
        isNewNoteModalOpen: false,
      };

      // Sync with server
      client
        .request({
          query: CREATE_NOTE_MUTATION,
          variables: {
            note: newNote,
          },
        })
        .catch((error) => {
          console.error("Failed to create note:", error);
          // TODO: Rollback the optimistic update if the API call fails
        });

      return newState;
    }),

  deleteNote: (id) =>
    set((state) => {
      // Update local state optimistically
      const newState = {
        notes: state.notes.filter((note) => note.id !== id),
        selectedNote: state.selectedNote?.id === id ? null : state.selectedNote,
      };

      // Sync with server
      client
        .request({
          query: DELETE_NOTE_MUTATION,
          variables: { id },
        })
        .catch((error) => {
          console.error("Failed to delete note:", error);
          // TODO: Rollback the optimistic update if the API call fails
        });

      return newState;
    }),

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

  handleNoteUpdate: async (noteId, changes, version) =>
    set((state) => {
      // Update local state optimistically
      const newState = {
        notes: state.notes.map((note) =>
          note.id === noteId ? { ...note, ...changes, version } : note
        ),
      };

      // Sync with server
      client
        .request({
          query: UPDATE_NOTE_MUTATION,
          variables: {
            id: noteId,
            changes: { ...changes, version },
          },
        })
        .catch((error) => {
          console.error("Failed to sync note update:", error);
        });

      return newState;
    }),

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
