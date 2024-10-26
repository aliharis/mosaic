import React from 'react';
import { Hash, Type, List, ListOrdered, Quote, Code } from 'lucide-react';

interface BlockMenuProps {
  query: string;
  onSelect: (type: Block['type']) => void;
  position: { x: number; y: number };
}

const BLOCK_TYPES = [
  { type: 'paragraph', icon: Type, label: 'Text', command: 'text' },
  { type: 'heading1', icon: Hash, label: 'Heading 1', command: 'h1' },
  { type: 'heading2', icon: Hash, label: 'Heading 2', command: 'h2' },
  { type: 'heading3', icon: Hash, label: 'Heading 3', command: 'h3' },
  { type: 'bulletList', icon: List, label: 'Bullet List', command: 'bullet' },
  { type: 'numberedList', icon: ListOrdered, label: 'Numbered List', command: 'number' },
  { type: 'quote', icon: Quote, label: 'Quote', command: 'quote' },
  { type: 'code', icon: Code, label: 'Code', command: 'code' },
] as const;

export default function BlockMenu({ query, onSelect, position }: BlockMenuProps) {
  const filteredTypes = BLOCK_TYPES.filter(type =>
    type.label.toLowerCase().includes(query.toLowerCase()) ||
    type.command.includes(query.toLowerCase())
  );

  if (filteredTypes.length === 0) return null;

  return (
    <div
      className="absolute z-50 w-64 rounded-lg border bg-white p-1 shadow-xl"
      style={{
        top: `${position.y}px`,
        left: `${position.x}px`,
      }}
    >
      {filteredTypes.map(({ type, icon: Icon, label, command }) => (
        <button
          key={type}
          onClick={() => onSelect(type)}
          className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm hover:bg-gray-100"
        >
          <Icon className="h-4 w-4 text-gray-500" />
          <span className="flex-1">{label}</span>
          <span className="text-xs text-gray-400">/{command}</span>
        </button>
      ))}
    </div>
  );
}