import { db } from "../config/database";
import { notes, noteToUsers } from "../db/schema";
import { eq } from "drizzle-orm";
import { sql } from "drizzle-orm";

export default {
  Query: {
    notes: async () => {
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
    note: async (_, { id }) => {
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
    createNote: async (_, { input }) => {
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
    addUserToNote: async (_, { noteId, userId }) => {
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
  },
  Note: {
    activeUsers: async (note) => {
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
