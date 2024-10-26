import { describe, it, expect, beforeEach, vi } from 'vitest';
import { notesService, labelsService, userService, liveNotesService } from '../storage';

describe('Storage Services', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('NotesService', () => {
    it('creates and retrieves notes', async () => {
      const newNote = await notesService.createNote({
        title: 'Test Note',
        content: 'Test Content',
        color: 'bg-white',
        pinned: false,
        labels: [],
      });

      const notes = await notesService.getNotes();
      expect(notes).toHaveLength(1);
      expect(notes[0]).toEqual(newNote);
    });

    it('updates notes', async () => {
      const note = await notesService.createNote({
        title: 'Test Note',
        content: 'Test Content',
        color: 'bg-white',
        pinned: false,
        labels: [],
      });

      const updatedNote = await notesService.updateNote(note.id, {
        title: 'Updated Title',
      });

      expect(updatedNote.title).toBe('Updated Title');
      expect(updatedNote.content).toBe('Test Content');
    });

    it('deletes notes', async () => {
      const note = await notesService.createNote({
        title: 'Test Note',
        content: 'Test Content',
        color: 'bg-white',
        pinned: false,
        labels: [],
      });

      await notesService.deleteNote(note.id);
      const notes = await notesService.getNotes();
      expect(notes).toHaveLength(0);
    });
  });

  describe('LabelsService', () => {
    it('creates and retrieves labels', async () => {
      const newLabel = await labelsService.createLabel({
        name: 'Test Label',
        color: '#ff0000',
      });

      const labels = await labelsService.getLabels();
      expect(labels).toHaveLength(1);
      expect(labels[0]).toEqual(newLabel);
    });

    it('updates labels', async () => {
      const label = await labelsService.createLabel({
        name: 'Test Label',
        color: '#ff0000',
      });

      const updatedLabel = await labelsService.updateLabel(label.id, {
        name: 'Updated Label',
      });

      expect(updatedLabel.name).toBe('Updated Label');
      expect(updatedLabel.color).toBe('#ff0000');
    });
  });

  describe('UserService', () => {
    it('saves and retrieves user profile', async () => {
      const profile = {
        id: '1',
        name: 'Test User',
        color: '#ff0000',
        lastActive: new Date(),
      };

      await userService.saveUserProfile(profile);
      const savedProfile = await userService.getUserProfile();
      expect(savedProfile).toEqual(profile);
    });

    it('clears user profile', async () => {
      const profile = {
        id: '1',
        name: 'Test User',
        color: '#ff0000',
        lastActive: new Date(),
      };

      await userService.saveUserProfile(profile);
      await userService.clearUserProfile();
      const savedProfile = await userService.getUserProfile();
      expect(savedProfile).toBeNull();
    });
  });

  describe('LiveNotesService', () => {
    it('creates and retrieves live notes', async () => {
      const newNote = await liveNotesService.createLiveNote({
        title: 'Test Live Note',
        content: 'Test Content',
        color: 'bg-white',
        pinned: false,
        labels: [],
        activeUsers: [],
        lastEdited: new Date(),
        blocks: [],
      });

      const notes = await liveNotesService.getLiveNotes();
      expect(notes).toHaveLength(1);
      expect(notes[0]).toEqual(newNote);
    });

    it('updates live notes', async () => {
      const note = await liveNotesService.createLiveNote({
        title: 'Test Live Note',
        content: 'Test Content',
        color: 'bg-white',
        pinned: false,
        labels: [],
        activeUsers: [],
        lastEdited: new Date(),
        blocks: [],
      });

      const updatedNote = await liveNotesService.updateLiveNote(note.id, {
        title: 'Updated Title',
      });

      expect(updatedNote.title).toBe('Updated Title');
      expect(updatedNote.content).toBe('Test Content');
    });
  });
});