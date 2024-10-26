import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import NoteCard from '../components/NoteCard';
import type { Note, Label } from '../types';

export default function MyNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [labels, setLabels] = useState<Label[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const addNote = () => {
    const newNote = {
      id: Date.now().toString(),
      title: '',
      content: '',
      color: 'bg-white',
      pinned: false,
      labels: [],
    };
    setNotes([newNote, ...notes]);
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const changeNoteColor = (id: string, color: string) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, color } : note
    ));
  };

  const changeNoteLabels = (id: string, newLabels: Label[]) => {
    setNotes(notes.map(note =>
      note.id === id ? { ...note, labels: newLabels } : note
    ));
  };

  const createLabel = (name: string, color: string) => {
    const newLabel: Label = {
      id: Date.now().toString(),
      name,
      color,
    };
    setLabels([...labels, newLabel]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-gray-900">My Notes</h1>
            <div className="flex flex-1 items-center gap-2 rounded-full bg-gray-100 px-4 py-2">
              <Search className="h-5 w-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search notes"
                className="flex-1 bg-transparent outline-none placeholder:text-gray-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl p-4">
        <div className="mb-8">
          <button
            onClick={addNote}
            className="flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Add Note
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {notes
            .filter(note => 
              note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
              note.labels.some(label => 
                label.name.toLowerCase().includes(searchQuery.toLowerCase())
              )
            )
            .map(note => (
              <NoteCard
                key={note.id}
                note={note}
                labels={labels}
                onDelete={deleteNote}
                onColorChange={changeNoteColor}
                onLabelsChange={changeNoteLabels}
                onCreateLabel={createLabel}
              />
            ))}
        </div>

        {notes.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-gray-100 p-4">
              <Plus className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No notes yet</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new note</p>
          </div>
        )}
      </main>
    </div>
  );
}