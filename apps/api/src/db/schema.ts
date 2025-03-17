import {
  pgTable,
  uuid,
  text,
  timestamp,
  jsonb,
  integer,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { sql } from "drizzle-orm";

// Create a SQL query to enable the uuid-ossp extension
// I couldn't get this to work with drizzle-kit so I just run it manually before running the other commands
// https://github.com/drizzle-team/drizzle-orm/issues/1238
// export const createExtension = sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

// Add this constant for UUID generation
const generateUuid = sql`uuid_generate_v4()`;

export const blockTypeEnum = pgEnum("block_type", [
  "paragraph",
  "heading1",
  "heading2",
  "heading3",
  "bulletList",
  "numberedList",
  "quote",
  "code",
]);

export const notes = pgTable("notes", {
  id: uuid("id").primaryKey().default(generateUuid),
  title: text("title").notNull(),
  content: text("content").notNull(),
  blocks: jsonb("blocks").notNull().$type<Block[]>().default([]),
  color: text("color").notNull(),
  version: integer("version").notNull().default(1),
  created: timestamp("created").notNull().defaultNow(),
  createdBy: text("created_by").notNull(), // Remove foreign key constraint
  lastEdited: timestamp("last_edited").notNull().defaultNow(),
  lastEditedBy: text("last_edited_by").notNull(), // Remove foreign key constraint
});

export const noteUser = pgTable("note_user", {
  noteId: uuid("note_id")
    .references(() => notes.id)
    .notNull(),
  userId: text("user_id").notNull(), // Remove foreign key constraint if it exists
});

// Define relations
export const notesRelations = relations(notes, ({ many }) => ({
  activeUsers: many(noteUser),
}));

export const noteToUsersRelations = relations(noteUser, ({ one }) => ({
  note: one(notes, {
    fields: [noteUser.noteId],
    references: [notes.id],
  }),
}));

// Types
export interface Block {
  id: string;
  type:
    | "paragraph"
    | "heading1"
    | "heading2"
    | "heading3"
    | "bulletList"
    | "numberedList"
    | "quote"
    | "code";
  content: string;
}

export const schemaWithRelations = {
  notes,
  noteUser,
  notesRelations,
  noteToUsersRelations,
};