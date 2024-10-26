import React, { useState } from 'react';
import { Palette, Tag, Trash2 } from 'lucide-react';
import type { Note, Label } from '../types';
import LabelPicker from './LabelPicker';

interface NoteCardProps {
  note: Note;
  labels: Label[];
  onDelete: (id: string) => void;
  onColorChange: (id: string, color: string) => void;
  onLabelsChange: (id: string, labels: Label[]) => void;
  onCreateLabel: (name: string, color: string) => void;
}

const colors = [
  'bg-white',
  'bg-blue-50',
  'bg-purple-50',
  'bg-pink-50',
  'bg-yellow-50',
  'bg-green-50'
];

export default function NoteCard({ note, labels, onDelete, onColorChange, onLabelsChange, onCreateLabel }: NoteCardProps) {
  const [showColors, setShowColors] = useState(false);
  const [showLabels, setShowLabels] = useState(false);

  const handleToggleLabel = (label: Label) => {
    const isSelected = note.labels.some(l => l.id === label.id);
    const newLabels = isSelected
      ? note.labels.filter(l => l.id !== label.id)
      : [...note.labels, label];
    onLabelsChange(note.id, newLabels);
  };

  return (
    <div className={`${note.color} group rounded-lg border border-gray-200 p-4 shadow-sm transition-all hover:shadow-md`}>
      <div className="space-y-2">
        <input
          type="text"
          defaultValue={note.title}
          placeholder="Title"
          className="w-full bg-transparent text-lg font-medium outline-none placeholder:text-gray-400"
        />
        <textarea
          defaultValue={note.content}
          placeholder="Take a note..."
          className="w-full resize-none bg-transparent outline-none placeholder:text-gray-400"
          rows={3}
        />
      </div>

      {note.labels.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1">
          {note.labels.map(label => (
            <div
              key={label.id}
              className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs"
              style={{ backgroundColor: `${label.color}40` }}
            >
              <div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: label.color }}
              />
              <span style={{ color: label.color }}>{label.name}</span>
              <button
                onClick={() => handleToggleLabel(label)}
                className="ml-1 rounded-full p-0.5 hover:bg-black/5"
              >
                <X className="h-3 w-3" style={{ color: label.color }} />
              </button>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-4 flex items-center justify-between opacity-0 transition-opacity group-hover:opacity-100">
        <div className="flex gap-2">
          <div className="relative">
            <button
              onClick={() => setShowColors(!showColors)}
              className="rounded-full p-2 hover:bg-black/5"
            >
              <Palette className="h-4 w-4 text-gray-600" />
            </button>
            
            {showColors && (
              <div className="absolute bottom-full left-0 mb-2 flex gap-1 rounded-lg border bg-white p-2 shadow-lg">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => {
                      onColorChange(note.id, color);
                      setShowColors(false);
                    }}
                    className={`h-6 w-6 rounded-full ${color} border hover:shadow-md`}
                  />
                ))}
              </div>
            )}
          </div>
          
          <div className="relative">
            <button
              onClick={() => setShowLabels(!showLabels)}
              className="rounded-full p-2 hover:bg-black/5"
            >
              <Tag className="h-4 w-4 text-gray-600" />
            </button>

            {showLabels && (
              <div className="absolute bottom-full left-0 mb-2">
                <LabelPicker
                  labels={labels}
                  selectedLabels={note.labels}
                  onToggleLabel={handleToggleLabel}
                  onCreateLabel={onCreateLabel}
                />
              </div>
            )}
          </div>
        </div>
        
        <button
          onClick={() => onDelete(note.id)}
          className="rounded-full p-2 hover:bg-black/5"
        >
          <Trash2 className="h-4 w-4 text-gray-600" />
        </button>
      </div>
    </div>
  );
}