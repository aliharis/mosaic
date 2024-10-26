import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import type { Label } from '../types';

interface LabelPickerProps {
  labels: Label[];
  selectedLabels: Label[];
  onToggleLabel: (label: Label) => void;
  onCreateLabel: (name: string, color: string) => void;
}

const LABEL_COLORS = [
  { name: 'Gray', value: '#94A3B8' },
  { name: 'Red', value: '#EF4444' },
  { name: 'Orange', value: '#F97316' },
  { name: 'Green', value: '#22C55E' },
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Purple', value: '#A855F7' },
  { name: 'Pink', value: '#EC4899' },
];

export default function LabelPicker({ labels, selectedLabels, onToggleLabel, onCreateLabel }: LabelPickerProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newLabelName, setNewLabelName] = useState('');
  const [selectedColor, setSelectedColor] = useState(LABEL_COLORS[0].value);
  const [searchQuery, setSearchQuery] = useState('');

  const handleCreateLabel = (e: React.FormEvent) => {
    e.preventDefault();
    if (newLabelName.trim()) {
      onCreateLabel(newLabelName.trim(), selectedColor);
      setNewLabelName('');
      setIsCreating(false);
    }
  };

  const filteredLabels = labels.filter(label =>
    label.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-64 rounded-lg border bg-white p-2 shadow-xl">
      <input
        type="text"
        placeholder="Search labels..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-2 w-full rounded-md border border-gray-200 px-3 py-1.5 text-sm outline-none focus:border-blue-500"
      />

      <div className="max-h-48 space-y-1 overflow-y-auto">
        {filteredLabels.map(label => (
          <button
            key={label.id}
            onClick={() => onToggleLabel(label)}
            className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-gray-50"
          >
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: label.color }}
            />
            <span className="flex-1 text-left">{label.name}</span>
            {selectedLabels.some(l => l.id === label.id) && (
              <div className="h-4 w-4 rounded-full border-2 border-blue-500 bg-blue-500/10" />
            )}
          </button>
        ))}
      </div>

      {isCreating ? (
        <form onSubmit={handleCreateLabel} className="mt-2 border-t pt-2">
          <input
            type="text"
            placeholder="Label name"
            value={newLabelName}
            onChange={(e) => setNewLabelName(e.target.value)}
            className="mb-2 w-full rounded-md border border-gray-200 px-3 py-1.5 text-sm outline-none focus:border-blue-500"
            autoFocus
          />
          <div className="mb-2 flex flex-wrap gap-1">
            {LABEL_COLORS.map(color => (
              <button
                key={color.value}
                type="button"
                onClick={() => setSelectedColor(color.value)}
                className={`h-6 w-6 rounded-full ${
                  selectedColor === color.value ? 'ring-2 ring-blue-500 ring-offset-2' : ''
                }`}
                style={{ backgroundColor: color.value }}
                title={color.name}
              />
            ))}
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="rounded-md px-2 py-1 text-sm text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!newLabelName.trim()}
              className="rounded-md bg-blue-500 px-2 py-1 text-sm text-white hover:bg-blue-600 disabled:bg-gray-400"
            >
              Create
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setIsCreating(true)}
          className="mt-2 flex w-full items-center gap-2 rounded-md border-t px-2 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
        >
          <Plus className="h-4 w-4" />
          Create new label
        </button>
      )}
    </div>
  );
}