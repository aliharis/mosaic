import React, { useRef, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import type { Block as BlockType } from '../../types';

interface BlockProps {
  block: BlockType;
  isActive: boolean;
  onChange: (content: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onFocus: () => void;
}

export default function Block({ block, isActive, onChange, onKeyDown, onFocus }: BlockProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const inputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isActive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isActive]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getBlockStyle = () => {
    switch (block.type) {
      case 'heading1':
        return 'text-3xl font-bold';
      case 'heading2':
        return 'text-2xl font-bold';
      case 'heading3':
        return 'text-xl font-bold';
      case 'bulletList':
        return 'pl-6 list-disc';
      case 'numberedList':
        return 'pl-6 list-decimal';
      case 'quote':
        return 'pl-4 border-l-4 border-gray-200 italic';
      case 'code':
        return 'font-mono bg-gray-50 p-2 rounded';
      default:
        return '';
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative flex items-start gap-2 ${isDragging ? 'opacity-50' : ''}`}
    >
      <div
        {...attributes}
        {...listeners}
        className="mt-3 cursor-grab opacity-0 group-hover:opacity-100"
      >
        <GripVertical className="h-4 w-4 text-gray-400" />
      </div>
      <div
        ref={inputRef}
        contentEditable
        suppressContentEditableWarning
        onInput={(e) => onChange(e.currentTarget.textContent || '')}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        className={`flex-1 outline-none ${getBlockStyle()}`}
        dangerouslySetInnerHTML={{ __html: block.content || '<br>' }}
      />
    </div>
  );
}