import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Note } from "@/types";
import NoteCard from "@/components/Notes/Card";

interface SortableNoteProps {
  note: Note;
  onDelete: (id: string) => void;
  onUpdate: (id: string, changes: Partial<Note>, version: number) => void;
  onNoteClick: () => void;
}

export default function SortableNote({
  note,
  onDelete,
  onUpdate,
  onNoteClick,
}: SortableNoteProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: note.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: isDragging ? "grabbing" : "grab",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <NoteCard
        note={note}
        onDelete={onDelete}
        onUpdate={onUpdate}
        onNoteClick={onNoteClick}
      />
    </div>
  );
}
