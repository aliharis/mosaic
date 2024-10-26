import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import LiveNoteCard from './LiveNoteCard';
import type { LiveNote } from '../types';

interface SortableNoteProps {
  note: LiveNote;
  onDelete: (id: string) => void;
  onColorChange: (id: string, color: string) => void;
  onContentChange: (id: string, field: 'title' | 'content', value: string) => void;
  onNoteClick: () => void;
}

export default function SortableNote({ note, onDelete, onColorChange, onContentChange, onNoteClick }: SortableNoteProps) {
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
    cursor: isDragging ? 'grabbing' : 'grab',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <LiveNoteCard
        note={note}
        onDelete={onDelete}
        onColorChange={onColorChange}
        onContentChange={onContentChange}
        onNoteClick={onNoteClick}
      />
    </div>
  );
}