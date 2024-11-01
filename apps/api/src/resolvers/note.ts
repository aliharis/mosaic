import { db } from "@/config/database";
import { notes, noteToUsers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createPubSub } from "@graphql-yoga/subscription";

interface NoteInput {
  id: string;
  title: string;
  content: string;
  blocks: any[];
  color: string;
  version: number;
  created: Date;
  createdBy: string;
  lastEdited: Date;
  lastEditedBy: string;
}

interface UpdateNoteInput {
  title: string | null;
  color: string | null;
  blocks: any[] | null;
  version: number;
  lastEdited: Date;
  lastEditedBy: string;
}

const pubsub = createPubSub();
const NOTE_UPDATED = "NOTE_UPDATED";

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
    createNote: async (_: any, { note }: { note: NoteInput }): Promise<any> => {
      const [newNote] = await db
        .insert(notes)
        .values({
          id: note.id,
          title: note.title,
          content: note.content,
          blocks: note.blocks,
          color: note.color,
          version: note.version,
          created: note.created,
          createdBy: note.createdBy,
          lastEdited: note.lastEdited,
          lastEditedBy: note.lastEditedBy,
        })
        .returning();
      return newNote;
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
          ...(changes.title !== null && { title: changes.title }),
          ...(changes.color !== null && { color: changes.color }),
          ...(changes.blocks !== null && { blocks: changes.blocks }),
          version: changes.version,
          lastEdited: changes.lastEdited,
          lastEditedBy: changes.lastEditedBy,
        })
        .where(eq(notes.id, id))
        .returning();

      // Publish the update to all subscribers
      pubsub.publish(`${NOTE_UPDATED}.${id}`, {
        noteUpdated: updatedNote,
      });

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

  Subscription: {
    noteUpdated: {
      subscribe: (_: any, { id }: { id: string }) =>
        pubsub.subscribe(`${NOTE_UPDATED}.${id}`),
      resolve: (payload: any) => payload.noteUpdated,
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
