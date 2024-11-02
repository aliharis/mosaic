import { useAuth } from "@/context/auth";
import { Note } from "@/types";
import { useSubscription } from "graphql-hooks";
import { debounce } from "lodash";
import React, { useCallback, useEffect, useRef } from "react";

const NOTE_UPDATED_SUBSCRIPTION = `
  subscription NoteUpdated($id: ID!) {
    noteUpdated(id: $id) {
      id
      title
      content
      blocks {
        id
        type
        content
      }
      color
      version
      created
      createdBy
      lastEdited
      lastEditedBy
    }
  }
`;

export const useNoteEditor = ({
  note,
  onUpdate,
}: {
  note: Note;
  onUpdate: (noteId: string, changes: Partial<Note>, version: number) => void;
}) => {
  const [localNote, setLocalNote] = React.useState(note);
  const [isSaving, setIsSaving] = React.useState(false);
  const pendingChangesRef = useRef<Partial<Note>>({});
  const isTypingRef = useRef<boolean>(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  const { user } = useAuth();

  // Subscription setup
  const subscriptionOptions = React.useMemo(
    () => ({
      query: NOTE_UPDATED_SUBSCRIPTION,
      variables: { id: note.id },
    }),
    [note.id]
  );

  useSubscription(subscriptionOptions, ({ data, errors }) => {
    if (errors?.length) {
      console.error("Subscription errors:", errors);
      return;
    }

    const updatedNote = data?.noteUpdated;
    if (updatedNote && updatedNote.modifiedBy !== user?.id) {
      if (updatedNote.version > localNote.version) {
        // Clear pending changes if we're receiving a newer version
        pendingChangesRef.current = {};
        setLocalNote((prevNote) => ({
          ...prevNote,
          ...updatedNote,
        }));
      }
    }
  });

  // Debounced save function
  const debouncedSave = useCallback(
    debounce((changes: Partial<Note>) => {
      setIsSaving(true);
      const finalChanges = {
        ...changes,
        lastEdited: new Date(),
      };

      onUpdate(note.id, finalChanges, localNote.version + 1);
      pendingChangesRef.current = {};
      setIsSaving(false);
    }, 1000),
    [note.id, localNote.version, onUpdate]
  );

  // Handle typing completion
  const handleTypingComplete = useCallback(() => {
    isTypingRef.current = false;
    if (Object.keys(pendingChangesRef.current).length > 0) {
      debouncedSave(pendingChangesRef.current);
    }
  }, [debouncedSave]);

  // Change handler
  const handleChange = useCallback(
    (field: keyof Note, value: any) => {
      // Update local state immediately for responsiveness
      setLocalNote((prev) => ({
        ...prev,
        [field]: value,
      }));

      // Accumulate changes
      pendingChangesRef.current = {
        ...pendingChangesRef.current,
        [field]: value,
      };

      // Reset typing timer
      isTypingRef.current = true;
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      typingTimeoutRef.current = setTimeout(handleTypingComplete, 500);
    },
    [handleTypingComplete]
  );

  // Cleanup
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      // Flush any pending changes on unmount
      if (Object.keys(pendingChangesRef.current).length > 0) {
        debouncedSave.flush();
      }
    };
  }, [debouncedSave]);

  return {
    localNote,
    isSaving,
    handleChange,
  };
};
