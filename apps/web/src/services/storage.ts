import type { Note, Label, User, LiveNote } from '../types';

// Storage keys
const STORAGE_KEYS = {
  NOTES: 'mosaic_notes',
  LABELS: 'mosaic_labels',
  USER_PROFILE: 'mosaic_user_profile',
  LIVE_NOTES: 'mosaic_live_notes',
} as const;

// Generic storage operations
class StorageService {
  private static instance: StorageService;

  private constructor() {}

  static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  private getItem<T>(key: string, defaultValue: T): T {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  }

  private setItem<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  private removeItem(key: string): void {
    localStorage.removeItem(key);
  }
}

// Notes operations
export class NotesService {
  private storage = StorageService.getInstance();

  async getNotes(): Promise<Note[]> {
    return this.storage.getItem<Note[]>(STORAGE_KEYS.NOTES, []);
  }

  async createNote(note: Omit<Note, 'id'>): Promise<Note> {
    const notes = await this.getNotes();
    const newNote: Note = {
      ...note,
      id: Date.now().toString(),
    };
    notes.unshift(newNote);
    this.storage.setItem(STORAGE_KEYS.NOTES, notes);
    return newNote;
  }

  async updateNote(id: string, updates: Partial<Note>): Promise<Note> {
    const notes = await this.getNotes();
    const index = notes.findIndex(note => note.id === id);
    if (index === -1) throw new Error('Note not found');

    const updatedNote = { ...notes[index], ...updates };
    notes[index] = updatedNote;
    this.storage.setItem(STORAGE_KEYS.NOTES, notes);
    return updatedNote;
  }

  async deleteNote(id: string): Promise<void> {
    const notes = await this.getNotes();
    const filteredNotes = notes.filter(note => note.id !== id);
    this.storage.setItem(STORAGE_KEYS.NOTES, filteredNotes);
  }

  async searchNotes(query: string): Promise<Note[]> {
    const notes = await this.getNotes();
    return notes.filter(note =>
      note.title.toLowerCase().includes(query.toLowerCase()) ||
      note.content.toLowerCase().includes(query.toLowerCase()) ||
      note.labels.some(label => 
        label.name.toLowerCase().includes(query.toLowerCase())
      )
    );
  }
}

// Labels operations
export class LabelsService {
  private storage = StorageService.getInstance();

  async getLabels(): Promise<Label[]> {
    return this.storage.getItem<Label[]>(STORAGE_KEYS.LABELS, []);
  }

  async createLabel(label: Omit<Label, 'id'>): Promise<Label> {
    const labels = await this.getLabels();
    const newLabel: Label = {
      ...label,
      id: Date.now().toString(),
    };
    labels.push(newLabel);
    this.storage.setItem(STORAGE_KEYS.LABELS, labels);
    return newLabel;
  }

  async updateLabel(id: string, updates: Partial<Label>): Promise<Label> {
    const labels = await this.getLabels();
    const index = labels.findIndex(label => label.id === id);
    if (index === -1) throw new Error('Label not found');

    const updatedLabel = { ...labels[index], ...updates };
    labels[index] = updatedLabel;
    this.storage.setItem(STORAGE_KEYS.LABELS, labels);
    return updatedLabel;
  }

  async deleteLabel(id: string): Promise<void> {
    const labels = await this.getLabels();
    const filteredLabels = labels.filter(label => label.id !== id);
    this.storage.setItem(STORAGE_KEYS.LABELS, filteredLabels);
  }
}

// User profile operations
export class UserService {
  private storage = StorageService.getInstance();

  async getUserProfile(): Promise<User | null> {
    return this.storage.getItem<User | null>(STORAGE_KEYS.USER_PROFILE, null);
  }

  async saveUserProfile(profile: User): Promise<User> {
    this.storage.setItem(STORAGE_KEYS.USER_PROFILE, profile);
    return profile;
  }

  async clearUserProfile(): Promise<void> {
    this.storage.removeItem(STORAGE_KEYS.USER_PROFILE);
  }
}

// Live notes operations
export class LiveNotesService {
  private storage = StorageService.getInstance();

  async getLiveNotes(): Promise<LiveNote[]> {
    return this.storage.getItem<LiveNote[]>(STORAGE_KEYS.LIVE_NOTES, []);
  }

  async createLiveNote(note: Omit<LiveNote, 'id'>): Promise<LiveNote> {
    const notes = await this.getLiveNotes();
    const newNote: LiveNote = {
      ...note,
      id: Date.now().toString(),
    };
    notes.unshift(newNote);
    this.storage.setItem(STORAGE_KEYS.LIVE_NOTES, notes);
    return newNote;
  }

  async updateLiveNote(id: string, updates: Partial<LiveNote>): Promise<LiveNote> {
    const notes = await this.getLiveNotes();
    const index = notes.findIndex(note => note.id === id);
    if (index === -1) throw new Error('Live note not found');

    const updatedNote = { ...notes[index], ...updates };
    notes[index] = updatedNote;
    this.storage.setItem(STORAGE_KEYS.LIVE_NOTES, notes);
    return updatedNote;
  }

  async deleteLiveNote(id: string): Promise<void> {
    const notes = await this.getLiveNotes();
    const filteredNotes = notes.filter(note => note.id !== id);
    this.storage.setItem(STORAGE_KEYS.LIVE_NOTES, filteredNotes);
  }

  async searchLiveNotes(query: string): Promise<LiveNote[]> {
    const notes = await this.getLiveNotes();
    return notes.filter(note =>
      note.title.toLowerCase().includes(query.toLowerCase()) ||
      note.content.toLowerCase().includes(query.toLowerCase())
    );
  }
}

// Export service instances
export const notesService = new NotesService();
export const labelsService = new LabelsService();
export const userService = new UserService();
export const liveNotesService = new LiveNotesService();