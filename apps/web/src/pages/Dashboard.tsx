import React, { useState, useEffect } from 'react';
import { Plus, Search } from 'lucide-react';
import {
  DndContext,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import SortableNote from '../components/SortableNote';
import ProfileModal from '../components/ProfileModal';
import NoteModal from '../components/NoteModal';
import type { LiveNote, User, Block } from '../types';

const MOCK_USERS: User[] = [
  { id: '2', name: 'Bob', color: '#B5DEFF', lastActive: new Date() },
  { id: '3', name: 'Charlie', color: '#B5FFB8', lastActive: new Date() },
];

export default function LiveNotes() {
  const [notes, setNotes] = useState<LiveNote[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedNote, setSelectedNote] = useState<LiveNote | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 8,
      },
    })
  );

  const handleProfileSubmit = ({
    name,
    color,
  }: Omit<User, 'id' | 'lastActive'>) => {
    const newUser: User = {
      id: '1',
      name,
      color,
      lastActive: new Date(),
    };
    setCurrentUser(newUser);
    localStorage.setItem('userProfile', JSON.stringify(newUser));
  };

  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      setCurrentUser(JSON.parse(savedProfile));
    }
  }, []);

  const addNote = () => {
    if (!currentUser) return;

    const newNote: LiveNote = {
      id: Date.now().toString(),
      title: '',
      content: '',
      color: 'bg-white',
      pinned: false,
      activeUsers: [currentUser, ...MOCK_USERS.slice(0, 1)],
      lastEdited: new Date(),
      blocks: [{ id: '1', type: 'paragraph', content: '' }],
    };
    setNotes([newNote, ...notes]);
    setSelectedNote(newNote);
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  const changeNoteColor = (id: string, color: string) => {
    setNotes(
      notes.map((note) =>
        note.id === id ? { ...note, color, lastEdited: new Date() } : note
      )
    );
  };

  const updateNoteContent = (
    id: string,
    field: 'title' | 'content' | 'blocks',
    value: string | Block[]
  ) => {
    setNotes(
      notes.map((note) =>
        note.id === id
          ? {
              ...note,
              [field]: value,
              content:
                field === 'blocks'
                  ? (value as Block[]).map((b) => b.content).join('\n')
                  : note.content,
              lastEdited: new Date(),
            }
          : note
      )
    );
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setNotes((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  if (!currentUser) {
    return <ProfileModal onSubmit={handleProfileSubmit} />;
  }

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-20 border-b bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold text-gray-900">Mosaic</h1>
              <button
                onClick={addNote}
                className="flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 sm:hidden"
              >
                <Plus className="h-4 w-4" />
                New
              </button>
            </div>
            <div className="flex flex-1 items-center gap-2 rounded-full bg-gray-100 px-4 py-2">
              <Search className="h-5 w-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search live notes"
                className="flex-1 bg-transparent outline-none placeholder:text-gray-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="hidden items-center gap-4 sm:flex">
              <button
                onClick={addNote}
                className="flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
                New Note
              </button>
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  <div
                    className="relative inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-sm font-medium text-white"
                    style={{ backgroundColor: currentUser.color }}
                    title={`${currentUser.name} (You)`}
                  >
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  {MOCK_USERS.map((user) => (
                    <div
                      key={user.id}
                      className="relative inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-sm font-medium text-white"
                      style={{ backgroundColor: user.color }}
                      title={user.name}
                    >
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl p-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={filteredNotes} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredNotes.map((note) => (
                <SortableNote
                  key={note.id}
                  note={note}
                  onDelete={deleteNote}
                  onColorChange={changeNoteColor}
                  onContentChange={updateNoteContent}
                  onNoteClick={() => setSelectedNote(note)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {notes.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-gray-100 p-4">
              <Plus className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              No notes yet
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Create a note to start collaborating
            </p>
          </div>
        )}

        {selectedNote && (
          <NoteModal
            note={selectedNote}
            onClose={() => setSelectedNote(null)}
            onDelete={deleteNote}
            onColorChange={changeNoteColor}
            onContentChange={updateNoteContent}
          />
        )}
      </main>
    </div>
  );
}
