import { db } from "../config/database";
import { notes, noteToUsers } from "../db/schema";
import { eq } from "drizzle-orm";
import { sql } from "drizzle-orm";

interface NoteInput {
  title: string;
  content: string;
  color: string;
  blocks: any[];
}

interface UpdateNoteInput {
  color: string;
  blocks: any[];
  lastEdited: Date;
}

interface ResolverContext {}

export default {
  Query: {
    notes: async (): Promise<any[]> => {
      return await db.query.notes.findMany({
        with: {
          activeUsers: {
            with: {
              user: true,
            },
          },
        },
      });
    },

    note: async (_: any, { id }: { id: string }): Promise<any> => {
      return await db.query.notes.findFirst({
        where: eq(notes.id, id),
        with: {
          activeUsers: {
            with: {
              user: true,
            },
          },
        },
      });
    },
  },
  Mutation: {
    createNote: async (
      _: any,
      { input }: { input: NoteInput }
    ): Promise<any> => {
      const [note] = await db
        .insert(notes)
        .values({
          title: input.title,
          content: input.content,
          color: input.color,
          blocks: input.blocks,
        })
        .returning();
      return note;
    },

    addUserToNote: async (
      _: any,
      { noteId, userId }: { noteId: string; userId: string }
    ): Promise<any> => {
      await db.insert(noteToUsers).values({
        noteId,
        userId,
      });

      return await db.query.notes.findFirst({
        where: eq(notes.id, noteId),
        with: {
          activeUsers: {
            with: {
              user: true,
            },
          },
        },
      });
    },

    updateNote: async (
      _: any,
      { id, changes }: { id: string; changes: UpdateNoteInput }
    ): Promise<any> => {
      const [updatedNote] = await db
        .update(notes)
        .set({
          blocks: changes.blocks,
        })
        .where(eq(notes.id, id))
        .returning();
      return updatedNote;
    },

    deleteNote: async (_: any, { id }: { id: string }): Promise<any> => {
      // First delete related noteToUsers entries
      await db.delete(noteToUsers).where(eq(noteToUsers.noteId, id));

      // Then delete the note itself
      const [deletedNote] = await db
        .delete(notes)
        .where(eq(notes.id, id))
        .returning();
      return deletedNote;
    },
  },
  Note: {
    activeUsers: async (note: { id: string }): Promise<any[]> => {
      const userConnections = await db.query.noteToUsers.findMany({
        where: eq(noteToUsers.noteId, note.id),
        with: {
          user: true,
        },
      });
      return userConnections.map((conn) => conn.user);
    },
  },
};
